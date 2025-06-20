import webpack from 'webpack-stream';

export const js = () => {
	return app.gulp.src('src/js/main.js', { sourcemaps: app.isDev })
	.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'JS', message: 'Error: <%= error.message %>'})))
		.pipe(webpack({
			mode: app.isBuild ? 'production' : 'development',
			output: { filename: 'main.js' }
		}))
		.pipe(app.gulp.dest('build/js/'))
		.pipe(app.plugins.browserSync.stream())
}