import initOnce from '../utils/initOnce.js';
import setState from '../utils/setState.js';
import { requireChild } from '../utils/devLog.js';

// Логика числового поля ввода инпута [readme 3.3]
export const init = (root = document) => {
	initOnce(root, '[data-number]', 'numberInput', (numberInputBlock) => {
		const numberInput = requireChild(numberInputBlock, '[data-number-input]', 'numberInput');
		const numberButtonMinus = requireChild(numberInputBlock, '[data-number-minus]', 'numberInput');
		const numberButtonPlus = requireChild(numberInputBlock, '[data-number-plus]', 'numberInput');
		if (!numberInput || !numberButtonMinus || !numberButtonPlus) return;

		const numberInputMin = Number(numberInput.getAttribute('min')) || 0;
		const numberInputMax = Number(numberInput.getAttribute('max')) || Infinity;

		if (!numberInput.value) numberInput.value = numberInputMin;

		const updateInputState = () => {
			setState(numberInput, 'fill', true);
			setState(numberInput.parentElement, 'fill', true);
		};

		const validateInputValue = () => {
			const currentValue = Number(numberInput.value);
			if (currentValue > numberInputMax) numberInput.value = numberInputMax;
			else if (currentValue < numberInputMin) numberInput.value = numberInputMin;
		};

		const step = (direction) => {
			updateInputState();
			if (!numberInput.value) numberInput.value = numberInputMin;
			else direction === 'up' ? numberInput.stepUp() : numberInput.stepDown();
			validateInputValue();
		};

		numberButtonMinus.addEventListener('click', () => step('down'));
		numberButtonPlus.addEventListener('click', () => step('up'));
		numberInput.addEventListener('input', updateInputState);
		numberInput.addEventListener('blur', validateInputValue);
	});
};
