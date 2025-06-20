import getElementOrThrow from '../utils/getElementOrThrow.js';
import toggleClass from '../utils/toggleClass.js';

// Генерация оглавления [readme 2.8]
export default () => {
	try {
		const articleLink = getElementOrThrow('.js_article-link');
		const articleContent = getElementOrThrow('.js_article-content');
		const articleContentTitles = articleContent.querySelectorAll('h2'); // <----- тут можно сменить идентификатор заголовков

		articleContentTitles.forEach((title, i) => {
			title.id = `target-${i}`;
			toggleClass(title, 'js_article-target', true);

			const articleLinkClone = articleLink.cloneNode(true);
			const linkElement = articleLinkClone.firstElementChild;

			linkElement.setAttribute('href', `#target-${i}`);
			linkElement.textContent = title.textContent;

			articleLink.parentElement.appendChild(articleLinkClone);
		});

		articleLink.remove();
	} catch (err) {
		console.error('Ошибка в модуле генерации оглавления (initArticleLogic):', err.message, err.stack);
	}
};

// Отслеживание оглавления [readme 2.9]
export const trackArticleHeader = () => {
	try {
		const articleLinks = document.querySelectorAll('.js_article-link');
		const articleTargets = document.querySelectorAll('.js_article-target');

		if (!articleLinks.length || !articleTargets.length) throw new Error('Элементы "js_article-link" или "js_article-target" не найдены.');

		let ticking = false;

		addEventListener('scroll', () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					try {
						articleTargets.forEach((target, i) => {
							const viewportOffset = target.getBoundingClientRect();
							const top = viewportOffset.top;

							if (top > -200 && top < 200) {
								articleLinks.forEach(item => toggleClass(item, 'view', false));
								toggleClass(articleLinks[i], 'view', true);
							}
						});
					} catch (err) {
						console.error('Ошибка в обработчике прокрутки:', err.message, err.stack);
					} finally {
						ticking = false;
					}
				});
			}
		});
	} catch (err) {
		console.error('Ошибка в модуле отслеживания оглавления (initArticleLogic):', err.message, err.stack);
	}
};