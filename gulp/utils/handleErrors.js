import { app } from '../config/app.js';

export const handleErrors = (title) => app.plugins.plumber({
	errorHandler(err) {
		// В build сборка останавливается сразу, иначе deploy выгрузит неполный билд
		if (app.isBuild) {
			console.error(`\x1b[31m[${title}] ${err.messageFormatted ?? err.message}\x1b[0m`);
			process.exit(1);
		}
		app.plugins.notify.onError({ title, message: 'Error: <%= error.message %>' }).call(this, err);
	}
});
