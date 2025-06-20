import gulp from 'gulp';
import { plugins } from './gulp/config/plugins.js';

global.app = {
	isDev: !process.argv.includes('--build'),
	isBuild: process.argv.includes('--build'),
	gulp: gulp,
	plugins: plugins
};

import { server } from './gulp/tasks/server.js';
import { reset } from './gulp/tasks/reset.js';
import { svg } from './gulp/tasks/svg.js';
import { html } from './gulp/tasks/html.js';
import { scss } from './gulp/tasks/scss.js';
import { generateIndexSCSS } from './gulp/tasks/generateIndexSCSS.js';
import { js } from './gulp/tasks/js.js';
import { font } from './gulp/tasks/font.js';
import { img } from './gulp/tasks/img.js';
import { root } from './gulp/tasks/root.js';

function watcher() {
	gulp.watch('./src/html/**/*.html', html);
	gulp.watch(['./src/scss/**/*.scss', '!./src/scss/**/index.scss'], generateIndexSCSS);
	gulp.watch(['./src/scss/**/*.scss', '!./src/scss/**/index.scss'], scss);
	gulp.watch('./src/js/**/*.js', js);
	gulp.watch('./src/img/icons/**/*.svg', svg);
	gulp.watch(['src/img/**/*.{png,jpg,jpeg,gif,svg}', '!src/img/icons/**/*.svg'], img);
	gulp.watch('./src/root/**/*.*', root);
	gulp.watch('./src/font/**/*.*', font);
}

const mainTasks = gulp.parallel(html, generateIndexSCSS, scss, js, svg, img, root, font);

export default gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

export { build }
export { generateIndexSCSS }
export { svg }
export { html }
export { scss }
export { js }
export { font }
export { img }
export { root }