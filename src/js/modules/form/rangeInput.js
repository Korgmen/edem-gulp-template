import initOnce from '../utils/initOnce.js';
import setState from '../utils/setState.js';
import { requireChild } from '../utils/devLog.js';

const calculatePercentage = (value, min, max) => ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

// Логика ползунка [readme 3.4]
export const init = (root = document) => {
	initOnce(root, '[data-range]', 'rangeInput', (rangeBlock) => {
		const rangeInput = requireChild(rangeBlock, 'input', 'rangeInput');
		const rangeVal = requireChild(rangeBlock, '[data-range-val]', 'rangeInput');
		if (!rangeInput || !rangeVal) return;

		const rangeParent = rangeBlock.parentElement;
		const rangeInputMin = rangeInput.getAttribute('min') ?? 0;
		const rangeInputMax = rangeInput.getAttribute('max') ?? 100;

		rangeInput.addEventListener('input', () => {
			setState(rangeBlock, 'fill', false);
			setState(rangeParent, 'fill', false);
		});

		rangeInput.addEventListener('change', () => {
			setState(rangeBlock, 'fill', true);
			setState(rangeParent, 'fill', true);
		});

		// Ширина поля фиксируется по самому длинному значению, чтобы разметка не прыгала при перетаскивании
		rangeVal.innerHTML = Number(rangeInputMax).toLocaleString();
		rangeVal.parentNode.style.setProperty('--maxval-width', `${rangeVal.parentNode.scrollWidth}px`);

		const update = () => {
			rangeVal.innerHTML = Number(rangeInput.value).toLocaleString();
			rangeInput.style.setProperty(
				'--cur-perc',
				`${calculatePercentage(rangeInput.value, rangeInputMin, rangeInputMax)}%`,
			);
		};

		update();
		rangeInput.addEventListener('input', update);
	});
};
