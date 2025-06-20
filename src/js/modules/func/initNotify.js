import getElementOrThrow from '../utils/getElementOrThrow.js';

// Оповещения [readme 2.10]
export default () => {
	try {
		// Обрабатываем уведомления, которые еще не открыты
		const notifyList = document.querySelectorAll('.js_notify:not(.open)');
		notifyList.forEach(el => {
			try {
				if (el.hasAttribute('data-popover-time')) {
					const notifyCall = getElementOrThrow(`[popovertarget="${el.id}"]`);

					let notifyTimer;
					notifyCall.addEventListener('click', () => {
						clearTimeout(notifyTimer);
						notifyTimer = setTimeout(() => {
							if (el.matches(':popover-open')) {
								el.hidePopover();
							}
						}, el.getAttribute('data-popover-time') ? el.getAttribute('data-popover-time') * 1000 : 3000);
					});
				}
			} catch (err) {
				console.error(`Ошибка при обработке уведомления с id="${el.id}":`, err.message, err.stack);
			}
		});

		// Автоматически открываем уведомления, которые уже помечены как открытые
		const notifyOpenList = document.querySelectorAll('.js_notify.open');
		notifyOpenList.forEach(el => {
			try {
				el.showPopover();
			} catch (err) {
				console.error(`Ошибка при открытии уведомления с id="${el.id}":`, err.message, err.stack);
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле initNotify:', err.message, err.stack);
	}
};


// Функция для показа уведомления об ошибке
let customNotifyTimer;
export const showCustomNotify = (content, timeout = 3000) => {
	try {
		const customNotify = getElementOrThrow('#custom-notify');
		const notifyContent = getElementOrThrow('.js_notify-content', customNotify);

		notifyContent.innerHTML = content;

		if (!customNotify.matches(':popover-open')) {
			customNotify.showPopover();
		}

		clearTimeout(customNotifyTimer);
		customNotifyTimer = setTimeout(() => {
			if (customNotify.matches(':popover-open')) {
				customNotify.hidePopover();
			}
		}, timeout);
	} catch (err) {
		console.custom('Ошибка при вызове popover с id "custom":', err.message, err.stack);
	}
};