import pageLock from '../tech/pageLock.js';
import getElementOrThrow from '../utils/getElementOrThrow.js';

// Модальные окна [readme 2.7]
export default () => {
	try {
		const modalLinks = document.querySelectorAll('[data-modal]');
		const modals = document.querySelectorAll('dialog');

		if (!modalLinks.length || !modals.length) throw new Error('Модальные окна или ссылки для их открытия не найдены.');

		// Открытие модального окна
		modalLinks.forEach(link => {
			link.addEventListener('click', () => {
				try {
					const modalID = link.dataset.modal;
					const modal = getElementOrThrow(`#${modalID}`);

					pageLock('lock', true, modalID);
					modal.showModal();
					window.location.hash = `#${modalID}`; // Добавляем id модального окна в хэш
				} catch (err) {
					console.error('Ошибка при открытии модального окна:', err.message, err.stack);
				}
			});
		});

		// Закрытие модального окна
		modals.forEach(modal => {
			// Закрытие при клике вне модального окна
			modal.addEventListener('click', (e) => {
				if (e.target.nodeName === 'DIALOG') modal.close();
			});

			// Закрытие при изменении хэша (например, при нажатии кнопки "Назад")
			window.addEventListener('hashchange', () => {
				try {
					if (window.location.hash !== `#${modal.id}` && modal.open) {
						modal.close();
					}
				} catch (err) {
					console.error('Ошибка при обработке изменения хэша:', err.message, err.stack);
				}
			});

			// Сброс хэша при закрытии модального окна
			modal.addEventListener('close', () => {
				try {
					pageLock('unlock');
					history.replaceState(null, document.title, location.pathname + location.search);
				} catch (err) {
					console.error('Ошибка при сбросе хэша:', err.message, err.stack);
				}
			});

			// Сброс хэша при перезагрузке страницы
			if (window.location.hash.includes(modal.id)) {
				history.replaceState(null, document.title, location.pathname + location.search);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле initModals:', err.message, err.stack);
	}
};