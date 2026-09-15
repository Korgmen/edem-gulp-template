import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';
import imagemin from 'gulp-imagemin';

export const img = () => {
	return app.gulp.src([paths.img.src, `!${paths.img.icons}`], { encoding: false })
		.pipe(handleErrors('IMAGE'))
		.pipe(app.plugins.newer(paths.img.dest))
		.pipe(app.plugins.if(app.isDev, app.gulp.dest(paths.img.dest)))
		.pipe(app.plugins.if(app.isBuild, app.gulp.src([paths.img.src, `!${paths.img.icons}`], { encoding: false })))
		.pipe(app.plugins.if(app.isBuild, imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3
		})))
		.pipe(app.plugins.if(app.isBuild, app.gulp.dest(paths.img.dest)))
		.pipe(app.plugins.browserSync.stream())
}