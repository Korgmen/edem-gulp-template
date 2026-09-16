import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';
import { devWarn } from '../utils/devLog.js';

// Логика файлового поля ввода [readme 3.6]
export const init = (root = document) => {
	initOnce(root, '.js_file-input', 'fileInput', file => {
		const fileParent = file.closest('.js_file');
		const fileLabel = file.id && document.querySelector(`[for="${file.id}"]`);

		if (!fileLabel) {
			devWarn('fileInput', 'не найден label для поля — имя файла не будет показано', file);
			return;
		}

		const fileLabelText = fileLabel.textContent;

		file.addEventListener('change', () => {
			const fileValue = file.value;
			fileLabel.textContent = fileValue ? fileValue.split(/(\\|\/)/g).pop() : fileLabelText;
			toggleClass(fileParent, 'fill', Boolean(fileValue));
		});
	});
};
