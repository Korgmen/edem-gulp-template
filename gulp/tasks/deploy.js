import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import SftpClient from 'ssh2-sftp-client';
import deployConfig from '../../deploy.config.js';

const RETRY_DELAYS = [1000, 2000, 5000, 10000, 20000];
const DEBOUNCE_MS = 300;
const CONCURRENCY = 4;

const time = () => new Date().toLocaleTimeString('ru-RU');
const log = (message) => console.log(`[${time()}] [deploy] ${message}`);
const logError = (message) => console.error(`\x1b[31m[${time()}] [deploy] ${message}\x1b[0m`);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const expandHome = (filePath) => filePath.replace(/^~(?=$|[\\/])/, os.homedir());
const normalizeFingerprint = (value) => value.trim().replace(/^SHA256:/, '').replace(/=+$/, '');

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

	return {
		host: env.DEPLOY_HOST,
		port: Number(env.DEPLOY_PORT) || 22,
		username: env.DEPLOY_USERNAME,
		password: env.DEPLOY_PASSWORD || undefined,
		passphrase: env.DEPLOY_PASSPHRASE || undefined,
		privateKey,
		fingerprint: normalizeFingerprint(env.DEPLOY_HOST_FINGERPRINT || ''),
	};
};

const createConnection = (settings) => {
	let client = null;
	let connecting = null;
	let homeDir = '';
	let fatal = null;
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

	const upload = async (localFile, remoteFile) => {
		const sftp = await connect();
		const remotePath = path.posix.isAbsolute(remoteFile) ? remoteFile : path.posix.join(homeDir, remoteFile);

		await ensureDir(sftp, path.posix.dirname(remotePath));
		await sftp.put(localFile, remotePath);
	};

	const reset = async () => {
		const current = client;
		client = null;
		try {
			await current?.end();
		} catch { }
	};

	return { upload, reset, close: reset, isFatal: () => Boolean(fatal) };
};

const isRetryable = (err) => !(err instanceof FatalError) && !/permission denied|bad path/i.test(err.message);

const createUploader = (connection) => {
	let fatalReported = false;

	return async (job) => {
		for (let attempt = 0; ; attempt++) {
			const startedAt = Date.now();
			try {
				await connection.upload(job.local, job.remote);
				log(`↑ ${job.label} (${Date.now() - startedAt} мс)`);
				return true;
			} catch (err) {
				if (err instanceof FatalError) {
					if (!fatalReported) logError(`${err.message}\nВыгрузка остановлена — исправьте .env и перезапустите задачу`);
					fatalReported = true;
					return false;
				}
				if (!isRetryable(err) || attempt >= RETRY_DELAYS.length) {
					logError(`не удалось выгрузить ${job.label}: ${err.message}`);
					return false;
				}
				const delay = RETRY_DELAYS[attempt];
				log(`ошибка при выгрузке ${job.label}: ${err.message} — переподключение через ${delay / 1000} с`);
				await connection.reset();
				await wait(delay);
			}
		}
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
export const deployWatch = () => start(() => {
	const connection = createConnection(readSettings());
	const uploadJob = createUploader(connection);
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
		app.gulp.watch(target.globs, { cwd: target.localPath }).on('change', onChange).on('add', onChange);
	});

	log(`автовыгрузка включена: ${targets.map((target) => `${target.local} → ${target.remote}`).join(', ')}`);
});

// Полная выгрузка всех файлов из deploy.config.js (pnpm run deploy)
export const deployAll = () => start(async () => {
	const connection = createConnection(readSettings());
	const uploadJob = createUploader(connection);
	const jobs = [];

	for (const target of getTargets()) {
		const files = await listFiles(target);
		files.forEach((filePath) => {
			const job = createJob(target, filePath);
			if (job) jobs.push(job);
		});
	}

	log(`выгрузка файлов: ${jobs.length}`);
	let failed = 0;
	await runPool(jobs, CONCURRENCY, async (job) => {
		if (!(await uploadJob(job))) failed++;
	});
	await connection.close();

	if (failed) throw new Error(`не выгружено файлов: ${failed} из ${jobs.length}`);
	log('выгрузка завершена');
});
