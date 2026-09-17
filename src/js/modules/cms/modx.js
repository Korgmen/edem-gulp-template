import Iodine from '@caneara/iodine';
import setState from '../utils/setState.js';

// Интеграция с MODX-расширением FetchIt [readme 3.7]
// Модуль нужен только на проектах под MODX: на остальных его можно не подключать
const iodine = new Iodine();

const validateForm = (e, rules) => {
	const { formData, fetchit } = e.detail;
	const fields = Object.fromEntries(formData.entries());
	const validation = iodine.assert(fields, rules);

	if (validation.valid) return;

	e.preventDefault();

	for (const [name, field] of Object.entries(validation.fields)) {
		if (field.valid) {
			fetchit.clearError(name);
			continue;
		}
		fetchit.setError(name, field.error);
	}
};

// Сообщение об отправке формы
const initSuccessMessage = () => {
	document.addEventListener('fetchit:success', (e) => {
		const form = e.detail?.form;
		if (!form) return;

		const formButton = form.querySelector('.form__button');
		if (!formButton) return;

		const formButtonContent = formButton.innerHTML;

		form.querySelectorAll('[data-state~="fill"]').forEach((el) => setState(el, 'fill', false));
		setState(formButton, 'send', true);
		formButton.innerHTML = 'Отправлено';

		setTimeout(() => {
			setState(formButton, 'send', false);
			formButton.innerHTML = formButtonContent;
		}, 3000);
	});
};

// Валидация полей перед отправкой
const initValidation = () => {
	document.addEventListener('fetchit:before', (e) => {
		iodine.setErrorMessages({
			required: 'Необходимо заполнить это поле',
			email: 'Email адрес введен некорректно',
			minLength: 'Имя должно быть длиннее двух символов',
			regexMatch: 'Номер телефона введен некорректно',
		});

		const rules = {
			name: ['required', 'minLength:2'],
			phoneRussia: ['required', 'regexMatch:\\+7\\s\\(\\d{3}\\)\\s\\d{3}\\-\\d{2}\\-\\d{2}'],
			phoneCanada: ['required', 'regexMatch:\\+1\\s\\d{3}\\-\\d{3}\\-\\d{4}'],
			email: ['required', 'email'],
		};

		const form = e.detail.form;
		if (form.matches('[data-modx-form]')) {
			validateForm(e, rules);
		}
	});
};

export const init = () => {
	initSuccessMessage();
	initValidation();
};
