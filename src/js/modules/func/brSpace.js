// Пробелы после тега <br> [readme 1.2]
export default () => {
	try {
		const brElements = document.querySelectorAll('br');

		brElements.forEach(br => {
			br.insertAdjacentHTML('afterend', ' ');
		});
	} catch (err) {
		console.error('Ошибка при добавлении пробелов после <br>:', err.message, err.stack);
	}
};