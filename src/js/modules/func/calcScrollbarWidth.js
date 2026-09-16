// Ширина полосы прокрутки [readme 2.14]
export const init = () => {
	const div = document.createElement('div');
	div.style.cssText = 'position:absolute;top:-9999px;width:50px;height:50px;overflow-y:scroll';
	document.body.append(div);

	const scrollbarWidth = div.offsetWidth - div.clientWidth;
	div.remove();

	document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
};
