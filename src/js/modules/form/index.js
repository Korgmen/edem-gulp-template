import getElementOrThrow from '../utils/getElementOrThrow.js'
import toggleClass from '../utils/toggleClass.js'

import './telInput.js'
import './select.js'
import './numberInput.js'
import './rangeInput.js'
import './dualRangeInput.js'
import './fileInput.js'

//Сообщение об отправке формы (для MODX-расширения FetchIt)
try {
	const forms = document.querySelectorAll('form.form');
	forms.forEach(form => {
		const formButton = getElementOrThrow('.form__button', form);
		const formButtonContent = formButton.innerHTML;

		const handleSuccess = () => {
			form.querySelectorAll('.fill').forEach(el => toggleClass(el, 'fill', false));
			toggleClass(formButton, 'send', true);
			formButton.innerHTML = 'Отправлено';
			setTimeout(() => {
				toggleClass(formButton, 'send', false);
				formButton.innerHTML = formButtonContent;
			}, 3000);
		};

		document.addEventListener('fetchit:success', handleSuccess);
	});
} catch (err) {
	console.error('Ошибка в логике сообщения об отправке формы:', err.message, err.stack);
}

//Работа библиотеки iodine (для MODX-расширения FetchIt)
function validateForm(e, rules) {
	const { formData, fetchit } = e.detail;
	const fields = Object.fromEntries(formData.entries());
	const validation = Iodine.assert(fields, rules);

	if (validation.valid) {
		return;
	}

	e.preventDefault();

	for (const [name, field] of Object.entries(validation.fields)) {
		if (field.valid) {
			fetchit.clearError(name);
			continue;
		}
		fetchit.setError(name, field.error);
	}
}

document.addEventListener('fetchit:before', (e) => {
	Iodine.setErrorMessages({
		required: `Необходимо заполнить это поле`,
		email: `Email адрес введен некорректно`,
		minLength: `Имя должно быть длиннее двух символов`,
		regexMatch: `Номер телефона введен некорректно`
	});

	const rules = {
		name: ['required', 'minLength:2'],
		phoneRussia: ['required', 'regexMatch:\\+7\\s\\(\\d{3}\\)\\s\\d{3}\\-\\d{2}\\-\\d{2}'],
		phoneCanada: ['required', 'regexMatch:\\+1\\s\\d{3}\\-\\d{3}\\-\\d{4}'],
		email: ['required', 'email']
	};

	if (e.detail.form.classList.contains('js_request-form')) {
		validateForm(e, rules);
	}

	if (e.detail.form.classList.contains('js_next-form')) {
		validateForm(e, rules);
	}
});