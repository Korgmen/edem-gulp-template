# Changelog

Все значимые изменения шаблона. Формат — [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/), версии — [SemVer](https://semver.org/lang/ru/).
Форкам: смотрите разделы «Изменено» и «Исправлено», чтобы понять, что стоит перенести из шаблона в свой проект.

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
