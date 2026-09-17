import IMask from 'imask';
import initOnce from '../utils/initOnce.js';

// Логика поля ввода номера телефона [readme 3.1]
export const init = (root = document) => {
	initOnce(root, '[data-tel-mask]', 'telInput', (telInput) => {
		IMask(telInput, { mask: '+{7} (000) 000-00-00' });
	});
};
