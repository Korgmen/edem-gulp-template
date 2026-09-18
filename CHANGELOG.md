# Changelog

Все значимые изменения шаблона. Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [SemVer](https://semver.org/lang/ru/).
Форкам: смотрите разделы «Изменено» и «Исправлено», чтобы понять, что стоит перенести из шаблона в свой проект.

## [1.7.1] — 17.09.2026

### Удалено
- Сочетания клавиш задач VSCode из профиля `EdemGulpTemplateProfile_MacOS.code-profile`: `Option+Command+E`, `Option+Shift+E`, `Command+E`, `Command+Shift+E` — сами задачи удалены в 1.5.0. `Command+E` снова вызывает стандартную команду VSCode «Найти выделенное». Переимпортируйте профиль, чтобы изменения применились.

## [1.7.0] — 17.09.2026

**Форкам:** документация переехала из `README.md` в папку `docs/`, README сокращён до обзора, быстрого старта и чек-листа «Как форкнуть проект» — якоря старого README больше не работают. Чанк `head.html` расширен: если в форке он менялся, перенесите новые мета-теги вручную и замените `apple-touch-icon.png` на иконку проекта.

### Добавлено
- Папка `docs/` с документацией по разделам: `getting-started.md`, `build.md`, `deploy.md`, `html.md`, `scss.md`, `js.md`, `assets.md`, `vscode.md`, `tips.md`.
- Раздел «Как форкнуть проект» в README — чек-лист первого часа на новом проекте: окружение, удаление демо, шрифты и палитра, мета-теги, выгрузка, проверка сборки.
- Команда `pnpm docs:check` (`gulp/scripts/checkDocs.js`), входит в `pnpm lint` и CI: ссылки на несуществующие файлы и якоря, повторяющиеся `id`, пути `src/…` в код-спанах, соответствие маркеров `[readme N]` в коде разделам `docs/js.md`. Внешние ссылки не проверяются.
- Чанк `head.html`: параметр `description` (выводит `description` и `og:description`, при пустом значении теги не выводятся), `og:type`, `og:title`, `og:locale`, `theme-color` для светлой и тёмной схемы, `apple-touch-icon` и `preload` шрифта Manrope. Иконка `src/root/apple-touch-icon.png` 180×180 собрана из `favicon.svg` на тёмном фоне. `docs/html.md` — раздел «Мета-теги страницы».

### Изменено
- `<h1>` перенесён из шапки в контент страниц: название в шапке (`_demo/header-title.html`) размечено `<p class="header__title">`, у стартовой страницы и страниц примеров свой `<h1>`. Заголовки внутри контента спойлеров и табов в примерах — `<h2>` вместо `<h1>`, заголовки групп формы в примерах — `<h2>` вместо `<h3>`, селекторы `components/spoiler-list.scss` и `_example/tabs.scss` — тоже `h2`.
- Документация сверена с кодом: кнопка модального окна `data-modal-open`, оповещение при загрузке `data-notify="open"`, `data-state` у select, файлового поля и кнопки MODX, классы навигации слайдера и `data-slider="example"`, `--modal-duration`, открытие тултипа с клавиатуры и на сенсорных экранах, настройка `editor.wordSeparators`, дерево проекта, сочетания клавиш профиля, маркеры `[ ]` и `[x]`.
- Сторонние библиотеки в `docs/js.md` — «Раздел 4» с модулями 4.1 (Swiper) и 4.2 (PhotoSwipe): на них ссылаются маркеры `[readme 4.1]` и `[readme 4.2]` в коде. Интеграция с MODX стоит после модуля 3.6 как модуль 3.7. Якорь модуля 2.9 — `#articleTracking` вместо дублирующего `#initArticleLogic`.
- Ссылки стартовой страницы ведут на файлы `docs/`.

### Удалено
- `X-UA-Compatible` из `head.html`.
- Неиспользуемый `src/js/modules/form/index.js` (модули форм подключаются реестром по отдельности) и пустой `src/js/modules/utils/index.js`.
- Из документации: пустые разделы «Назначение основных директорий» и «Назначение основных файлов», «Часто задаваемые вопросы» и дубль раздела «Скрипты для MODX». Закомментированные заготовки разделов перенесены в README списком «Планы по документации».
- Из описания структуры страницы в `docs/html.md` и компонента `container` в `docs/scss.md` — классы `header__container`, `content__container`, `footer__container`: для ограничивающего контейнера достаточно класса `container`.

## [1.6.2] — 17.09.2026

### Изменено
- pnpm 9.7.1 → 9.15.9, browserslist 4.28.9 → 4.29.0, sass 1.94.2 → 1.104.1.

### Исправлено
- Renovate пытался обновить `packageManager` вместе с любым pull request на минорные и патч-обновления и падал на команде `corepack use`: в его окружении она не проходит. `renovate.json` больше не даёт боту трогать это поле — версию pnpm обновляют командой `corepack use pnpm@X.Y.Z` в репозитории напрямую.

## [1.6.1] — 17.09.2026

### Исправлено
- Renovate поднимал версию Node в `.nvmrc` и `engines` до последнего патча при каждом обновлении — форк требовал переустановки Node на каждом минорном/патч pull request. `renovate.json`: для `.nvmrc` и поля `engines` — `rangeStrategy: "replace"`, версия меняется только при выходе новой мажорной версии Node.

## [1.6.0] — 17.09.2026

**Форкам:** минимальная версия Node.js — 24. Перед обновлением поставьте Node 24 (`nvm install 24`), иначе `pnpm install` не запустится из-за `engine-strict`.

### Изменено
- Минимальная версия Node.js поднята с 22 до 24: `.nvmrc`, `engines` в `package.json`, README. CI берёт версию из `.nvmrc`.
- `gulp-html-minifier-terser` обновлён с 7.1.0 до 8.0.0: плагин переписан на нативные потоки Node без `through2` и требует Node 24. Настройки минификации не изменились, prod-сборка HTML совпадает с прежней.
- Скрипты в `package.json` запускают gulp без флага `--no-experimental-require-module`: на Node 24 gulp загружает ESM-конфиг без него. Если у вас свои скрипты с этим флагом, его можно убрать.

## [1.5.0] — 16.09.2026

**Форкам:** стартовая страница и примеры компонентов разнесены по папкам `_demo` и `_example`, файлы `src/html/_example.html`, `src/scss/themes/temp-theme.scss` и `src/img/temp/` удалены. Настройки редактора и сниппеты переехали из профиля в `.vscode/`, задачи VSCode убраны — сборка запускается командами `pnpm`.

### Добавлено
- Команды `pnpm run demo:remove` и `pnpm run example:remove`: удаляют стартовую страницу или примеры компонентов вместе с подключениями в чанках и `main.scss`. Перед удалением выводят список и спрашивают подтверждение, без терминала нужен флаг `--yes`. README — раздел «Стартовая страница и примеры компонентов».
- Проверка кода: ESLint (`eslint.config.js`), Stylelint (`.stylelintrc.json` на основе `stylelint-config-standard-scss`), Prettier (`.prettierrc.json`) и `.editorconfig`. Команды `pnpm lint`, `pnpm lint:js`, `pnpm lint:scss`, `pnpm format`, `pnpm format:check`. В `.vscode/settings.json` Prettier назначен форматтером по умолчанию: `Format Document` форматирует так же, как `pnpm format`.
- CI на GitHub Actions (`.github/workflows/ci.yml`): при push в `main` и в pull request — установка по lock-файлу, `pnpm lint`, сборка в окружениях `prod` и `stage` и сборка после `demo:remove` и `example:remove`.
- `renovate.json`: pull request с обновлениями зависимостей и GitHub Actions по понедельникам, минорные и патч-обновления одним pull request.
- Git-теги релизов `v1.0.0`–`v1.5.0`. README — раздел «Версии шаблона и обновление форка».
- Файлы редактора в `.vscode/`: `settings.json` с настройками для работы с шаблоном, `extensions.json` с рекомендованными расширениями и `edem.code-snippets`.

### Изменено
- Стартовая страница вынесена в `src/html/_demo/` и `src/scss/_demo/`, её оформление подключается слоем `demo` вместо `theme`. Заголовок шапки «Edem Template» и копирайт подвала — чанки `_demo/header-title.html` и `_demo/footer-copy.html`, после `demo:remove` в шапке остаются навигация и бургер.
- `_example.html` разделён на страницы по компонентам в `src/html/_example/` с оглавлением `example.html`, добавлены страницы навигации с выпадающими списками и бокового меню, оформление из `temp-theme.scss` — на файлы по компонентам в `src/scss/_example/`. Стили и скрипты примеров собираются в отдельные `css/example.css` и `js/example.js`, подключаются параметром `example: true` в чанках `head.html` и `scripts.html` и не попадают в окружение `prod`. Слой `example` стоит ниже `components`, поэтому стили проекта перекрывают оформление примеров. Порядок слоёв: `@layer base, vendors, tech, example, components, layout, demo`.
- Классы оформления страниц примеров собраны в блок `example`: `title` → `example__title`, `example-section__row` → `example__row`, `tooltip-parent` → `example__tooltip`, `modal-list` и `custom-checkbox-section__form` → `example__row example__row--dense`.
- Пример слайдера с разобранными настройками Swiper перенесён из `src/js/modules/lib-control/sliders.js` в `src/js/_example/slider.js`, в `sliders.js` осталась подготовка разметки.
- `index.scss` генерируется и в `src/scss/_example/`.
- Демонстрационное модальное окно `callback` и оповещения `addToCart`, `copyText` перенесены из чанка `modals.html` на страницы примеров. В чанке остались боковое меню, cookie-оповещение и `#custom-notify`.
- Сниппеты: у каждого есть описание; разметка `cmp|*` сверена со страницами примеров (тултип на `<button>`, поле файла и двойной ползунок без лишних `id` и `for`); `c`, `bgc` и `cm` вставляют цвета палитры `var(--c-*)`; фреймы разработчика `bf` обёрнуты в `@@if (env !== 'prod')`; заглушка `pc` ведёт на placehold.co вместо закрытого via.placeholder.com; `nosel` и `breakword` без устаревших префиксов. Дубли `robot` и `meta|robots`, `custom-checkbox` объединены, сниппет `f|old` удалён. Добавлены `vid` (зацикленное видео), `ht` (ссылка на фрагмент текста), `cl` (`console.log`) и `modx|admin` (блок только для администратора). README — таблица «Самые важные сниппеты».
- Профиль `EdemGulpTemplateProfile_MacOS.code-profile` содержит только сочетания клавиш, настройку `"keyboard.dispatch": "keyCode"` для работы сочетаний в русской раскладке и рекомендованные расширения — без истории интерфейса и личных настроек.
- SCSS по правилам Stylelint: `rgb()` в современной записи, `:not(a, b)`, сокращённые свойства, кавычки в `url()` и селекторах атрибутов, `sans-serif` в миксинах шрифтов.
- JS, SCSS, HTML и JSON отформатированы Prettier. Для HTML подключён плагин `gulp/plugins/prettier-file-include`: без него Prettier склеивает соседние директивы `@@include` и `@@if` в одну строку.
- `package.json`: `"private": true`; `ordered-read-streams`, которую `ternary-stream` использует без объявления, подключена через `pnpm.packageExtensions` вместо прямой зависимости.
- Картинка примеров — `src/img/_example/placeholder.jpg` на 74 КБ вместо `src/img/temp/temp-image.jpg` на 1,4 МБ.

### Удалено
- Задачи VSCode и описание их сочетаний клавиш в README: сборка запускается `pnpm dev` и `pnpm build`.
- Профиль для Windows: сочетаний клавиш в нём не было, настройки и сниппеты перенесены в `.vscode/`.
- Неиспользуемые шрифты Montserrat, Mulish, Raleway и видео `src/root/ConfusedTravolta.mp4`.
- Поля `main` и `peerDependencies` в `package.json`.
- Неиспользуемые стили `.spoiler` стартовой страницы.
- Демонстрационное модальное окно `order` и кнопки его вызова в примерах.

## [1.4.0] — 16.09.2026

**Форкам: этот выпуск меняет разметку.** Хуки `js_*` и технические классы `_*` заменены data-атрибутами, глобальные классы-состояния — ARIA-атрибутами и `data-state`. Таблицы соответствия — ниже, в разделе «Изменено».

### Добавлено
- Каскадные слои: `@layer base, vendors, tech, components, layout, theme`. Оформление компонента теперь всегда сильнее его механики независимо от специфичности селекторов и алфавитного порядка файлов. Порядок объявлен в `src/scss/main.scss`, содержимое слоёв подключается через `meta.load-css`. README — раздел «Каскадные слои».
- Тёмная тема: цвета объявлены через `light-dark()`, схема следует системной настройке. Ручное переключение — атрибут `data-theme="light|dark"` на `<html>`. README — раздел «Темизация и работа с темами».
- Настройки технических стилей вынесены в CSS-переменные: `--modal-duration`, `--hide-menu-duration`, `--burger-duration`, `--notify-duration`, `--notify-offset`, `--tabs-duration`, `--spoiler-duration`, `--tooltip-duration`, `--navigation-duration`. Переопределяются из стилей компонента, без переписывания самих переходов.
- Компоненты `container` *(ширина, центрирование и боковые отступы)* и `appear` *(появление при прокрутке)*.
- Утилита `setState(element, name, on)` для состояний в `data-state`.
- README: разделы «Файлы index.scss», «Каскадные слои», «Подключение встроенных компонентов (data-атрибуты)», «Состояния компонентов», «Доступность разметки», «Настройки технических стилей» и описание компонента `navigation`.

### Изменено
- **Подключение компонентов — data-атрибуты вместо классов.** Один атрибут служит и точкой входа JS, и селектором технических стилей; классы отданы оформлению.

  | Было | Стало |
  | :--- | :--- |
  | `js_tab`, `js_tab-link`, `js_tab-content-container`, `js_tab-content` | `data-tabs`, `data-tab-link`, `data-tab-panels`, `data-tab-panel` |
  | `js_tab--slide`, `js_tab--noanim`, `js_tab--empty` | `data-tabs="slide"`, `data-tabs="noanim"`, `data-tabs="empty"` |
  | `js_slider` + `data-swiper-id="имя"`, `js_slide` | `data-slider="имя"`, `data-slide` |
  | `js_spoiler-item`, `js_spoiler-title`, `js_spoiler-content` | `data-spoiler`, `data-spoiler-title`, `data-spoiler-content` |
  | `js_tooltip`, `js_tooltip-button`, `js_tooltip-body` | `data-tooltip`, `data-tooltip-button`, `data-tooltip-body` |
  | `js_notify`, `js_notify-content` | `data-notify`, `data-notify-content` |
  | `js_article-content`, `js_article-link`, `js_article-target` | `data-article`, `data-article-link`, `data-article-target` |
  | `js_select`, `js_tel-mask`, `js_gallery`, `js_get-height`, `js_height-goal` | `data-select`, `data-tel-mask`, `data-gallery`, `data-get-height`, `data-height-goal` |
  | `js_number`, `js_number-input`, `js_number-button-minus`, `js_number-button-plus` | `data-number`, `data-number-input`, `data-number-minus`, `data-number-plus` |
  | `js_range`, `js_range-input`, `js_range-text`, `js_range-val` | `data-range`, `data-range-input`, `data-range-text`, `data-range-val` |
  | `js_dual-range`, `js_dual-range-input-container`, `js_dual-range-input`, `js_dual-range-text`, `js_dual-range-val` | `data-dual-range`, `data-dual-range-track`, `data-dual-range-input`, `data-dual-range-text`, `data-dual-range-val` |
  | `js_file`, `js_file-input`, `js_file-label` | `data-file`, `data-file-input`, `data-file-label` |
  | `js_request-form`, `js_next-form` | `data-modx-form="request"`, `data-modx-form="next"` |
  | `_modal`, `_modal-content` | `data-modal`, `data-modal-content` |
  | `_hide-menu`, `_hide-menu-content` | `data-hide-menu`, `data-hide-menu-content` |
  | `_burger-icon`, `_checkbox`, `_checkbox--toggler`, `_checkbox-input` | `data-burger`, `data-checkbox`, `data-checkbox="toggler"`, `data-checkbox-input` |
  | `data-modal="id"` *(кнопка открытия)* | `data-modal-open="id"` |

- **Состояния — нативные селекторы, ARIA и `data-state` вместо глобальных классов.**

  | Было | Стало |
  | :--- | :--- |
  | `active` у ссылки таба | `aria-selected="true"` |
  | `active` у таба | `data-state="active"` |
  | `active` у ссылки оглавления | `aria-current="location"` |
  | `_open` у бургера + `lock--hide-menu` у `body` | `aria-expanded="true"` у бургера |
  | `open` у оповещения, показываемого сразу | `data-notify="open"` |
  | `fill`, `focus`, `send` | `data-state="fill"`, `data-state="focus"`, `data-state="send"` |
  | `lock`, `lock--clear`, `lock--имя` у `body` | `data-state="lock lock-clear lock-имя"` |
  | `load-dom`, `load`, `scroll` у `body` | `data-state="load-dom load scroll"` |
  | `current-slide`, `disable`, `hidden`, `clickable` *(Swiper)* | `slider-slide--current`, `slider-navigation__link--disabled`, `slider-navigation__link--hidden`, `slider-pagination--clickable` |

- Цвета переведены с Sass-переменных `$c-*` на CSS-переменные `--c-*` в `src/scss/base/colors.scss`. Прозрачность задаётся через `color-mix`, а не `rgba()`. Сниппет `vc` вставляет `var(--c-…)`. Файл `src/scss/abstracts/colors.scss` удалён.
- Контейнер задаётся классом `container` рядом с БЭМ-именем вместо селектора `[class*="__container"]`, который цеплял и `card__container-img`. Появление при прокрутке стало отдельным компонентом `appear`: оно больше не висит на каждом контейнере страницы, а модификатор `--noanim` не нужен. Анимация не подключается при `prefers-reduced-motion: reduce`.
- Файлы `index.scss` в `components/` и `layout/` генерируются рекурсивно: подпапка без собственного индекса больше не роняет компиляцию. `src/scss/components/form/index.scss` теперь генерируемый и лежит в `.gitignore`.
- Пункт меню, раскрывающий подменю, размечается тегом `<button>`: ссылка без `href` не получала фокус, и меню было недоступно с клавиатуры. Подменю открывается по `:focus-within`, а по наведению — только там, где указатель это умеет.
- Кнопки в чанках и сниппетах получили `type` и `aria-label`, иконки спрайта — `aria-hidden="true" focusable="false"`.
- Сниппет спойлеров приведён к нативному `<details>` с атрибутом `name`.

### Исправлено
- Закрытые модальные окна, боковое меню, оповещения и подменю получали фокус по `Tab` и читались скринридером: `display: block` перебивал `dialog:not([open])` и `[popover]:not(:popover-open)`, а элементы просто уезжали за экран. Появление анимируется через `display`/`overlay` с `allow-discrete` и `@starting-style`.
- `.sem-hide` скрывал элемент и от скринридера (`visibility: hidden`) — заменён на стандартный visually-hidden.
- `min-width: 375px` на `html` и `body` давал горизонтальный сдвиг на экранах уже 375px. Вёрстка резиновая до 320px, горизонтальную прокрутку страницы отсекает `overflow-x: clip` на `.wrapper`.
- Миксин `font` подключал `.ttf`, которого нет в сборке, — каждый шрифт давал лишний 404.

### Удалено
- Sass-переменные цветов `$c-*` и переменная `$minWidth`.
- Устаревшие префиксы в сбросе: `-khtml-`, `-ms-`, `-moz-box-sizing`, `input::-ms-clear`, `button::-moz-focus-inner`, дублирующий `@supports (font-variation-settings)` и HTML5-заглушка `display: block` для секционных тегов. Недостающие префиксы расставляет lightningcss по `browserslist`.
- Заготовка `_on-click` в выпадающем меню и `will-change` в табах.

## [1.3.0] — 16.09.2026

### Добавлено
- Единый контракт JS-модулей: каждый модуль экспортирует `init(root = document)`, молча выходит при отсутствии своей разметки и безопасно вызывается повторно. Подгруженный аяксом фрагмент инициализируется вызовом `initModules(fragment)`.
- Реестр модулей `src/js/modules/index.js`: пары «селектор разметки → модуль». Модуль скачивается, только если его разметка есть на странице, поэтому `main.js` весит около 2 КБ вместо 345 КБ, а Swiper, IMask, галерея и полифил лежат отдельными файлами в `build/js/chunks/`.
- Диагностика неполной разметки в режиме разработки (`devWarn`): сообщение с указанием конкретного блока. Из продакшн-бандла вырезается по флагу `__DEV__`.
- Утилита `initOnce` для идемпотентной инициализации элементов.
- Модуль интеграции с MODX `src/js/modules/cms/modx.js` — отдельно от модулей форм, по умолчанию выключен.
- README: разделы «Контракт модулей», «Реестр модулей и ленивая загрузка» и «Как обойтись без определения браузера и системы» с заменами UA-сниффинга на `@media (hover)`, `(pointer)`, `dvh`, `scrollbar-gutter` и `@supports`.

### Изменено
- Галерея переведена с Fancybox на PhotoSwipe: лицензия MIT вместо проприетарной, требующей платной лицензии для коммерческих проектов. Разметка — контейнер `js_gallery` и ссылки с `data-pswp-width` и `data-pswp-height`. Ядро библиотеки подгружается при первом открытии изображения.
- Спойлеры собраны на нативном `<details>` и работают без JS: анимация раскрытия — через `::details-content` и `grid-template-rows`, режим аккордеона — атрибутом `name` вместо класса `js_spoiler--single`, заголовок — `<summary>` вместо `<h2>`, контейнеру группы отдельный класс больше не нужен. Модуль `initSpoilers` удалён.
- Тултипы работают на чистом CSS и открываются не только по наведению, но и по фокусу — с клавиатуры и по тапу. Кнопка вызова должна быть `<button>`. Модуль `initTooltip` удалён.
- Высота шапки пишется в `--header-height` на `<html>` и пересчитывается через `ResizeObserver`. Переменные приведены к kebab-case: `--headerHeight` → `--header-height`, `--scrollbarWidth` → `--scrollbar-width`, `--targetHeight` → `--target-height`.
- Табы получили роли `tablist`/`tab`/`tabpanel`, переключение стрелками с клавиатуры и пересчёт высоты через `ResizeObserver` — контент больше не обрезается после переноса строк.
- Оглавление статьи: существующий `id` заголовка сохраняется, иначе собирается из текста в транслите вместо `target-0`; отслеживание переведено на `IntersectionObserver`; активная ссылка получает класс `active`, как и описано в документации. На странице может быть несколько статей.
- Двойные ползунки ищут элементы по классам внутри своего блока, а не по идентификаторам, — их можно размещать на странице сколько угодно. Второй ползунок по умолчанию встаёт на максимум.
- `copyWithClick` показывает уведомление и при успешном копировании; текст задаётся атрибутом `data-copy-message`.
- IMask и Iodine импортируются там, где используются, вместо неявной записи в `window`. Файл `src/js/libs/libs.js` удалён.

### Удалено
- Модуль `scrollToAnchor` и класс `js_scroll-to`: обычная ссылка-якорь останавливается под шапкой за счёт `scroll-padding-top: var(--header-height)` на `html`.
- Модуль `detectUserInfo` и классы `system-*`, `browser-*`: определение по `navigator.userAgent` ошибалось на iPadOS и браузерах iOS, а классы не использовались ни в одном файле шаблона. Чем их заменить — в README, раздел «Полезные советы».

## [1.2.0] — 15.09.2026

### Добавлено
- Минификация CSS и вендорные префиксы через lightningcss по `browserslist`.
- Sourcemaps для CSS и JS в режиме разработки (`style.css.map`, `main.js.map`).
- Сброс кэша в продакшн-сборке: к ссылкам на стили и скрипты дописывается `?v=<хэш содержимого>`, в своих чанках — переменные `@@cssVersion` и `@@jsVersion`.
- Выгрузка на сервер: только изменённые файлы (кэш хэшей `.deploy-cache.json`), атомарная замена файлов через `posix-rename`, флаги `--dry-run`, `--force`, `--delete` (с подтверждением) и `--yes`. `pnpm dev:deploy` при старте догружает файлы, изменённые с прошлой выгрузки.
- Кэш конвертации шрифтов `.cache/fonts`: ttf → woff2 пересчитывается только для новых и изменённых шрифтов; готовые `.woff2` из `src/fonts` копируются как есть.
- `gulp/config/app.js` и `gulp/config/paths.js` — режим, окружение и все пути сборки в одном месте.
- Порт dev-сервера настраивается через `SERVER_PORT` в `.env`.

### Изменено
- JS собирается esbuild вместо webpack-stream (≈0,1 с вместо ≈6 с): ES-модуль с разбиением на чанки, подключается как `<script type="module">`. Модульные скрипты не работают при открытии HTML напрямую с диска (`file://`) — страницы из `build` нужно открывать через сервер.
- Задачи импортируют конфиг явно, `global.app` больше нет.
- Продакшн-сборка останавливается на первой ошибке с ненулевым кодом выхода, поэтому `pnpm run deploy` не выгрузит неполный билд. В режиме разработки ошибки по-прежнему показываются уведомлением.
- В продакшн-сборке HTML собирается после CSS и JS.
- Плагин `svg-remove-fill` заменён на `svg-current-color` (плагин svgo): чёрные `fill` и `stroke` становятся `currentColor`, `fill="none"` сохраняется. Иконки с обводкой больше не нужно переводить в `Outline stroke`.
- Картинки: все форматы из `src/img` копируются в `build/img`, в продакшн-сборке JPG, PNG, GIF и SVG сжимаются (JPG — качество 80).
- В режиме разработки исходные `.ttf` больше не копируются в `build/fonts` — шрифты в dev и в продакшн-сборке одинаковые.

### Исправлено
- В продакшн уходил неминифицированный CSS.
- Настройки imagemin игнорировались, у SVG удалялся `viewBox`, а `.webp`, `.avif`, `.ico` и другие форматы не попадали в сборку.
- SVG-спрайт: контурные иконки заливались чёрным, `stroke` не переводился в `currentColor`, настройка `removeAttrs` не работала.
- Минификатор HTML склеивал слова между inline-тегами (`<b>цена</b> <span>₽</span>` → «цена₽»).
- Страницы с одинаковыми именами из разных папок молча перезаписывали друг друга в `build` — теперь сборка останавливается с ошибкой.
- Ошибки задач (SCSS, HTML и др.) в продакшн-сборке проглатывались, сборка завершалась «успешно».
- Удалённые из `src/img`, `src/root` и `src/fonts` файлы оставались в `build` в режиме разработки.
- Задача `server` не сообщала о завершении.
- Импорт полифила scroll-timeline ожидал несуществующий экспорт.

### Удалено
- Зависимости `webpack-stream`, `gulp-autoprefixer`, `gulp-css-mqpacker`.

## [1.1.0] — 15.09.2026

### Добавлено
- Окружения сборки `stage` и `prod` (флаг `--env`, переменная `env` в HTML-чанках, `app.env` и `app.isProd` в задачах). `pnpm dev` и `pnpm dev:deploy` собирают stage, `pnpm build` и `pnpm run deploy` — prod. Новые команды `pnpm build:stage` и `pnpm deploy:stage`.
- `pnpm-lock.yaml` в репозитории — одинаковые версии зависимостей во всех форках.
- `engines` (Node.js >= 22), `.nvmrc`, `.npmrc` с `engine-strict`, явный `browserslist`.
- CHANGELOG.md.

### Изменено
- `<meta name="robots" content="noindex, nofollow">` и dev-фреймы test-id.ru выводятся только вне prod — раньше они попадали на боевой сайт.
- Модальные окна: открытие добавляет запись в историю через `pushState`, закрытие крестиком, Esc или кликом вне окна убирает её (`history.back()`). Кнопка «Назад» по-прежнему закрывает окно, дублей в истории больше нет. Хэш при загрузке сбрасывается только при точном совпадении с id окна.
- `picture > img` вместо глобального `img { position: absolute }`: картинки вне `picture` (контент CMS, логотипы, галереи) остаются в потоке. С `img` снят `pointer-events: none`.
- Видимый индикатор фокуса `:focus-visible` вместо глобального `outline: none`.

### Исправлено
- html-задача зависала в dev, если в проекте нет ни одной страницы `_*.html`.
- Watcher шрифтов смотрел в несуществующую папку `src/font`.
- Правки в рукописных `index.scss` (`base/`, `tech/`, `abstracts/` и др.) не пересобирали CSS — из watch исключены только автогенерируемые индексы.
- `pageLock('unlock')` удалял с `body` все классы, содержащие подстроку `lock` (`blocked`, `unlock-promo`), — теперь только `lock` и `lock--*`.
- Слайдер-пример падал на каждой смене слайда без кастомной пагинации; для `loop` используется `realIndex`; `renderFraction` перенесён в настройки нумерованной пагинации.
- Успешная отправка одной формы (FetchIt) показывала «Отправлено» во всех формах; форма без `.form__button` обрывала обработку остальных.
- `showCustomNotify` падал в собственном обработчике ошибок (`console.custom`).
- В `button` сброс `all: unset` затирал `cursor: pointer`.
- Миксины `ef-*` роняли компиляцию SCSS (`rem()` без неймспейса `func`).

### Удалено
- Раздел README про деплой через VSCode-расширение SFTP по FTP с паролем в `.vscode/sftp.json`.
