import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';
import { devWarn } from '../utils/devLog.js';

const calculatePercentage = (value, min, max) =>
	((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

// Логика двойного ползунка [readme 3.5]
// Ползунков на странице может быть сколько угодно, поэтому в селекторах только классы блока
export const init = (root = document) => {
	initOnce(root, '.js_dual-range', 'dualRangeInput', dualRange => {
		const [inputFirst, inputLast] = dualRange.querySelectorAll('.js_dual-range-input');
		const [rangeValFirst, rangeValLast] = dualRange.querySelectorAll('.js_dual-range-val');

		if (!inputFirst || !inputLast || !rangeValFirst || !rangeValLast) {
			devWarn('dualRangeInput', 'нужны два .js_dual-range-input и два .js_dual-range-val — блок пропущен', dualRange);
			return;
		}

		const rangeParent = dualRange.parentElement;
		const rangeMin = inputFirst.getAttribute('min') ?? 0;
		const rangeMax = inputFirst.getAttribute('max') ?? 100;
		const rangeStep = inputFirst.getAttribute('step');

		// Диапазон задаётся один раз на первом ползунке, второй подхватывает его и встаёт на максимум
		inputLast.setAttribute('min', rangeMin);
		inputLast.setAttribute('max', rangeMax);
		if (rangeStep) inputLast.setAttribute('step', rangeStep);
		if (!inputLast.getAttribute('value')) inputLast.value = rangeMax;

		const updateRangeValue = (input, rangeVal, propertyName) => {
			rangeVal.innerHTML = Number(input.value).toLocaleString();
			dualRange.style.setProperty(propertyName, `${calculatePercentage(input.value, rangeMin, rangeMax)}%`);
		};

		[inputFirst, inputLast].forEach(inputRange => {
			inputRange.addEventListener('input', () => {
				toggleClass(dualRange, 'fill', false);
				toggleClass(rangeParent, 'fill', false);
			});

			inputRange.addEventListener('change', () => {
				toggleClass(dualRange, 'fill', true);
				toggleClass(rangeParent, 'fill', true);
			});
		});

		// Ползунки не проходят друг сквозь друга
		const clamp = (input, otherInput, isFirst) => () => {
			if (isFirst && Number(input.value) > Number(otherInput.value)) input.value = otherInput.value;
			if (!isFirst && Number(input.value) < Number(otherInput.value)) input.value = otherInput.value;
		};

		const bind = (input, otherInput, rangeVal, propertyName, isFirst) => {
			const limit = clamp(input, otherInput, isFirst);
			input.addEventListener('input', () => {
				limit();
				updateRangeValue(input, rangeVal, propertyName);
			});
		};

		rangeValFirst.innerHTML = Number(rangeMax).toLocaleString();
		dualRange.style.setProperty('--maxval-width', `${rangeValFirst.parentNode.scrollWidth}px`);

		updateRangeValue(inputFirst, rangeValFirst, '--cur-perc-first');
		updateRangeValue(inputLast, rangeValLast, '--cur-perc-last');

		bind(inputFirst, inputLast, rangeValFirst, '--cur-perc-first', true);
		bind(inputLast, inputFirst, rangeValLast, '--cur-perc-last', false);
	});
};
