import fs from 'fs';
import path from 'path';

export const generateIndexSCSS = () => {
	return new Promise((resolve, reject) => {
		const scssFolders = ['src/scss/components', 'src/scss/layout'];

		scssFolders.forEach(scssFolder => {
			const outputFile = `${scssFolder}/index.scss`;
			fs.readdir(scssFolder, (err, items) => {
				if (err) {
					console.error('Ошибка чтения директории:', err);
					reject(err);
					return;
				}

				let result = '';

				items.forEach(item => {
					const itemPath = path.join(scssFolder, item);

					fs.stat(itemPath, (statErr, stats) => {
						if (statErr) {
							console.error(`Ошибка при проверке элемента ${item}:`, statErr);
							return;
						}

						if (stats.isFile() && path.extname(item) === '.scss' && item !== 'index.scss') {
							result += `@forward '${path.basename(item, '.scss')}';\n`;
						} else if (stats.isDirectory()) {
							result += `@forward '${item}';\n`;
						}
					});
				});

				setTimeout(() => {
					fs.writeFile(outputFile, result, (writeErr) => {
						if (writeErr) {
							console.error('Ошибка записи в файл:', writeErr);
							reject(writeErr);
							return;
						}
						console.log(`Файл ${outputFile} успешно создан.`);
						resolve();
					});
				}, 100);
			});
		});
	});
}