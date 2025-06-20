import toggleClass from '../utils/toggleClass.js';
import getElementOrThrow from '../utils/getElementOrThrow.js';

// Скролл до якоря [readme 2.6]
export default () => {
	try {
		const tooltips = document.querySelectorAll('.js_tooltip');

		if (tooltips.length === 0) throw new Error('На странице не найдено тултипов');

		tooltips.forEach(tooltip => {
			const tooltipShowButton = getElementOrThrow('.js_tooltip-button', tooltip);
			const tooltipBody = getElementOrThrow('.js_tooltip-body', tooltip);

			tooltipShowButton.addEventListener('mouseover', () => toggleClass(tooltipBody, 'show', true));
			tooltipShowButton.addEventListener('mouseout', () => toggleClass(tooltipBody, 'show', false));
		});
	} catch (err) {
		console.error('Ошибка в модуле initTooltip:', err.message, err.stack);
	}
}