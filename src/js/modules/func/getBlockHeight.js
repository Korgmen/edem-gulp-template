// Получение высоты блоков [readme 2.1]
export default () => {
	try {
		addEventListener('DOMContentLoaded', () => {
			const getHeightCalls = document.querySelectorAll('.js_get-height');

			getHeightCalls.forEach(call => {
				call.style.height = 'auto';

				const targetElement = call.closest('.js_height-goal') || call.closest('.content__block');
				if (targetElement) {
					targetElement.style.setProperty('--targetHeight', `${call.clientHeight / 16}rem`);
				} else {
					call.style.setProperty('--targetHeight', `${call.clientHeight / 16}rem`);
				}

				call.style.height = '';
			});
		});
	} catch (err) {
		console.error('Ошибка в модуле getBlockHeight:', err.message, err.stack);
	}
};