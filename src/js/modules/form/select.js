import initOnce from '../utils/initOnce.js';
import setState from '../utils/setState.js';

// Логика выпадающего списка [readme 3.2]
export const init = (root = document) => {
	initOnce(root, '[data-select]', 'select', (select) => {
		select.addEventListener('change', () => {
			const parent = select.parentElement;
			const filled = select.value !== '';

			setState(select, 'fill', filled);
			setState(parent, 'fill', filled);
			setState(select, 'focus', false);
			setState(parent, 'focus', false);
		});
	});
};
