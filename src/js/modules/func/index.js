/*
	Здесь расположены импорты всех функциональных модулей шаблона.
	Если вам необходимо активировать какой-либо модуль, просто раскомментируйте строку вызова, например "//getBlockHeight();".
	Подробнее обо всех модулях читайте в документации в разделе "JS-скрипты".

	Некоторые модули уже активированы, они необходимы для работы демонстрационной страницы шаблона "_example.html".
	В целом, вы можете отключить вообще все модули, это никак не повлияет на работоспособность шаблона.

	Так же в шаблоне есть папка с техническими модулями (modules/tech), они необходимы для работы некоторых функциональных модулей и вызывать их где-то отдельно нет необходимости (подробнее в документации).
*/

import getBlockHeight from './getBlockHeight.js';
import initTabs from './initTabs.js';
import initSliders from './initSliders.js';
import brSpace from "./brSpace.js";
import initSpoilers from './initSpoilers.js'
import scrollToAnchor from './scrollToAnchor.js';
import initModals from './initModals.js';
import * as articleLogic from './initArticleLogic.js';
import initNotify from './initNotify.js';
import initCookie from './initCookie.js';
import copyWithClick from './copyWithClick.js';
import detectUserInfo from "./detectUserInfo.js";
import calcHeaderHeight from "./calcHeaderHeight.js";
import calcScrollbarWidth from "./calcScrollbarWidth.js";
import detectPageLoad from "./detectPageLoad.js";
import detectPageScroll from "./detectPageScroll.js";
import initTooltip from './initTooltip.js';


//Получение высоты блоков [readme 2.1]
getBlockHeight();

//Табы [readme 2.2]
initTabs();

//Слайдер [readme 2.3]
initSliders();

//Пробелы после тега <br> [readme 2.4]
brSpace();

//Спойлеры [readme 2.5]
initSpoilers();

//Скролл до якоря [readme 2.6]
scrollToAnchor();

//Модальные окна [readme 2.7]
initModals();

//Генерация оглавления [readme 2.8]
articleLogic.default();
articleLogic.trackArticleHeader();

//Оповещения [readme 2.10]
initNotify();

//Куки-оповещалка [readme 2.11]
initCookie();

//Копирование текста в буфер [readme 2.12]
copyWithClick();

//Детектирование системы и браузера [readme 2.13]
detectUserInfo();

//Высота шапки [readme 2.14]
calcHeaderHeight();

//Ширина полосы прокрутки [readme 2.15]
calcScrollbarWidth();

//Детектор загрузки страницы [readme 2.16]
detectPageLoad();

//Детектор загрузки страницы [readme 2.17]
detectPageScroll();

//Тултипы [readme 2.18]
initTooltip();