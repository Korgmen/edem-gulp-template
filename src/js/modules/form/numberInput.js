import getElementOrThrow from '../utils/getElementOrThrow.js';
import toggleClass from '../utils/toggleClass.js';

// Логика числового поля ввода инпута [readme 3.3]
try {
	const numberInputBlocks = document.querySelectorAll('.js_number');

	numberInputBlocks.forEach(numberInputBlock => {
		const numberInput = getElementOrThrow('.js_number-input', numberInputBlock);
		const numberInputMin = Number(numberInput.getAttribute('min')) || 0;
		const numberInputMax = Number(numberInput.getAttribute('max')) || Infinity;
		const numberButtonMinus = getElementOrThrow('.js_number-button-minus', numberInputBlock);
		const numberButtonPlus = getElementOrThrow('.js_number-button-plus', numberInputBlock);

		// Устанавливаем минимальное значение, если поле пустое
		if (!numberInput.value) {
			numberInput.value = numberInputMin;
		}

		// Функция для обновления состояния input
		const updateInputState = () => {
			toggleClass(numberInput, 'fill', true);
			toggleClass(numberInput.parentElement, 'fill', true);
		};

		// Функция для проверки границ значений
		const validateInputValue = () => {
			const currentValue = Number(numberInput.value);
			if (currentValue > numberInputMax) {
				numberInput.value = numberInputMax;
			} else if (currentValue < numberInputMin) {
				numberInput.value = numberInputMin;
			}
		};

		// Обработчик для кнопки уменьшения
		numberButtonMinus.addEventListener('click', () => {
			updateInputState();
			if (!numberInput.value) {
				numberInput.value = numberInputMin;
			} else {
				numberInput.stepDown();
			}
			validateInputValue();
		});

		// Обработчик для кнопки увеличения
		numberButtonPlus.addEventListener('click', () => {
			updateInputState();
			if (!numberInput.value) {
				numberInput.value = numberInputMin;
			} else {
				numberInput.stepUp();
			}
			validateInputValue();
		});

		// Обработчик для ввода вручную
		numberInput.addEventListener('input', () => {
			updateInputState();
		});

		// Проверка значения при потере фокуса
		numberInput.addEventListener('blur', () => {
			validateInputValue();
		});
	});
} catch (err) {
	console.error('Ошибка в модуле numberInput:', err.message, err.stack);
}