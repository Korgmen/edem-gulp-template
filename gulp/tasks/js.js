import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import webpack from 'webpack-stream';

export const js = () => {
	return app.gulp.src(paths.js.entry, { sourcemaps: app.isDev })
	.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'JS', message: 'Error: <%= error.message %>'})))
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			output: { filename: 'main.js' }
		}))
		.pipe(app.gulp.dest(paths.js.dest))
		.pipe(app.plugins.browserSync.stream())
}