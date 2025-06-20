// Детектирование системы и браузера [readme 2.13]
export default () => {
	try {
		const body = document.body;
		const fullUserInfo = navigator.userAgent || '';
		let system = 'system-unknown';
		let browser = 'browser-unknown';

		// Функция для определения операционной системы
		const detectSystem = () => {
			if (fullUserInfo.includes('Win')) return 'system-win';
			if (fullUserInfo.includes('iPhone')) return 'system-iphone';
			if (fullUserInfo.includes('Mac')) return 'system-mac';
			if (fullUserInfo.includes('X11')) return 'system-unix';
			if (fullUserInfo.includes('Linux')) return 'system-linux';
			return 'system-unknown';
		};

		// Функция для определения браузера
		const detectBrowser = () => {
			if (fullUserInfo.includes('YaBrowser')) return 'browser-yandex';
			if (fullUserInfo.includes('Edg')) return 'browser-edge';
			if (fullUserInfo.includes('OPR')) return 'browser-opera';
			if (fullUserInfo.includes('Chrome')) return 'browser-chrome';
			if (fullUserInfo.includes('Firefox')) return 'browser-firefox';
			if (fullUserInfo.includes('MSIE')) return 'browser-explorer';
			if (fullUserInfo.includes('Safari')) return 'browser-safari';
			return 'browser-unknown';
		};

		// Определяем систему и браузер
		addEventListener('load', () => {
			try {
				system = detectSystem();
				browser = detectBrowser();
				body.classList.add(system, browser);
			} catch (err) {
				console.error('Ошибка при добавлении классов для системы и браузера:', err.message, err.stack);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле detectUserInfo:', err.message, err.stack);
	}
};