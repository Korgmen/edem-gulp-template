import initOnce from '../utils/initOnce.js';

// Получение высоты блоков [readme 2.1]
export const init = (root = document) => {
	initOnce(root, '.js_get-height', 'getBlockHeight', call => {
		call.style.height = 'auto';

		const targetElement = call.closest('.js_height-goal') || call.closest('.content__block');
		const target = targetElement ?? call;

		target.style.setProperty('--target-height', `${call.clientHeight / 16}rem`);

		call.style.height = '';
	});
};
