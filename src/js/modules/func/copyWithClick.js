import initOnce from '../utils/initOnce.js';
import { showCustomNotify } from './initNotify.js';

// Копирование текста в буфер [readme 2.12]
export const init = (root = document) => {
	initOnce(root, '[data-copy]', 'copyWithClick', element => {
		element.addEventListener('click', async (e) => {
			const textToCopy = element.dataset.copy;

			if (!textToCopy) {
				e.preventDefault();
				showCustomNotify('⛔ Нечего копировать: атрибут data-copy пуст');
				return;
			}

			try {
				await navigator.clipboard.writeText(textToCopy);
				showCustomNotify(element.dataset.copyMessage || '✅ Скопировано');
			} catch {
				e.preventDefault();
				showCustomNotify('⛔ Ошибка при копировании текста в буфер обмена');
			}
		});
	});
};
