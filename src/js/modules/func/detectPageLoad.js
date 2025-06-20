import toggleClass from '../utils/toggleClass.js';

// Детектор загрузки страницы [readme 2.16]
export default () => {
	try {
		const body = document.body;
		window.addEventListener('DOMContentLoaded', () => toggleClass(body, 'load-dom', true));
		window.addEventListener('load', () => toggleClass(body, 'load', true));
	} catch (err) {
		console.error('Ошибка в модуле detectPageLoad:', err.message, err.stack);
	}
};