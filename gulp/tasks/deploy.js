import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline/promises';
import picomatch from 'picomatch';
import SftpClient from 'ssh2-sftp-client';
import deployConfig from '../../deploy.config.js';
import { app } from '../config/app.js';

const RETRY_DELAYS = [1000, 2000, 5000, 10000, 20000];
const DEBOUNCE_MS = 300;
const CONCURRENCY = 4;
const CACHE_FILE = '.deploy-cache.json';
const TEMP_SUFFIX = '.uploading';

const time = () => new Date().toLocaleTimeString('ru-RU');
const log = (message) => console.log(`[${time()}] [deploy] ${message}`);
const logError = (message) => console.error(`\x1b[31m[${time()}] [deploy] ${message}\x1b[0m`);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const expandHome = (filePath) => filePath.replace(/^~(?=$|[\\/])/, os.homedir());
const normalizeFingerprint = (value) => value.trim().replace(/^SHA256:/, '').replace(/=+$/, '');
const hash = (content) => crypto.createHash('sha1').update(content).digest('hex');

class FatalError extends Error { }

const readSettings = () => {
	try {
		process.loadEnvFile('.env');
	} catch (err) {
		if (err.code === 'ENOENT') throw new FatalError('Не найден файл .env — скопируйте .env.example в .env и заполните доступы');
		throw err;
	}

	const env = process.env;
	const missing = ['DEPLOY_HOST', 'DEPLOY_USERNAME'].filter((key) => !env[key]);
	if (missing.length) throw new FatalError(`В .env не заполнено: ${missing.join(', ')}`);
	if (!env.DEPLOY_PRIVATE_KEY && !env.DEPLOY_PASSWORD) throw new FatalError('В .env нужно указать DEPLOY_PRIVATE_KEY или DEPLOY_PASSWORD');

	let privateKey;
	if (env.DEPLOY_PRIVATE_KEY) {
		const keyPath = expandHome(env.DEPLOY_PRIVATE_KEY);
		if (!fs.existsSync(keyPath)) throw new FatalError(`Не найден SSH-ключ: ${keyPath}`);
		privateKey = fs.readFileSync(keyPath);
	}

	const port = Number(env.DEPLOY_PORT) || 22;

	return {
		host: env.DEPLOY_HOST,
		port,
		username: env.DEPLOY_USERNAME,
		password: env.DEPLOY_PASSWORD || undefined,
		passphrase: env.DEPLOY_PASSPHRASE || undefined,
		privateKey,
		fingerprint: normalizeFingerprint(env.DEPLOY_HOST_FINGERPRINT || ''),
		cacheKey: `${env.DEPLOY_USERNAME}@${env.DEPLOY_HOST}:${port}`,
	};
};

const createCache = (key, { reset = false } = {}) => {
	const readAll = () => {
		try {
			return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
		} catch {
			return {};
		}
	};
	const entries = reset ? {} : (readAll()[key] ?? {});

	return {
		isUploaded: (remote, contentHash) => entries[remote] === contentHash,
		set: (remote, contentHash) => { entries[remote] = contentHash; },
		remove: (remote) => { delete entries[remote]; },
		save: () => {
			const all = readAll();
			all[key] = entries;
			fs.writeFileSync(`${CACHE_FILE}.tmp`, JSON.stringify(all, null, '\t'));
			fs.renameSync(`${CACHE_FILE}.tmp`, CACHE_FILE);
		},
	};
};

const createConnection = (settings) => {
	let client = null;
	let connecting = null;
	let homeDir = '';
	let fatal = null;
	let atomicRename = true;
	const dirs = new Map();

	const connect = () => {
		if (fatal) return Promise.reject(fatal);
		if (client) return Promise.resolve(client);
		if (connecting) return connecting;

		connecting = (async () => {
			let hostError = null;
			const onClosed = () => {
				if (client === sftp) client = null;
			};
			const sftp = new SftpClient('deploy', { error: onClosed, end: onClosed, close: onClosed });

			try {
				await sftp.connect({
					host: settings.host,
					port: settings.port,
					username: settings.username,
					password: settings.password,
					privateKey: settings.privateKey,
					passphrase: settings.passphrase,
					readyTimeout: 20000,
					// keepalive не даёт VPN/NAT молча оборвать простаивающее соединение
					keepaliveInterval: 10000,
					keepaliveCountMax: 3,
					hostVerifier: (key) => {
						const received = crypto.createHash('sha256').update(key).digest('base64').replace(/=+$/, '');
						if (!settings.fingerprint) {
							hostError = new FatalError(`Отпечаток ключа сервера: SHA256:${received}\nСверьте его (ssh-keyscan -p ${settings.port} ${settings.host} | ssh-keygen -lf -) и впишите в DEPLOY_HOST_FINGERPRINT в .env`);
							return false;
						}
						if (received !== settings.fingerprint) {
							hostError = new FatalError(`Отпечаток ключа сервера не совпадает с DEPLOY_HOST_FINGERPRINT (получен SHA256:${received}). Возможна подмена сервера — выгрузка остановлена`);
							return false;
						}
						return true;
					},
				});
			} catch (err) {
				if (hostError) fatal = hostError;
				else if (/authentication/i.test(err.message)) fatal = new FatalError('Ошибка авторизации на сервере — проверьте логин, ключ или пароль в .env');
				throw fatal || err;
			}

			homeDir = await sftp.cwd();
			client = sftp;
			log(`подключено к ${settings.host}`);
			return sftp;
		})().finally(() => {
			connecting = null;
		});

		return connecting;
	};

	const resolveRemote = (remote) => {
		if (!homeDir) throw new Error('путь на сервере нельзя вычислить до подключения');
		return path.posix.isAbsolute(remote) ? path.posix.normalize(remote) : path.posix.join(homeDir, remote);
	};

	// Параллельные загрузки создают папки по уровням через общий промис на каждую папку,
	// иначе одновременный mkdir одной и той же папки падает с ошибкой «уже существует»
	const ensureDir = (sftp, dir) => {
		if (!dirs.has(dir)) {
			const parent = path.posix.dirname(dir);
			const promise = (async () => {
				if (parent !== dir && dir !== homeDir) await ensureDir(sftp, parent);
				if ((await sftp.exists(dir)) === 'd') return;
				try {
					await sftp.mkdir(dir);
				} catch (err) {
					if ((await sftp.exists(dir)) !== 'd') throw err;
				}
			})();
			dirs.set(dir, promise);
			promise.catch(() => dirs.delete(dir));
		}
		return dirs.get(dir);
	};

	// Файл пишется во временный и заменяет старый одной операцией — посетитель не получит наполовину залитый файл
	const replaceFile = async (sftp, tempPath, remotePath) => {
		if (atomicRename) {
			try {
				await sftp.posixRename(tempPath, remotePath);
				return;
			} catch (err) {
				if (!/does not support/i.test(err.message)) throw err;
				if (atomicRename) log('сервер не поддерживает posix-rename — файлы заменяются удалением и переименованием (не атомарно)');
				atomicRename = false;
			}
		}
		await sftp.delete(remotePath, true);
		await sftp.rename(tempPath, remotePath);
	};

	const upload = async (content, remoteFile) => {
		const sftp = await connect();
		const remotePath = resolveRemote(remoteFile);
		const tempPath = `${remotePath}${TEMP_SUFFIX}`;

		await ensureDir(sftp, path.posix.dirname(remotePath));
		try {
			await sftp.put(content, tempPath);
			await replaceFile(sftp, tempPath, remotePath);
		} catch (err) {
			await sftp.delete(tempPath, true).catch(() => { });
			throw err;
		}
	};

	const listFiles = async (remoteDir) => {
		const sftp = await connect();
		const root = resolveRemote(remoteDir);
		if ((await sftp.exists(root)) !== 'd') return { root, files: [] };

		const files = [];
		const walk = async (dir) => {
			for (const entry of await sftp.list(dir)) {
				const entryPath = path.posix.join(dir, entry.name);
				if (entry.type === 'd') await walk(entryPath);
				else if (entry.type === '-') files.push(entryPath);
			}
		};
		await walk(root);
		return { root, files };
	};

	const remove = async (remoteFile) => {
		const sftp = await connect();
		await sftp.delete(resolveRemote(remoteFile), true);
	};

	const reset = async () => {
		const current = client;
		client = null;
		try {
			await current?.end();
		} catch { }
	};

	return { connect, upload, listFiles, remove, resolveRemote, getHomeDir: () => homeDir, reset, close: reset, isFatal: () => Boolean(fatal) };
};

const isRetryable = (err) => !(err instanceof FatalError) && !/permission denied|bad path/i.test(err.message);

const withRetry = (connection) => {
	let fatalReported = false;

	return async (label, action) => {
		for (let attempt = 0; ; attempt++) {
			try {
				return { ok: true, value: await action() };
			} catch (err) {
				if (err instanceof FatalError) {
					if (!fatalReported) logError(`${err.message}\nВыгрузка остановлена — исправьте .env и перезапустите задачу`);
					fatalReported = true;
					return { ok: false };
				}
				if (!isRetryable(err) || attempt >= RETRY_DELAYS.length) {
					logError(`не удалось ${label}: ${err.message}`);
					return { ok: false };
				}
				const delay = RETRY_DELAYS[attempt];
				log(`ошибка при попытке ${label}: ${err.message} — переподключение через ${delay / 1000} с`);
				await connection.reset();
				await wait(delay);
			}
		}
	};
};

const createUploader = (connection, cache) => {
	const retry = withRetry(connection);

	return async (job) => {
		if (!fs.existsSync(job.local)) return true;
		const content = fs.readFileSync(job.local);
		const contentHash = hash(content);
		if (cache.isUploaded(job.remote, contentHash)) return true;

		const startedAt = Date.now();
		const { ok } = await retry(`выгрузить ${job.label}`, () => connection.upload(content, job.remote));
		if (!ok) return false;
		cache.set(job.remote, contentHash);
		log(`↑ ${job.label} (${Date.now() - startedAt} мс)`);
		return true;
	};
};

const runPool = async (items, limit, worker) => {
	const queue = [...items];
	const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
		while (queue.length) await worker(queue.shift());
	});
	await Promise.all(workers);
};

const getTargets = () => deployConfig.targets.map((target) => ({
	...target,
	localPath: path.resolve(target.local),
	globs: [...target.files, ...(target.ignore ?? []).map((glob) => `!${glob}`)],
	isDeployable: picomatch(target.files, { ignore: target.ignore ?? [] }),
}));

const createJob = (target, filePath) => {
	const local = path.resolve(target.localPath, filePath);
	const relative = path.relative(target.localPath, local).split(path.sep).join('/');
	if (!relative || relative.startsWith('..')) return null;
	return { local, remote: path.posix.join(target.remote, relative), label: `${target.local}/${relative}` };
};

const listFiles = (target) => new Promise((resolve, reject) => {
	const files = [];
	app.gulp.src(target.globs, { cwd: target.localPath, read: false, allowEmpty: true })
		.on('data', (file) => {
			if (!file.stat?.isDirectory()) files.push(file.path);
		})
		.on('end', () => resolve(files))
		.on('error', reject);
});

const collectJobs = async (targets) => {
	const jobs = [];
	for (const target of targets) {
		(await listFiles(target)).forEach((filePath) => {
			const job = createJob(target, filePath);
			if (job) jobs.push(job);
		});
	}
	return jobs;
};

// Файлы на сервере, которые подходят под files/ignore какой-либо цели, но которых больше нет локально
const findOrphans = async (connection, targets, jobs) => {
	await connection.connect();
	const expected = new Set(jobs.map((job) => connection.resolveRemote(job.remote)));
	const orphans = new Map();

	for (const target of targets) {
		const { root, files } = await connection.listFiles(target.remote);
		if (root === '/' || root === connection.getHomeDir()) {
			throw new FatalError(`--delete не выполняется для корня сервера или домашней папки (${target.local} → ${target.remote}) — укажите в deploy.config.js папку сайта`);
		}
		files.forEach((remotePath) => {
			const relative = path.posix.relative(root, remotePath);
			if (expected.has(remotePath) || orphans.has(remotePath)) return;
			if (remotePath.endsWith(TEMP_SUFFIX) || target.isDeployable(relative)) {
				orphans.set(remotePath, { remote: remotePath, label: `${target.remote}/${relative}` });
			}
		});
	}
	return [...orphans.values()];
};

const confirm = async (question) => {
	if (app.deployFlags.yes) return true;
	if (!process.stdin.isTTY) {
		logError('удаление файлов на сервере требует подтверждения — запустите в терминале или добавьте флаг --yes');
		return false;
	}
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	const answer = await rl.question(`${question} (y/N) `);
	rl.close();
	return /^(y|yes|д|да)$/i.test(answer.trim());
};

const printList = (title, items) => {
	if (!items.length) return;
	log(`${title}:`);
	items.forEach((item) => console.log(`    ${item.label}`));
};

const start = async (task) => {
	try {
		return await task();
	} catch (err) {
		logError(err.message);
		throw err;
	}
};

// Проверка .env до сборки, чтобы не ждать её окончания ради ошибки в настройках
export const deployCheck = () => start(() => {
	readSettings();
});

// Выгрузка изменённых файлов при каждом изменении (pnpm dev:deploy)
export const deployWatch = () => start(async () => {
	const settings = readSettings();
	const connection = createConnection(settings);
	const cache = createCache(settings.cacheKey, { reset: app.deployFlags.force });
	const uploadJob = createUploader(connection, cache);
	const targets = getTargets();
	const pending = new Map();
	let timer = null;
	let running = false;

	const flush = async () => {
		if (running) return;
		running = true;
		while (pending.size) {
			const jobs = [...pending.values()];
			pending.clear();
			await runPool(jobs, CONCURRENCY, uploadJob);
			cache.save();
		}
		running = false;
	};

	targets.forEach((target) => {
		const onChange = (filePath) => {
			if (connection.isFatal()) return;
			const job = createJob(target, filePath);
			if (!job) return;
			pending.set(job.remote, job);
			clearTimeout(timer);
			timer = setTimeout(flush, DEBOUNCE_MS);
		};
		app.gulp.watch(target.globs, { cwd: target.localPath, awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 } }).on('change', onChange).on('add', onChange);
	});

	log(`автовыгрузка включена: ${targets.map((target) => `${target.local} → ${target.remote}`).join(', ')}`);

	const changed = (await collectJobs(targets)).filter((job) => !cache.isUploaded(job.remote, hash(fs.readFileSync(job.local))));
	if (changed.length) {
		log(`выгрузка файлов, изменённых с прошлой выгрузки: ${changed.length}`);
		changed.forEach((job) => pending.set(job.remote, job));
		await flush();
	}
});

// Выгрузка всех изменённых файлов из deploy.config.js (pnpm run deploy)
export const deployAll = () => start(async () => {
	const { dryRun, force, remove } = app.deployFlags;
	const settings = readSettings();
	const connection = createConnection(settings);
	const cache = createCache(settings.cacheKey, { reset: force });
	const targets = getTargets();
	const jobs = await collectJobs(targets);
	const uploads = jobs.filter((job) => !cache.isUploaded(job.remote, hash(fs.readFileSync(job.local))));

	try {
		const orphans = remove ? await findOrphans(connection, targets, jobs) : [];

		log(`файлов: ${jobs.length}, к выгрузке: ${uploads.length}${force ? ' (--force)' : ''}${remove ? `, к удалению на сервере: ${orphans.length}` : ''}`);

		if (dryRun) {
			printList('будут выгружены', uploads);
			printList('будут удалены на сервере', orphans);
			log('--dry-run: на сервере ничего не изменено');
			return;
		}

		if (orphans.length) {
			printList('будут удалены на сервере', orphans);
			if (!(await confirm(`Удалить на сервере файлов: ${orphans.length}?`))) {
				throw new Error('выгрузка отменена — ничего не изменено');
			}
		}

		let failed = 0;
		const uploadJob = createUploader(connection, cache);
		await runPool(uploads, CONCURRENCY, async (job) => {
			if (!(await uploadJob(job))) failed++;
		});

		const retry = withRetry(connection);
		for (const orphan of orphans) {
			const { ok } = await retry(`удалить ${orphan.label}`, () => connection.remove(orphan.remote));
			if (!ok) {
				failed++;
				continue;
			}
			cache.remove(path.posix.relative(connection.getHomeDir(), orphan.remote));
			cache.remove(orphan.remote);
			log(`✕ ${orphan.label}`);
		}

		cache.save();
		if (failed) throw new Error(`не выполнено операций: ${failed}`);
		log('выгрузка завершена');
	} finally {
		await connection.close();
	}
});
