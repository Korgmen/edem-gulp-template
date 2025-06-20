// Логика поля ввода номера телефона [readme 3.1]
try {
	const telInputs = document.querySelectorAll('.js_tel-mask');

	telInputs.forEach(telInput => {
		try {
			IMask(telInput, {
				mask: '+{7} (000) 000-00-00',
			});
		} catch (err) {
			console.error(`Ошибка при инициализации маски для элемента:`, telInput, err.message);
		}
	});
} catch (err) {
	console.error('Ошибка в модуле telInput:', err.message, err.stack);
}