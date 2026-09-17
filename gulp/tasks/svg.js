import svgSprite from 'gulp-svg-sprite';
import svgCurrentColor from '../plugins/svg-current-color/index.js';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import { handleErrors } from '../utils/handleErrors.js';

export const svg = () => {
	return app.gulp
		.src(paths.svg.src)
		.pipe(handleErrors('SVG'))
		.pipe(
			svgSprite({
				shape: {
					id: {
						separator: '-',
					},
					transform: [
						{
							svgo: {
								plugins: [
									'removeComments',
									'removeEmptyAttrs',
									'removeEmptyText',
									'collapseGroups',
									svgCurrentColor,
								],
							},
						},
					],
				},
				mode: {
					stack: {
						dest: 'img/',
						sprite: 'sprite.svg',
					},
				},
			}),
		)
		.pipe(app.gulp.dest(paths.svg.dest))
		.pipe(app.plugins.browserSync.stream());
};
