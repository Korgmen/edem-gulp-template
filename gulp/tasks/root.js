export const root = () => {
	return app.gulp.src('src/root/**/*.*', { encoding: false })
		.pipe(app.gulp.dest('build/'))
		.pipe(app.plugins.browserSync.stream())
}