import fs from 'fs';
import through from 'through2';
import PluginError from 'plugin-error';
import browserslist from 'browserslist';
import { transform, browserslistToTargets } from 'lightningcss';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';

const sass = gulpSass(dartSass);
const targets = browserslistToTargets(browserslist());

const lightningcss = () => through.obj((file, enc, callback) => {
	try {
		const { code, map, warnings } = transform({
			filename: file.relative,
			code: file.contents,
			targets,
			minify: app.isBuild,
			errorRecovery: true,
			sourceMap: Boolean(file.sourceMap),
			inputSourceMap: file.sourceMap ? JSON.stringify(file.sourceMap) : undefined,
		});
		warnings.forEach(warning => console.warn(`\x1b[33m[lightningcss] ${warning.message} (${warning.loc.filename}:${warning.loc.line})\x1b[0m`));
		file.contents = Buffer.from(code);
		if (map) file.sourceMap = { ...JSON.parse(map.toString()), file: file.relative };
		callback(null, file);
	} catch (err) {
		callback(new PluginError('lightningcss', err.message));
	}
});

const entries = () => [
	paths.scss.entry,
	...(!app.isProd && fs.existsSync(paths.example.scss) ? [paths.example.scss] : []),
];

export const scss = () => {
	return app.gulp.src(entries(), { sourcemaps: app.isDev })
		.pipe(handleErrors('SCSS'))
		.pipe(sass({ outputStyle: 'expanded', loadPaths: ['node_modules'], silenceDeprecations: ['legacy-js-api'] }))
		.pipe(lightningcss())
		.pipe(app.plugins.rename(file => { if (file.basename === 'main') file.basename = 'style'; }))
		.pipe(app.gulp.dest(paths.scss.dest, { sourcemaps: app.isDev ? '.' : false }))
		.pipe(app.plugins.browserSync.stream({ match: '**/*.css' }))
}
