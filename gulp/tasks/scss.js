import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssMQP from 'gulp-css-mqpacker';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src('src/scss/main.scss', { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(app.plugins.notify.onError({ title: 'SCSS', message: 'Error: <%= error.message %>' })))
		.pipe(sass({ outputStyle: 'expanded', includePaths: ['node_modules'], silenceDeprecations: ['legacy-js-api'] }).on('error', function () { this.emit('end') }))
		.pipe(autoprefixer())
		.pipe(app.plugins.rename('style.css'))
		.pipe(app.gulp.dest('build/css/'))
		.pipe(app.plugins.browserSync.stream())
}