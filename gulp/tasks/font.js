import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import ttf2woff2 from 'gulp-ttf2woff2';

export const font = () => {
	return app.gulp.src(paths.fonts.src, { encoding: false })
		.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'FONTS', message: 'Error: <%= error.message %>'})))
		.pipe(app.plugins.if(app.isDev, ttf2woff2({ clone: true })))
		.pipe(app.plugins.if(app.isBuild, ttf2woff2()))
		.pipe(app.gulp.dest(paths.fonts.dest))
		.pipe(app.plugins.browserSync.stream())
}