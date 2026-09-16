import initOnce from '../utils/initOnce.js';

// Закрытие выпадающего меню по Esc и по клику вне открытого пункта [readme 2.18]
export const init = (root = document) => {
	// Слушатели глобальные и не зависят от конкретного <nav>, поэтому вешаются один раз на документ
	initOnce(document, ':root', 'initNavigation', () => {
		document.addEventListener('click', (e) => {
			const openItem = document.activeElement?.closest('.navigation__list-item, .navigation__level-list-item');
			if (openItem && !openItem.contains(e.target)) document.activeElement.blur();
		});

		document.addEventListener('keydown', (e) => {
			if (e.key !== 'Escape') return;

			const topItem = document.activeElement?.closest('.navigation__list-item');
			if (!topItem) return;

			// Первый Esc возвращает фокус на кнопку верхнего уровня, закрывая вложенные подменю,
			// второй — снимает фокус целиком
			const trigger = topItem.querySelector(':scope > .navigation__list-link');
			if (trigger && document.activeElement !== trigger) trigger.focus();
			else document.activeElement.blur();
		});
	});
};
