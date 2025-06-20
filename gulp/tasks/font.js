import ttf2woff2 from 'gulp-ttf2woff2';

export const font = () => {
	return app.gulp.src('src/fonts/*.ttf', { encoding: false })
		.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'FONTS', message: 'Error: <%= error.message %>'})))
		.pipe(app.plugins.if(app.isDev, ttf2woff2({ clone: true })))
		.pipe(app.plugins.if(app.isBuild, ttf2woff2()))
		.pipe(app.gulp.dest('build/fonts/'))
		.pipe(app.plugins.browserSync.stream())
}