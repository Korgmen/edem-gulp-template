import { requireChild } from '../utils/devLog.js';

// Куки-оповещалка [readme 2.11]
export const init = (root = document) => {
	const cookieWindow = (root === document ? document : root).querySelector('#cookie');
	if (!cookieWindow) return;

	if (localStorage.getItem('cookie-notify')) {
		cookieWindow.remove();
		return;
	}

	const cookieButton = requireChild(cookieWindow, 'button', 'initCookie');
	if (!cookieButton) return;

	cookieButton.addEventListener(
		'click',
		() => {
			localStorage.setItem('cookie-notify', '1');
			setTimeout(() => cookieWindow.remove(), 1000);
		},
		{ once: true },
	);
};
