import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cssMQP from 'gulp-css-mqpacker';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(paths.scss.entry, { sourcemaps: app.isDev })
		.pipe(handleErrors('SCSS'))
		.pipe(sass({ outputStyle: 'expanded', loadPaths: ['node_modules'], silenceDeprecations: ['legacy-js-api'] }))
		.pipe(autoprefixer())
		.pipe(app.plugins.rename('style.css'))
		.pipe(app.gulp.dest(paths.scss.dest))
		.pipe(app.plugins.browserSync.stream())
}