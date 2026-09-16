import initOnce from '../utils/initOnce.js';
import pageLock from '../tech/pageLock.js';
import { devWarn } from '../utils/devLog.js';

const syncOpeners = (modalID, expanded) => {
	document.querySelectorAll(`[data-modal-open="${modalID}"][aria-expanded]`)
		.forEach(opener => opener.setAttribute('aria-expanded', String(expanded)));
};

// Модальные окна [readme 2.7]
export const init = (root = document) => {
	initOnce(root, '[data-modal-open]', 'initModals', link => {
		link.addEventListener('click', () => {
			const modalID = link.dataset.modalOpen;
			const modal = document.getElementById(modalID);

			if (!modal) {
				devWarn('initModals', `не найдено модальное окно #${modalID}`, link);
				return;
			}

			pageLock('lock', true, modalID);
			modal.showModal();
			syncOpeners(modalID, true);
			history.pushState({ modal: modalID }, '', `#${modalID}`);
		});
	});

	initOnce(root, 'dialog', 'initModals', modal => {
		// Закрытие при клике вне модального окна
		modal.addEventListener('click', (e) => {
			if (e.target.nodeName === 'DIALOG') modal.close();
		});

		modal.addEventListener('close', () => {
			syncOpeners(modal.id, false);
			if (!document.querySelector('dialog[open]')) pageLock('unlock');
			if (history.state?.modal === modal.id) history.back();
		});

		// Сброс хэша при перезагрузке страницы
		if (window.location.hash === `#${modal.id}`) {
			history.replaceState(null, document.title, location.pathname + location.search);
		}
	});

	// Слушатель истории один на страницу, независимо от числа окон
	if (root === document) {
		window.addEventListener('popstate', (e) => {
			document.querySelectorAll('dialog').forEach(modal => {
				if (modal.open && e.state?.modal !== modal.id) modal.close();
			});
		});
	}
};
