import initOnce from '../utils/initOnce.js';
import setState from '../utils/setState.js';
import { devWarn } from '../utils/devLog.js';

let tabsGroup = 0;

// Табы [readme 2.2]
export const init = (root = document) => {
	initOnce(root, '[data-tabs]', 'initTabs', (tab) => {
		const tabLinks = [...tab.querySelectorAll('[data-tab-link]')];
		const tabContents = [...tab.querySelectorAll('[data-tab-panel]')];
		const tabContentContainer = tab.querySelector('[data-tab-panels]');

		if (!tabLinks.length || !tabContents.length) {
			devWarn('initTabs', 'нужны [data-tab-link] и [data-tab-panel] — блок пропущен', tab);
			return;
		}

		// В "пустом режиме" активный таб можно свернуть повторным кликом
		const isEmptyMode = tab.matches('[data-tabs~="empty"]');
		const group = ++tabsGroup;

		tabLinks[0].parentElement?.setAttribute('role', 'tablist');

		tabLinks.forEach((link, i) => {
			const content = tabContents[i];
			if (!content) return;

			link.id ||= `tab-${group}-${i}`;
			content.id ||= `tabpanel-${group}-${i}`;

			if (link.tagName === 'BUTTON') link.type = 'button';
			link.setAttribute('role', 'tab');
			link.setAttribute('aria-controls', content.id);
			content.setAttribute('role', 'tabpanel');
			content.setAttribute('aria-labelledby', link.id);
		});

		const isSelected = (link) => link.getAttribute('aria-selected') === 'true';

		const syncState = () => {
			tabLinks.forEach((link, i) => {
				const selected = isSelected(link);
				link.setAttribute('aria-selected', String(selected));
				// В группе табов фокус получает только активный, остальные обходятся стрелками
				link.tabIndex = selected ? 0 : -1;
				setState(tabContents[i], 'active', selected);
				tabContents[i]?.toggleAttribute('inert', !selected);
			});
		};

		// На узкой ширине текст переносится и высота панели меняется
		const updateHeights = () => {
			tabContents.forEach((content) => content.style.setProperty('--max-height', `${content.scrollHeight}px`));

			const active = tabContents.find((content) => content.matches('[data-state~="active"]'));
			tabContentContainer?.style.setProperty('--max-height', `${active ? active.scrollHeight : 0}px`);
		};

		const activate = (index) => {
			const link = tabLinks[index];
			const content = tabContents[index];
			if (!link || !content) return;

			const wasActive = isSelected(link);

			tabLinks.forEach((item) => item.setAttribute('aria-selected', 'false'));
			if (!(isEmptyMode && wasActive)) link.setAttribute('aria-selected', 'true');

			syncState();
			updateHeights();
		};

		tabLinks.forEach((link, i) => {
			link.addEventListener('click', () => activate(i));

			link.addEventListener('keydown', (e) => {
				const step = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity }[e.key];
				if (step === undefined) return;

				e.preventDefault();
				const next = Number.isFinite(step)
					? (i + step + tabLinks.length) % tabLinks.length
					: step < 0
						? 0
						: tabLinks.length - 1;

				tabLinks[next].focus();
				activate(next);
			});
		});

		syncState();
		updateHeights();

		if (tabContentContainer) {
			let lastWidth = tabContentContainer.clientWidth;
			new ResizeObserver(() => {
				// Переключение таба меняет высоту контейнера, пересчёт нужен только на смену ширины
				if (tabContentContainer.clientWidth === lastWidth) return;
				lastWidth = tabContentContainer.clientWidth;
				updateHeights();
			}).observe(tabContentContainer);
		}
	});
};
