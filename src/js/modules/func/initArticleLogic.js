import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';
import { devWarn } from '../utils/devLog.js';

const TRANSLIT = {
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i',
	к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
	х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const slugify = (text) => text
	.toLowerCase()
	.replace(/[а-яё]/g, char => TRANSLIT[char] ?? '')
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '')
	.slice(0, 60);

// Заготовка ссылки лежит рядом с контентом статьи, а не внутри него
const findLinkTemplate = (content) => {
	for (let parent = content.parentElement; parent; parent = parent.parentElement) {
		const template = parent.querySelector('[data-article-link]');
		if (template) return template;
	}
	return null;
};

// Генерация оглавления [readme 2.8]
export const buildArticleList = (root = document) => {
	initOnce(root, '[data-article]', 'initArticleLogic', content => {
		const linkTemplate = findLinkTemplate(content);
		if (!linkTemplate) {
			devWarn('initArticleLogic', 'не найдена заготовка ссылки [data-article-link] — оглавление не собрано', content);
			return;
		}

		const titles = content.querySelectorAll('h2'); // <----- тут можно сменить идентификатор заголовков
		if (!titles.length) return;

		const used = new Set();
		const list = linkTemplate.parentElement;

		titles.forEach((title, i) => {
			// Существующий id сохраняется: на него могут вести внешние ссылки
			if (!title.id) {
				const slug = slugify(title.textContent) || `target-${i}`;
				title.id = used.has(slug) || document.getElementById(slug) ? `${slug}-${i}` : slug;
			}
			used.add(title.id);
			title.toggleAttribute('data-article-target', true);

			const linkClone = linkTemplate.cloneNode(true);
			const linkElement = linkClone.firstElementChild;

			linkElement.setAttribute('href', `#${title.id}`);
			linkElement.textContent = title.textContent;

			list.appendChild(linkClone);
		});

		linkTemplate.remove();
	});
};

// Отслеживание активного пункта оглавления [readme 2.9]
export const trackArticleHeader = (root = document) => {
	initOnce(root, '[data-article]', 'trackArticleHeader', content => {
		const targets = content.querySelectorAll('[data-article-target]');
		if (!targets.length) return;

		const list = findLinkTemplate(content)?.parentElement
			?? content.parentElement?.querySelector('[data-article-link]')?.parentElement;
		const links = list?.querySelectorAll('[data-article-link]');
		if (!links?.length) return;

		const linkByTarget = new Map();
		targets.forEach((target, i) => linkByTarget.set(target, links[i]));

		const visible = new Set();

		const observer = new IntersectionObserver(entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) visible.add(entry.target);
				else visible.delete(entry.target);
			}

			// Активным считается верхний из видимых заголовков
			const current = [...targets].find(target => visible.has(target));
			if (!current) return;

			links.forEach(link => toggleClass(link, 'active', false));
			toggleClass(linkByTarget.get(current), 'active', true);
		}, { rootMargin: '0px 0px -80% 0px' });

		targets.forEach(target => observer.observe(target));
	});
};

export const init = (root = document) => {
	buildArticleList(root);
	trackArticleHeader(root);
};
