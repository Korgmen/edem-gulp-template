import gulp from 'gulp';
import { plugins } from './gulp/config/plugins.js';

const isBuild = process.argv.includes('--build');

// Окружение сборки: stage — тестовый сайт (noindex, dev-фреймы), prod — боевой. По умолчанию dev = stage, build = prod
const ENVS = ['stage', 'prod'];
const env = process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1] ?? (isBuild ? 'prod' : 'stage');
if (!ENVS.includes(env)) throw new Error(`Неизвестное окружение --env=${env}, допустимо: ${ENVS.join(', ')}`);

global.app = {
	isDev: !isBuild,
	isBuild: isBuild,
	env: env,
	isProd: env === 'prod',
	isDeploy: process.argv.includes('--deploy'),
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
import { deployCheck, deployWatch, deployAll } from './gulp/tasks/deploy.js';

function watcher() {
	gulp.watch('./src/html/**/*.html', html);
	gulp.watch(['./src/scss/**/*.scss', '!./src/scss/**/index.scss'], styles);
	gulp.watch('./src/js/**/*.js', js);
	gulp.watch('./src/img/icons/**/*.svg', svg);
	gulp.watch(['src/img/**/*.{png,jpg,jpeg,gif,svg}', '!src/img/icons/**/*.svg'], img);
	gulp.watch('./src/root/**/*.*', root);
	gulp.watch('./src/font/**/*.*', font);
}

// Индексы components/layout должны быть записаны до компиляции SCSS, иначе в CSS попадёт устаревший набор компонентов
const styles = gulp.series(generateIndexSCSS, scss);
const mainTasks = gulp.parallel(html, styles, js, svg, img, root, font);

const devTasks = app.isDeploy
	? gulp.series(deployCheck, reset, mainTasks, gulp.parallel(watcher, server, deployWatch))
	: gulp.series(reset, mainTasks, gulp.parallel(watcher, server));

export default devTasks;
const build = gulp.series(reset, mainTasks);
const deploy = gulp.series(deployCheck, reset, mainTasks, deployAll);

export { build }
export { deploy }
export { generateIndexSCSS }
export { svg }
export { html }
export { styles as scss }
export { js }
export { font }
export { img }
export { root }
