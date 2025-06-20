import getElementOrThrow from '../utils/getElementOrThrow.js';
import toggleClass from '../utils/toggleClass.js';

// Логика файлового поля ввода [readme 3.6]
try {
	const fileInputs = document.querySelectorAll('.js_file-input');

	fileInputs.forEach(file => {
		const fileParent = file.closest('.js_file');
		const fileLabel = getElementOrThrow(`[for="${file.id}"]`);
		const fileLabelText = fileLabel.textContent;

		file.addEventListener('change', () => {
			const fileValue = file.value;
			if (fileValue) {
				fileLabel.textContent = fileValue.split(/(\\|\/)/g).pop();
				toggleClass(fileParent, 'fill', true);
			} else {
				fileLabel.textContent = fileLabelText;
				toggleClass(fileParent, 'fill', false);
			}
		});
	});
} catch (err) {
	console.error('Ошибка в модуле fileInput:', err.message, err.stack);
}