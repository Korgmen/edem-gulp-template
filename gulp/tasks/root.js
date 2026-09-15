import { app } from '../config/app.js';
import { paths } from '../config/paths.js';

export const root = () => {
	return app.gulp.src(paths.root.src, { encoding: false })
		.pipe(app.gulp.dest(paths.root.dest))
		.pipe(app.plugins.browserSync.stream())
}