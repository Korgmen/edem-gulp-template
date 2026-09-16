import toggleClass from '../utils/toggleClass.js';

// Детектор загрузки страницы [readme 2.15]
export const init = () => {
	const body = document.body;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => toggleClass(body, 'load-dom', true), { once: true });
	} else {
		toggleClass(body, 'load-dom', true);
	}

	if (document.readyState === 'complete') {
		toggleClass(body, 'load', true);
	} else {
		window.addEventListener('load', () => toggleClass(body, 'load', true), { once: true });
	}
};
