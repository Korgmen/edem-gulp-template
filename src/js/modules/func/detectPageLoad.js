import setState from '../utils/setState.js';

// Детектор загрузки страницы [readme 2.15]
export const init = () => {
	const body = document.body;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => setState(body, 'load-dom', true), { once: true });
	} else {
		setState(body, 'load-dom', true);
	}

	if (document.readyState === 'complete') {
		setState(body, 'load', true);
	} else {
		window.addEventListener('load', () => setState(body, 'load', true), { once: true });
	}
};
