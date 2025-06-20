import toggleClass from '../utils/toggleClass.js'
import getElementOrThrow from '../utils/getElementOrThrow.js'

function calculatePercentage(value, min, max) {
	return ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;
}

// Логика ползунка [readme 3.4]
try {
	const rangeBlocks = document.querySelectorAll('.js_range');

	window.addEventListener('DOMContentLoaded', function () {
		rangeBlocks.forEach(rangeBlock => {
			const rangeParent = rangeBlock.parentElement;
			const rangeInput = getElementOrThrow('input', rangeBlock);
			const rangeInputMax = rangeInput?.getAttribute('max');
			const rangeInputMin = rangeInput?.getAttribute('min');
			const rangeVal = getElementOrThrow('.js_range-val', rangeBlock);

			rangeInput.addEventListener('input', function () {
				toggleClass(rangeBlock, 'fill', false);
				toggleClass(rangeParent, 'fill', false);
			});

			rangeInput.addEventListener('change', function () {
				toggleClass(rangeBlock, 'fill', true);
				toggleClass(rangeParent, 'fill', true);
			});

			rangeVal.innerHTML = Number(rangeInputMax).toLocaleString();
			rangeVal.parentNode.style.setProperty('--maxval-width', rangeVal.parentNode.scrollWidth + 'px');
			rangeVal.innerHTML = Number(rangeInput.value).toLocaleString();
			rangeInput.style.setProperty('--cur-perc', calculatePercentage(rangeInput.value, rangeInputMin, rangeInputMax) + '%');

			rangeInput.addEventListener('input', function () {
				rangeVal.innerHTML = Number(this.value).toLocaleString();
				rangeInput.style.setProperty('--cur-perc', calculatePercentage(this.value, rangeInputMin, rangeInputMax) + '%');
			});
		});
	});
} catch (err) {
	console.error('Ошибка в модуле rangeInput:', err.message, err.stack);
}