import toggleClass from '../utils/toggleClass.js';

// Табы [readme 2.2]
export default () => {
	try {
		const tabs = document.querySelectorAll('.js_tab');
		if (!tabs.length) throw new Error('Блоки табов с классом "js_tab" не найдены.');

		for (let tab of tabs) {
			const tabLinks = tab.querySelectorAll('.js_tab-link');
			const tabContentContainer = tab.querySelector('.js_tab-content-container');
			const tabContent = tab.querySelectorAll('.js_tab-content');

			if (!tabLinks.length || !tabContent.length) throw new Error('Элементы табов (js_tab-link или js_tab-content) не найдены в блоке:', tab);

			window.addEventListener('load', () => {
				tabLinks.forEach((tabLink, i) => {
					if (tabContent[i].classList.contains('active')) {
						tabContentContainer.style.setProperty('--max-height', `${tabContent[i].scrollHeight}px`);
					}

					tabContent[i].style.setProperty('--max-height', `${tabContent[i].scrollHeight}px`);

					tabLink.addEventListener('click', () => {
						tabContentContainer.style.setProperty('--max-height', `${tabContent[i].scrollHeight}px`);

						if (!tabLink.classList.contains('active')) {
							tabLinks.forEach((link, index) => {
								toggleClass(link, 'active', false);
								toggleClass(tabContent[index], 'active', false);
							});
						}

						tabLink.classList.toggle('active');
						tabContent[i].classList.toggle('active');
					});
				});
			});
		}
	} catch (err) {
		console.error('Ошибка в модуле initTabs:', err.message, err.stack);
	}
};