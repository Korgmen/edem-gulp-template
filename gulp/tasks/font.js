import fs from 'fs/promises';
import path from 'path';
import ttf2woff2 from 'gulp-ttf2woff2';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';

// Конвертация ttf → woff2 долгая, поэтому результат хранится в кэше и пересчитывается только для изменённых шрифтов
const pruneCache = async () => {
	const sources = new Set((await fs.readdir(paths.fonts.base).catch(() => []))
		.filter(name => name.endsWith('.ttf'))
		.map(name => path.basename(name, '.ttf')));
	const cached = await fs.readdir(paths.fonts.cache).catch(() => []);
	await Promise.all(cached
		.filter(name => !sources.has(path.basename(name, '.woff2')))
		.map(name => fs.rm(path.join(paths.fonts.cache, name))));
};

const convert = () => {
	return app.gulp.src(paths.fonts.ttf, { encoding: false })
		.pipe(handleErrors('FONTS'))
		.pipe(app.plugins.newer({ dest: paths.fonts.cache, ext: '.woff2' }))
		.pipe(ttf2woff2())
		.pipe(app.gulp.dest(paths.fonts.cache))
};

const copy = () => {
	return app.gulp.src([`${paths.fonts.cache}/*.woff2`, paths.fonts.woff2], { encoding: false })
		.pipe(app.gulp.dest(paths.fonts.dest))
		.pipe(app.plugins.browserSync.stream())
};

export const font = app.gulp.series(pruneCache, convert, copy);
