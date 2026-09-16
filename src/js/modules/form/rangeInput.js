import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';
import { requireChild } from '../utils/devLog.js';

const calculatePercentage = (value, min, max) =>
	((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

// Логика ползунка [readme 3.4]
export const init = (root = document) => {
	initOnce(root, '.js_range', 'rangeInput', rangeBlock => {
		const rangeInput = requireChild(rangeBlock, 'input', 'rangeInput');
		const rangeVal = requireChild(rangeBlock, '.js_range-val', 'rangeInput');
		if (!rangeInput || !rangeVal) return;

		const rangeParent = rangeBlock.parentElement;
		const rangeInputMin = rangeInput.getAttribute('min') ?? 0;
		const rangeInputMax = rangeInput.getAttribute('max') ?? 100;

		rangeInput.addEventListener('input', () => {
			toggleClass(rangeBlock, 'fill', false);
			toggleClass(rangeParent, 'fill', false);
		});

		rangeInput.addEventListener('change', () => {
			toggleClass(rangeBlock, 'fill', true);
			toggleClass(rangeParent, 'fill', true);
		});

		// Ширина поля фиксируется по самому длинному значению, чтобы разметка не прыгала при перетаскивании
		rangeVal.innerHTML = Number(rangeInputMax).toLocaleString();
		rangeVal.parentNode.style.setProperty('--maxval-width', `${rangeVal.parentNode.scrollWidth}px`);

		const update = () => {
			rangeVal.innerHTML = Number(rangeInput.value).toLocaleString();
			rangeInput.style.setProperty('--cur-perc', `${calculatePercentage(rangeInput.value, rangeInputMin, rangeInputMax)}%`);
		};

		update();
		rangeInput.addEventListener('input', update);
	});
};
