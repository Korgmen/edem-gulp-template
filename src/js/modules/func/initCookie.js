import getElementOrThrow from '../utils/getElementOrThrow.js';

// Куки-оповещалка [readme 2.11]
export default () => {
	try {
		const cookieWindow = getElementOrThrow('#cookie');

		if (localStorage.getItem('cookie-notify')) {
			cookieWindow.remove();
			return;
		}

		const cookieButton = getElementOrThrow('button', cookieWindow);

		cookieButton.addEventListener('click', () => {
			try {
				localStorage.setItem('cookie-notify', '1');
				setTimeout(() => {
					cookieWindow.remove();
				}, 1000);
			} catch (err) {
				console.error('Ошибка при сохранении состояния cookie-notify:', err.message, err.stack);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле initCookie:', err.message, err.stack);
	}
};