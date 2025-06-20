export const server = (done) => {
	app.plugins.browserSync.init({
		server: {baseDir: './build'},
		notify: false,
		port: 3000
	});
};