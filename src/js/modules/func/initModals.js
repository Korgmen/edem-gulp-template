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
					history.pushState({ modal: modalID }, '', `#${modalID}`);
				} catch (err) {
					console.error('Ошибка при открытии модального окна:', err.message, err.stack);
				}
			});
		});

		window.addEventListener('popstate', (e) => {
			modals.forEach(modal => {
				if (modal.open && e.state?.modal !== modal.id) modal.close();
			});
		});

		// Закрытие модального окна
		modals.forEach(modal => {
			// Закрытие при клике вне модального окна
			modal.addEventListener('click', (e) => {
				if (e.target.nodeName === 'DIALOG') modal.close();
			});

			modal.addEventListener('close', () => {
				try {
					if (!document.querySelector('dialog[open]')) pageLock('unlock');
					if (history.state?.modal === modal.id) history.back();
				} catch (err) {
					console.error('Ошибка при закрытии модального окна:', err.message, err.stack);
				}
			});

			// Сброс хэша при перезагрузке страницы
			if (window.location.hash === `#${modal.id}`) {
				history.replaceState(null, document.title, location.pathname + location.search);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле initModals:', err.message, err.stack);
	}
};