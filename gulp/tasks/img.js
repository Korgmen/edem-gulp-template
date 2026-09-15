import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';

const optimize = () => imagemin([
	gifsicle({ interlaced: true }),
	mozjpeg({ quality: 80, progressive: true }),
	optipng({ optimizationLevel: 3 }),
	svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] }),
], { silent: true });

export const img = () => {
	return app.gulp.src([paths.img.src, `!${paths.img.icons}`], { encoding: false })
		.pipe(handleErrors('IMAGE'))
		.pipe(app.plugins.newer(paths.img.dest))
		.pipe(app.plugins.if(app.isBuild, optimize()))
		.pipe(app.gulp.dest(paths.img.dest))
		.pipe(app.plugins.browserSync.stream())
}
