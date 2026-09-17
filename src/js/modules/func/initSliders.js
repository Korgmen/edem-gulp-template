import initOnce from '../utils/initOnce.js';
import toggleClass from '../utils/toggleClass.js';
import { devWarn } from '../utils/devLog.js';

// Слайдер [readme 2.3]
// Готовит разметку под Swiper: сама библиотека подключается в modules/lib-control/sliders.js
export const init = (root = document) => {
	initOnce(root, '[data-slider]', 'initSliders', (slider) => {
		toggleClass(slider, 'swiper', true);

		// Слайды берутся только ближайшего уровня, чтобы не задеть вложенные слайдеры
		const slides = slider.querySelectorAll(':scope > [data-slide]');
		if (!slides.length) {
			devWarn('initSliders', 'в слайдере нет слайдов [data-slide]', slider);
			return;
		}

		slides.forEach((slide) => toggleClass(slide, 'swiper-slide', true));

		const sliderWrapper = document.createElement('div');
		toggleClass(sliderWrapper, 'swiper-wrapper', true);
		sliderWrapper.append(...slides);

		slider.insertAdjacentElement('afterBegin', sliderWrapper);
	});
};
