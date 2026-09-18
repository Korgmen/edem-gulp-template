import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DOCS = ['README.md', 'CHANGELOG.md', ...listFiles('docs', '.md'), ...listFiles('gulp/plugins', '.md')];
// CHANGELOG описывает удалённые и переименованные файлы, пути в нём проверять нельзя
const PATH_CHECK_EXCLUDE = new Set(['CHANGELOG.md']);
const PATH_PREFIXES = ['src/', 'gulp/', 'docs/', '.vscode/', '.github/'];
const MODULES_DOC = 'docs/js.md';

function listFiles(dir, ext) {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(ext))
		.map((entry) => path.relative(ROOT, path.join(entry.parentPath, entry.name)));
}

// Разметка кода не должна давать ни ссылок, ни заголовков
const stripCode = (text) =>
	text.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '').replace(/^(?: {4}|\t)(?![-*+] |\d+\. ).*$/gm, '');

// Якорь заголовка по правилам GitHub: без разметки и пунктуации, пробелы в дефисы, повторы с суффиксом -N
const slugify = (heading) =>
	heading
		.replace(/<[^>]+>/g, '')
		.replace(/`/g, '')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.trim()
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
		.replace(/\s/g, '-');

const cache = new Map();

const parse = (file) => {
	if (cache.has(file)) return cache.get(file);
	const raw = fs.readFileSync(file, 'utf8');
	const text = stripCode(raw);
	const anchors = new Set();
	const ids = new Map();
	const seen = new Map();

	for (const [, heading] of text.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
		const base = slugify(heading);
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		anchors.add(count ? `${base}-${count}` : base);
	}
	for (const [, id] of text.matchAll(/<[a-z0-9]+[^>]*\sid="([^"]+)"/gi)) {
		ids.set(id, (ids.get(id) ?? 0) + 1);
		anchors.add(id);
	}

	const result = { raw, text, anchors, ids };
	cache.set(file, result);
	return result;
};

const errors = [];
const lineOf = (source, index) => source.slice(0, index).split('\n').length;

for (const file of DOCS) {
	if (!fs.existsSync(file)) continue;
	const { raw, text, ids } = parse(file);

	for (const [id, count] of ids) {
		if (count > 1) errors.push(`${file}: id "${id}" повторяется ${count} раза`);
	}

	const prose = text.replace(/`[^`\n]*`/g, '');
	const links = [
		...[...prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => m[1]),
		...[...prose.matchAll(/<a\s[^>]*href="([^"]+)"/gi)].map((m) => m[1]),
	];

	for (const link of links) {
		if (/^[a-z][a-z0-9+.-]*:|^\/\//i.test(link)) continue;
		const [target, hash] = link.split('#');
		const targetFile = target ? path.normalize(path.join(path.dirname(file), decodeURI(target))) : file;

		if (!fs.existsSync(targetFile)) {
			errors.push(`${file}: ссылка на несуществующий файл ${link}`);
			continue;
		}
		if (hash === undefined || !targetFile.endsWith('.md')) continue;
		if (!parse(targetFile).anchors.has(decodeURIComponent(hash))) {
			errors.push(`${file}: якорь не найден ${link}`);
		}
	}

	if (PATH_CHECK_EXCLUDE.has(file)) continue;
	for (const match of raw.matchAll(/`([^`\n]+)`/g)) {
		const value = match[1];
		if (!PATH_PREFIXES.some((prefix) => value.startsWith(prefix))) continue;
		if (/[\s*<>{}…|]/.test(value)) continue;
		if (!fs.existsSync(value.replace(/:\d+$/, ''))) {
			errors.push(`${file}:${lineOf(raw, match.index)}: путь не существует ${value}`);
		}
	}
}

// Маркеры [readme N] в коде указывают на «Раздел N» или «Модуль N» в документации модулей
if (fs.existsSync(MODULES_DOC)) {
	const { text } = parse(MODULES_DOC);
	const sections = new Set([...text.matchAll(/^#{2,6}.*?(?:Раздел|Модуль)\s+([\d.]+?)\.?\s/gm)].map((m) => m[1]));

	for (const file of listFiles('src', '.js').concat(listFiles('src', '.scss'))) {
		const source = fs.readFileSync(file, 'utf8');
		for (const match of source.matchAll(/\[readme ([^\]]+)\]/g)) {
			for (const number of match[1].split(/,\s*/)) {
				if (!sections.has(number)) {
					errors.push(`${file}:${lineOf(source, match.index)}: нет раздела ${number} в ${MODULES_DOC}`);
				}
			}
		}
	}
}

if (errors.length) {
	console.error(errors.join('\n'));
	console.error(`\nОшибок в документации: ${errors.length}`);
	process.exitCode = 1;
} else {
	console.log(`Документация в порядке: ${DOCS.length} файлов`);
}
