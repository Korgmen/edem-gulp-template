import getElementOrThrow from '../utils/getElementOrThrow.js';
import toggleClass from '../utils/toggleClass.js';

// Спойлеры [readme 2.5]
export default () => {
	try {
		const spoilerBlocks = document.querySelectorAll('.js_spoiler');
		if (!spoilerBlocks.length) throw new Error('Блоки спойлеров с классом "js_spoiler" не найдены.');

		spoilerBlocks.forEach(spoilerBlock => {
			const spoilerItems = spoilerBlock.querySelectorAll('.js_spoiler-item');
			if (!spoilerItems.length) throw new Error('Элементы спойлеров с классом "js_spoiler-item" не найдены в блоке:', spoilerBlock);

			spoilerItems.forEach((spoilerItem, i) => {
				const spoilerTitle = getElementOrThrow('.js_spoiler-title', spoilerItem);
				const spoilerContent = getElementOrThrow('.js_spoiler-content', spoilerItem);

				if (!spoilerTitle || !spoilerContent) throw new Error('Элементы js_spoiler-title или js_spoiler-content не найдены в спойлере:', spoilerItem);

				spoilerContent.style.setProperty('--max-height', `${spoilerContent.scrollHeight}px`);

				spoilerTitle.addEventListener('click', () => {
					if (spoilerBlock.classList.contains('js_spoiler--single')) {
						spoilerItems.forEach((item, index) => {
							if (item.classList.contains('open') && index !== i) {
								toggleClass(item, 'open', false);
							}
						});
					}

					// Переключаем состояние текущего спойлера
					spoilerItem.classList.toggle('open');
				});
			});
		});
	} catch (err) {
		console.error('Ошибка в модуле initSpoilers:', err.message, err.stack);
	}
};