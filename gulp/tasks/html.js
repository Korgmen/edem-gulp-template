import path from 'path';
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

export const html = () => {
	return app.gulp.src([paths.html.src, `!${paths.html.chunks}`, ...(app.isBuild ? [`!${paths.html.drafts}`] : [])])
		.pipe(handleErrors('HTML'))
		.pipe(checkNameCollisions())
		.pipe(fileInclude({ context: { env: app.env } }))
		.pipe(app.plugins.rename(path => { path.dirname = "" }))
		.pipe(app.plugins.if(app.isBuild, htmlMin({ collapseWhitespace: true, conservativeCollapse: true })))
		.pipe(app.gulp.dest(paths.html.dest))
		.pipe(app.plugins.browserSync.stream())
}
