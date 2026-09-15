import fileInclude from 'gulp-file-include';
import htmlMin from 'gulp-html-minifier-terser';

export const html = () => {
	return app.gulp.src(['src/html/**/*.html', '!src/html/chunks/**/*.html', ...(app.isBuild ? ['!src/html/**/_*.html'] : [])])
		.pipe(app.plugins.plumber(app.plugins.notify.onError({ title: 'HTML', message: 'Error: <%= error.message %>' })))
		.pipe(fileInclude({ context: { env: app.env } }))
		.pipe(app.plugins.rename(path => { path.dirname = "" }))
		.pipe(app.plugins.if(app.isBuild, htmlMin({ collapseWhitespace: true, collapseInlineTagWhitespace: true })))
		.pipe(app.gulp.dest('build/'))
		.pipe(app.plugins.browserSync.stream())
}