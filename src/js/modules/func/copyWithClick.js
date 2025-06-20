import { showCustomNotify } from './initNotify.js';

// Копирование текста в буфер [readme 2.12]
export default () => {
	try {
		const copyTexts = document.querySelectorAll('[data-copy]');

		copyTexts.forEach(text => {
			text.addEventListener('click', (e) => {
				try {
					const textToCopy = text.dataset.copy;
					if (!textToCopy) {
						throw new Error('Атрибут data-copy отсутствует или пуст.');
					}

					navigator.clipboard.writeText(textToCopy)
						.then(() => console.log(`Текст "${textToCopy}" успешно скопирован в буфер обмена.`))
						.catch(err => console.error('Ошибка при копировании текста в буфер:', err.message));
				} catch (err) {
					e.preventDefault();
					showCustomNotify('⛔ Ошибка при копировании текста в буфер обмена');
					console.error('Ошибка при обработке клика для копирования:', err.message, err.stack);
				}
			});
		});
	} catch (err) {
		console.error('Ошибка в модуле copyWithClick:', err.message, err.stack);
	}
};