import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import through from 'through2';
import PluginError from 'plugin-error';
import fileInclude from 'gulp-file-include';
import htmlMin from 'gulp-html-minifier-terser';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';

// Все страницы кладутся в корень build, поэтому одинаковые имена из разных папок перезаписали бы друг друга
const checkNameCollisions = () => {
	const pages = new Map();
	return through.obj((file, enc, callback) => {
		const name = path.basename(file.path);
		const relative = path.relative(file.cwd, file.path);
		if (pages.has(name)) {
			callback(new PluginError('html', `Страницы ${pages.get(name)} и ${relative} попадут в build под одним именем ${name} — переименуйте одну из них`));
			return;
		}
		pages.set(name, relative);
		callback(null, file);
	});
};

// В build ссылки на CSS и JS получают ?v=<хэш содержимого>, поэтому html собирается после них (см. gulpfile.js)
const assetVersion = (file) => {
	if (!app.isBuild) return '';
	if (!fs.existsSync(file)) throw new Error(`Не найден ${file}: html в build собирается после стилей и скриптов`);
	return `?v=${crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8)}`;
};

const exampleAssetVersion = (entry, file) => (!app.isProd && fs.existsSync(entry) ? assetVersion(file) : '');

export const html = () => {
	const context = {
		env: app.env,
		cssVersion: assetVersion(path.join(paths.scss.dest, 'style.css')),
		jsVersion: assetVersion(path.join(paths.js.dest, 'main.js')),
		exampleCssVersion: exampleAssetVersion(paths.example.scss, path.join(paths.scss.dest, 'example.css')),
		exampleJsVersion: exampleAssetVersion(paths.example.js, path.join(paths.js.dest, 'example.js')),
	};

	return app.gulp.src([
		paths.html.src,
		`!${paths.html.chunks}`,
		`!${paths.demo.html}`,
		...(app.isBuild ? [`!${paths.html.drafts}`] : []),
		...(app.isProd ? [`!${paths.example.html}`] : []),
	])
		.pipe(handleErrors('HTML'))
		.pipe(checkNameCollisions())
		.pipe(fileInclude({ context }))
		.pipe(app.plugins.rename(path => { path.dirname = "" }))
		.pipe(app.plugins.if(app.isBuild, htmlMin({ collapseWhitespace: true, conservativeCollapse: true })))
		.pipe(app.gulp.dest(paths.html.dest))
		.pipe(app.plugins.browserSync.stream())
}
