import { app } from '../config/app.js';
import { paths } from '../config/paths.js';
import svgRemoveFill from '../plugins/svg-remove-fill/index.js';
import svgSprite from 'gulp-svg-sprite';

export const svg = () => {
	return app.gulp.src(paths.svg.src)
		.pipe(app.plugins.plumber(app.plugins.notify.onError({title: 'SVG', message: 'Error: <%= error.message %>'})))
		.pipe(svgRemoveFill())
		.pipe(svgSprite({
			shape: {
				id: {
					separator: '-'
				},
				transform: [{
					'svgo': {
						plugins: [
							'removeComments',
							'removeEmptyAttrs',
							'removeEmptyText',
							'collapseGroups',
							{
								name: "removeAttrs",
								params: {
									attrs: '(stroke | style)'
								}
							}
						]
					}
				}]
			},
			mode: {
				stack: {
					dest: 'img/',
					sprite: 'sprite.svg'
				}
			}
		}
		))
		.pipe(app.gulp.dest(paths.svg.dest))
		.pipe(app.plugins.browserSync.stream())
}