/*
	Реестр модулей шаблона.

	Каждая строка — пара «селектор разметки → модуль». Модуль скачивается и запускается только тогда,
	когда его разметка есть на странице: без слайдера не загрузится Swiper, без маски телефона — IMask.
	Отключать неиспользуемые модули вручную не нужно.

	Чтобы выключить модуль совсем — закомментируйте его строку.
	Чтобы добавить свой — допишите пару в LAZY_MODULES (или в ALWAYS, если модулю не нужна разметка).

	Каждый модуль экспортирует init(root = document) и переживает повторный вызов, поэтому после
	AJAX-подгрузки фрагмента достаточно вызвать initModules(fragment).
	Подробнее обо всех модулях — в документации, раздел "JS-скрипты".
*/

import * as detectPageLoad from './func/detectPageLoad.js';
import * as detectPageScroll from './func/detectPageScroll.js';
import * as calcScrollbarWidth from './func/calcScrollbarWidth.js';
import * as calcHeaderHeight from './func/calcHeaderHeight.js';

// Работают без собственной разметки, поэтому проверять селектор нечего
const ALWAYS = [
	detectPageLoad,      // Детектор загрузки страницы [readme 2.15]
	detectPageScroll,    // Детектор прокрутки страницы [readme 2.16]
	calcScrollbarWidth,  // Ширина полосы прокрутки [readme 2.14]
	calcHeaderHeight,    // Высота шапки [readme 2.13]
];

const LAZY_MODULES = [
	['br', () => import('./func/brSpace.js')],                          // Пробелы после тега <br> [readme 2.4]
	['.js_get-height', () => import('./func/getBlockHeight.js')],       // Получение высоты блоков [readme 2.1]
	['.js_tab', () => import('./func/initTabs.js')],                    // Табы [readme 2.2]
	['[data-modal]', () => import('./func/initModals.js')],             // Модальные окна [readme 2.7]
	['.js_article-content', () => import('./func/initArticleLogic.js')],// Оглавление статьи [readme 2.8, 2.9]
	['.js_notify', () => import('./func/initNotify.js')],               // Оповещения [readme 2.10]
	['#cookie', () => import('./func/initCookie.js')],                  // Куки-оповещалка [readme 2.11]
	['[data-copy]', () => import('./func/copyWithClick.js')],           // Копирование текста в буфер [readme 2.12]

	['.js_slider', () => import('./lib-control/sliders.js')],           // Слайдеры: разметка и Swiper [readme 2.3, 4.1]
	['.js_gallery', () => import('./lib-control/galleries.js')],        // Галереи, PhotoSwipe [readme 4.2]

	['.js_tel-mask', () => import('./form/telInput.js')],               // Поле ввода телефона, IMask [readme 3.1]
	['.js_select', () => import('./form/select.js')],                   // Выпадающий список [readme 3.2]
	['.js_number', () => import('./form/numberInput.js')],              // Числовое поле [readme 3.3]
	['.js_range', () => import('./form/rangeInput.js')],                // Ползунок [readme 3.4]
	['.js_dual-range', () => import('./form/dualRangeInput.js')],       // Двойной ползунок [readme 3.5]
	['.js_file-input', () => import('./form/fileInput.js')],            // Файловое поле [readme 3.6]

	// ['form.form', () => import('./cms/modx.js')],                    // Интеграция с MODX FetchIt [readme 3.7]
];

// Полифил scroll-timeline весит около 60 КБ, поэтому грузится только там, где нет нативной поддержки
const loadPolyfills = async () => {
	if (!CSS.supports('animation-timeline: view()')) await import('../libs/scroll-timeline.js');
};

const hasMarkup = (root, selector) => root instanceof Element
	? root.matches(selector) || Boolean(root.querySelector(selector))
	: Boolean(root.querySelector(selector));

export const initModules = (root = document) => {
	if (root === document) {
		ALWAYS.forEach(module => module.init());
		loadPolyfills();
	}

	return Promise.all(LAZY_MODULES.map(async ([selector, load]) => {
		if (!hasMarkup(root, selector)) return;

		const module = await load();
		module.init(root);
	}));
};
