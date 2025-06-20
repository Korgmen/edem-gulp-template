import getElementOrThrow from '../utils/getElementOrThrow.js';

// Высота шапки [readme 2.14]
export default () => {
	try {
		const header = getElementOrThrow('header');
		const headerHeight = header.clientHeight;

		document.body.style.setProperty('--headerHeight', `${headerHeight / 16}rem`);
	} catch (err) {
		console.error('Ошибка при вычислении высоты шапки:', err.message, err.stack);
	}
};