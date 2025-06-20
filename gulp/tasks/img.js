import imagemin from 'gulp-imagemin';

export const img = () => {
	return app.gulp.src(['src/img/**/*.{png,jpg,jpeg,gif,svg}', '!src/img/icons/**/*.svg'], { encoding: false })
		.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'IMAGE', message: 'Error: <%= error.message %>'})))
		.pipe(app.plugins.newer('build/img'))
		.pipe(app.plugins.if(app.isDev, app.gulp.dest('build/img/')))
		.pipe(app.plugins.if(app.isBuild, app.gulp.src(['src/img/**/*.{png,jpg,jpeg,gif,svg}', '!src/img/icons/**/*.svg'], { encoding: false })))
		.pipe(app.plugins.if(app.isBuild, imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 3
		})))
		.pipe(app.plugins.if(app.isBuild, app.gulp.dest('build/img/')))
		.pipe(app.plugins.browserSync.stream())
}