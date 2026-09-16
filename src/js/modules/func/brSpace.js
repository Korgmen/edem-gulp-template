import initOnce from '../utils/initOnce.js';

// Пробелы после тега <br> [readme 2.4]
export const init = (root = document) => {
	initOnce(root, 'br', 'brSpace', br => br.insertAdjacentHTML('afterend', ' '));
};
