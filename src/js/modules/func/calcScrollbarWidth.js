// Ширина полосы прокрутки [readme 2.15]
export default () => {
	try {
		const body = document.body;

		const div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		div.style.position = 'absolute';
		div.style.top = '-9999px';
		body.append(div);

		const scrollbarWidth = div.offsetWidth - div.clientWidth;

		div.remove();

		body.style.setProperty('--scrollbarWidth', `${scrollbarWidth}px`);
	} catch (err) {
		console.error('Ошибка при вычислении ширины полосы прокрутки:', err.message, err.stack);
	}
};