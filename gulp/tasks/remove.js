import fs from 'fs/promises';
import path from 'path';
import readline from 'readline/promises';
import { paths } from '../config/paths.js';

const SAMPLES = {
	demo: {
		title: 'стартовую страницу шаблона',
		targets: ['src/html/_demo', 'src/scss/_demo'],
	},
	example: {
		title: 'справочник компонентов',
		targets: ['src/html/_example', 'src/scss/_example', 'src/js/_example', 'src/img/_example', paths.example.scss, paths.example.js],
	},
};

const exists = (target) => fs.access(target).then(() => true, () => false);

const listFiles = async (dir, ext) => {
	const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true }).catch(() => []);
	return entries
		.filter((entry) => entry.isFile() && entry.name.endsWith(ext))
		.map((entry) => path.join(entry.parentPath, entry.name));
};

const escape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Подключения удаляемой папки живут в общих файлах: include в чанках, @@if-блоки ассетов, load-css и имя слоя в main.scss
const stripReferences = (content, name) => {
	const folder = escape(`_${name}/`);
	const next = content
		.replace(new RegExp(`^[\\t ]*@@if \\(context\\.${name}\\) \\{\\n[\\s\\S]*?^[\\t ]*\\}\\n?`, 'gm'), '')
		.replace(new RegExp(`^[\\t ]*@@include\\([^)]*${folder}[^)]*\\)[^\\n]*\\n?`, 'gm'), '')
		.replace(new RegExp(`^(?:[\\t ]*//[^\\n]*==========\\n)?[^\\n]*meta\\.load-css\\('${folder}[^\\n]*\\n?`, 'gm'), '')
		.replace(/^@layer ([^;{]+);/gm, (match, list) => `@layer ${list.split(',').map((layer) => layer.trim()).filter((layer) => layer !== name).join(', ')};`)
		.replace(/\n{3,}/g, '\n\n');
	return content.endsWith('\n') ? next.trimEnd() + '\n' : next.trimEnd();
};

const confirm = async (question) => {
	if (process.argv.includes('--yes')) return true;
	if (!process.stdin.isTTY) {
		console.error('\x1b[31mУдаление требует подтверждения — запустите в терминале или добавьте флаг --yes\x1b[0m');
		return false;
	}
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	const answer = await rl.question(`${question} [y/N] `);
	rl.close();
	return answer.trim().toLowerCase() === 'y';
};

const removeSample = (name) => async () => {
	const { title, targets } = SAMPLES[name];
	const found = (await Promise.all(targets.map(async (target) => ((await exists(target)) ? target : null)))).filter(Boolean);

	const candidates = [...(await listFiles('src/html', '.html')), paths.scss.entry];
	const edits = [];
	for (const file of candidates) {
		if (found.some((target) => file.startsWith(target + path.sep)) || !(await exists(file))) continue;
		const content = await fs.readFile(file, 'utf8');
		const next = stripReferences(content, name);
		if (next !== content) edits.push({ file, next });
	}

	if (!found.length && !edits.length) {
		console.log(`Уже удалено: ${title}.`);
		return;
	}

	console.log(`Будет удалено (${title}):`);
	found.forEach((target) => console.log(`  - ${target}`));
	edits.forEach(({ file }) => console.log(`  ~ ${file} (подключения)`));
	if (!(await confirm('Продолжить?'))) {
		process.exitCode = 1;
		return;
	}

	await Promise.all(found.map((target) => fs.rm(target, { recursive: true, force: true })));
	await Promise.all(edits.map(({ file, next }) => fs.writeFile(file, next)));
	console.log('Готово. Перезапустите pnpm dev, если он запущен.');
};

export const demoRemove = removeSample('demo');
export const exampleRemove = removeSample('example');
