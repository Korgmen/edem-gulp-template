import toggleClass from '../utils/toggleClass.js';

// Детектор прокрутки страницы [readme 2.16]
export const init = () => {
	const body = document.body;
	const update = () => toggleClass(body, 'scroll', window.scrollY >= 100);

	update();
	window.addEventListener('scroll', update, { passive: true });
};
