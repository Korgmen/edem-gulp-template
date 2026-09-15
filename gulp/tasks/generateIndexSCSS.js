import fs from 'fs/promises';
import path from 'path';
import { paths } from '../config/paths.js';

const scssFolders = paths.scss.generatedIndexDirs;

const generateFolderIndex = async (folder) => {
	const entries = await fs.readdir(folder, { withFileTypes: true });

	// Сортировка — чтобы порядок @forward (а значит и порядок правил в CSS) не менялся от запуска к запуску
	const modules = entries
		.filter((entry) => !entry.name.startsWith('.'))
		.filter((entry) => entry.isDirectory() || (entry.isFile() && path.extname(entry.name) === '.scss' && entry.name !== 'index.scss'))
		.map((entry) => (entry.isDirectory() ? entry.name : path.basename(entry.name, '.scss')))
		.sort((a, b) => a.localeCompare(b));

	const content = modules.map((name) => `@forward '${name}';\n`).join('');
	const outputFile = path.join(folder, 'index.scss');
	const currentContent = await fs.readFile(outputFile, 'utf8').catch(() => null);

	if (currentContent === content) return;

	await fs.writeFile(outputFile, content);
	console.log(`Файл ${outputFile} успешно создан.`);
};

// Задача должна завершаться только после записи индексов во всех папках — scss запускается строго после неё
export const generateIndexSCSS = () => Promise.all(scssFolders.map(generateFolderIndex));
