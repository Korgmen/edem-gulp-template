import initOnce from '../utils/initOnce.js';
import { devWarn } from '../utils/devLog.js';

// Оповещения [readme 2.10]
export const init = (root = document) => {
	initOnce(root, '[data-notify]:not(.open)', 'initNotify', el => {
		if (!el.hasAttribute('data-popover-time')) return;

		const notifyCall = document.querySelector(`[popovertarget="${el.id}"]`);
		if (!notifyCall) {
			devWarn('initNotify', `не найдена кнопка [popovertarget="${el.id}"] — автозакрытие не подключено`, el);
			return;
		}

		const delay = Number(el.dataset.popoverTime) * 1000 || 3000;
		let notifyTimer;

		notifyCall.addEventListener('click', () => {
			clearTimeout(notifyTimer);
			notifyTimer = setTimeout(() => {
				if (el.matches(':popover-open')) el.hidePopover();
			}, delay);
		});
	});

	initOnce(root, '[data-notify].open', 'initNotify', el => el.showPopover());
};

// Функция для показа уведомления [readme 2.10]
let customNotifyTimer;
export const showCustomNotify = (content, timeout = 3000) => {
	const customNotify = document.querySelector('#custom-notify');
	if (!customNotify) {
		devWarn('showCustomNotify', 'на странице нет #custom-notify — сообщение не показано');
		return;
	}

	const notifyContent = customNotify.querySelector('[data-notify-content]');
	if (!notifyContent) {
		devWarn('showCustomNotify', 'в #custom-notify нет [data-notify-content]', customNotify);
		return;
	}

	notifyContent.innerHTML = content;

	if (!customNotify.matches(':popover-open')) customNotify.showPopover();

	clearTimeout(customNotifyTimer);
	customNotifyTimer = setTimeout(() => {
		if (customNotify.matches(':popover-open')) customNotify.hidePopover();
	}, timeout);
};
