// Высота шапки [readme 2.13]
// Переменная нужна на :root: scroll-padding-top стоит на html и переменные из body туда не наследуются
export const init = () => {
	const header = document.querySelector('header');
	if (!header) return;

	const setHeight = () =>
		document.documentElement.style.setProperty('--header-height', `${header.offsetHeight / 16}rem`);

	setHeight();
	new ResizeObserver(setHeight).observe(header);
};
