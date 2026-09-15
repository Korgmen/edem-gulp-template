import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssMQP from 'gulp-css-mqpacker';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(paths.scss.entry, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(app.plugins.notify.onError({ title: 'SCSS', message: 'Error: <%= error.message %>' })))
		.pipe(sass({ outputStyle: 'expanded', loadPaths: ['node_modules'], silenceDeprecations: ['legacy-js-api'] }).on('error', function () { this.emit('end') }))
		.pipe(autoprefixer())
		.pipe(app.plugins.rename('style.css'))
		.pipe(app.gulp.dest(paths.scss.dest))
		.pipe(app.plugins.browserSync.stream())
}