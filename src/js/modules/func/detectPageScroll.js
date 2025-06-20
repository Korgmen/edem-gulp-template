import toggleClass from '../utils/toggleClass.js';

// Детектор прокрутки страницы [readme 2.17]
export default () => {
	try {
		const body = document.body;

		window.addEventListener('load', () => {
			if (window.scrollY >= 100) toggleClass(body, 'scroll', true);
		});

		window.addEventListener('scroll', () => {
			try {
				if (window.scrollY >= 100) toggleClass(body, 'scroll', true);
				else toggleClass(body, 'scroll', false);
			} catch (err) {
				console.error('Ошибка в обработчике события scroll:', err.message, err.stack);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле detectPageScroll:', err.message, err.stack);
	}
};