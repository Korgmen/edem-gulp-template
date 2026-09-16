import setState from '../utils/setState.js';

// Детектор прокрутки страницы [readme 2.16]
export const init = () => {
	const body = document.body;
	const update = () => setState(body, 'scroll', window.scrollY >= 100);

	update();
	window.addEventListener('scroll', update, { passive: true });
};
