import toggleClass from '../utils/toggleClass.js';

// Логика выпадающего списка [readme 3.2]
try {
	const selects = document.querySelectorAll('.js_select');

	selects.forEach(select => {
		select.addEventListener('change', function () {
			const parent = this.parentElement;

			if (this.value === '') {
				toggleClass(this, 'fill', false);
				toggleClass(parent, 'fill', false);
			} else {
				toggleClass(this, 'fill', true);
				toggleClass(parent, 'fill', true);
			}

			toggleClass(this, 'focus', false);
			toggleClass(parent, 'focus', false);
		});
	});
} catch (err) {
	console.error('Ошибка в модуле select:', err.message, err.stack);
}