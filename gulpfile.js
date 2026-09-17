import path from 'path';
import gulp from 'gulp';
import { deleteAsync } from 'del';
import { app } from './gulp/config/app.js';
import { paths } from './gulp/config/paths.js';

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
import { deployCheck, deployWatch, deployAll } from './gulp/tasks/deploy.js';
import { demoRemove, exampleRemove } from './gulp/tasks/remove.js';

const removeFromBuild = (srcBase, destBase) => (filePath) =>
	deleteAsync(path.join(destBase, path.relative(srcBase, filePath)));

function watcher(done) {
	gulp.watch(paths.html.src, html);
	// Исключаются только автогенерируемые индексы: их перезапись в generateIndexSCSS не должна повторно запускать компиляцию
	gulp.watch([paths.scss.watch, ...paths.scss.generatedIndexDirs.map((dir) => `!${dir}/index.scss`)], styles);
	gulp.watch(paths.js.watch, js);
	gulp.watch(paths.svg.src, svg);
	gulp.watch([paths.img.src, `!${paths.img.icons}`], img).on(
		'unlink',
		removeFromBuild(paths.img.base, paths.img.dest),
	);
	gulp.watch(paths.root.src, root).on('unlink', removeFromBuild(paths.root.base, paths.root.dest));
	gulp.watch(paths.fonts.watch, font).on('unlink', (filePath) =>
		deleteAsync(path.join(paths.fonts.dest, path.basename(filePath).replace(/\.ttf$/, '.woff2'))),
	);
	done();
}

// Индексы components/layout должны быть записаны до компиляции SCSS, иначе в CSS попадёт устаревший набор компонентов
const styles = gulp.series(generateIndexSCSS, scss);
const mainTasks = gulp.parallel(html, styles, js, svg, img, root, font);
const buildTasks = gulp.series(gulp.parallel(styles, js, svg, img, root, font), html);

const devTasks = app.isDeploy
	? gulp.series(deployCheck, reset, mainTasks, gulp.parallel(watcher, server, deployWatch))
	: gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

export default devTasks;
const build = gulp.series(reset, buildTasks);
const deploy = gulp.series(deployCheck, reset, buildTasks, deployAll);

export { build };
export { deploy };
export { generateIndexSCSS };
export { svg };
export { html };
export { styles as scss };
export { js };
export { font };
export { img };
export { root };
export { demoRemove, exampleRemove };
