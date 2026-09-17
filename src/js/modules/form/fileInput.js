import initOnce from '../utils/initOnce.js';
import setState from '../utils/setState.js';
import { devWarn } from '../utils/devLog.js';

// Логика файлового поля ввода [readme 3.6]
export const init = (root = document) => {
	initOnce(root, '[data-file-input]', 'fileInput', (file) => {
		const fileParent = file.closest('[data-file]');
		const fileLabel = file.id && document.querySelector(`[for="${file.id}"]`);

		if (!fileLabel) {
			devWarn('fileInput', 'не найден label для поля — имя файла не будет показано', file);
			return;
		}

		const fileLabelText = fileLabel.textContent;

		file.addEventListener('change', () => {
			const fileValue = file.value;
			fileLabel.textContent = fileValue ? fileValue.split(/(\\|\/)/g).pop() : fileLabelText;
			setState(fileParent, 'fill', Boolean(fileValue));
		});
	});
};
