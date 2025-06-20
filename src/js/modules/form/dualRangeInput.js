import toggleClass from '../utils/toggleClass.js'
import getElementOrThrow from '../utils/getElementOrThrow.js'

function calculatePercentage(value, min, max) {
	return ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;
}

function updateRangeValue(input, rangeVal, dualRange, propertyName, min, max) {
	rangeVal.innerHTML = Number(input.value).toLocaleString();
	dualRange.style.setProperty(propertyName, calculatePercentage(input.value, min, max) + '%');
}

function handleInput(input, otherInput, rangeVal, dualRange, propertyName, min, max, isFirst) {
	input.addEventListener('input', function () {
		if (isFirst && parseInt(otherInput.value) - parseInt(input.value) <= 0) {
			input.value = parseInt(otherInput.value) - 0;
		} else if (!isFirst && parseInt(input.value) - parseInt(otherInput.value) <= 0) {
			input.value = parseInt(otherInput.value) + 0;
		}
		updateRangeValue(input, rangeVal, dualRange, propertyName, min, max);
	});
}

// Логика двойного ползунка [readme 3.5]
try {
	const dualRanges = document.querySelectorAll('.js_dual-range');

	dualRanges.forEach(dualRange => {
		const rangeParen = dualRange.parentElement;
		const inputFirst = getElementOrThrow('.js_dual-range-input[id="dual-range-1"]', dualRange);
		const inputLast = getElementOrThrow('.js_dual-range-input[id="dual-range-2"]', dualRange);
		const rangeValFirst = getElementOrThrow('.js_dual-range-val[for="dual-range-1"]', dualRange);
		const rangeValLast = getElementOrThrow('.js_dual-range-val[for="dual-range-2"]', dualRange);

		const rangeMin = inputFirst.getAttribute('min');
		const rangeMax = inputFirst.getAttribute('max');
		const rangeStep = inputFirst.getAttribute('step');
		const rangeValue = inputFirst.getAttribute('value');

		[inputFirst, inputLast].forEach(inputRange => {
			inputRange.addEventListener('input', function () {
				toggleClass(dualRange, 'fill', false);
				toggleClass(rangeParen, 'fill', false);
			});

			inputRange.addEventListener('change', function () {
				toggleClass(dualRange, 'fill', true);
				toggleClass(rangeParen, 'fill', true);
			});
		});

		inputLast.setAttribute('min', rangeMin);
		inputLast.setAttribute('max', rangeMax);
		inputLast.setAttribute('step', rangeStep);
		inputLast.setAttribute('value', Number(rangeValue) + Number(rangeMax) / 2);

		document.addEventListener('DOMContentLoaded', function () {
			rangeValFirst.innerHTML = Number(rangeMax).toLocaleString();
			rangeValFirst.closest('.js_dual-range').style.setProperty('--maxval-width', rangeValFirst.parentNode.scrollWidth + 'px');
			updateRangeValue(inputFirst, rangeValFirst, dualRange, '--cur-perc-first', rangeMin, rangeMax);
			updateRangeValue(inputLast, rangeValLast, dualRange, '--cur-perc-last', rangeMin, rangeMax);

			handleInput(inputFirst, inputLast, rangeValFirst, dualRange, '--cur-perc-first', rangeMin, rangeMax, true);
			handleInput(inputLast, inputFirst, rangeValLast, dualRange, '--cur-perc-last', rangeMin, rangeMax, false);
		});
	});
} catch (err) {
	console.error('Ошибка в модуле dualRangeInput:', err.message, err.stack);
}