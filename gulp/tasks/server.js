import { app } from '../config/app.js';
import { paths } from '../config/paths.js';

export const server = (done) => {
	app.plugins.browserSync.init(
		{
			server: { baseDir: paths.build },
			notify: false,
			port: app.port,
		},
		() => done(),
	);
};
