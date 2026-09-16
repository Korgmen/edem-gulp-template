import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';

// Логика выпадающего списка [readme 3.2]
export const init = (root = document) => {
	initOnce(root, '[data-select]', 'select', select => {
		select.addEventListener('change', () => {
			const parent = select.parentElement;
			const filled = select.value !== '';

			toggleClass(select, 'fill', filled);
			toggleClass(parent, 'fill', filled);
			toggleClass(select, 'focus', false);
			toggleClass(parent, 'focus', false);
		});
	});
};
