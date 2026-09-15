import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import fileInclude from 'gulp-file-include';
import htmlMin from 'gulp-html-minifier-terser';

export const html = () => {
	return app.gulp.src([paths.html.src, `!${paths.html.chunks}`, ...(app.isBuild ? [`!${paths.html.drafts}`] : [])])
		.pipe(app.plugins.plumber(app.plugins.notify.onError({ title: 'HTML', message: 'Error: <%= error.message %>' })))
		.pipe(fileInclude({ context: { env: app.env } }))
		.pipe(app.plugins.rename(path => { path.dirname = "" }))
		.pipe(app.plugins.if(app.isBuild, htmlMin({ collapseWhitespace: true, collapseInlineTagWhitespace: true })))
		.pipe(app.gulp.dest(paths.html.dest))
		.pipe(app.plugins.browserSync.stream())
}