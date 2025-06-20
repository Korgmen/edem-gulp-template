import toggleClass from '../utils/toggleClass.js';

// Слайдер [readme 2.3]
export default () => {
	try {
		// Находим все слайдеры
		const sliders = document.querySelectorAll('.js_slider');
		if (!sliders.length) throw new Error('Слайдеры с классом "js_slider" не найдены.');

		sliders.forEach(slider => {
			// Добавляем класс для инициализации Swiper
			toggleClass(slider, 'swiper', true);

			// Находим слайды только ближайшего уровня, чтобы избежать проблем с вложенными друг в друга слайдерами
			const slides = slider.querySelectorAll(':scope > .js_slide');
			if (!slides.length) throw new Error('Слайды с классом "js_slide" не найдены для слайдера:', slider);

			// Добавляем класс для каждого слайда
			slides.forEach(slide => toggleClass(slide, 'swiper-slide', true));

			// Создаём обёртку для слайдов
			const sliderWrapper = document.createElement('div');
			toggleClass(sliderWrapper, 'swiper-wrapper', true);
			sliderWrapper.append(...slides);

			// Вставляем обёртку в слайдер
			slider.insertAdjacentElement('afterBegin', sliderWrapper);
		});
	} catch (err) {
		console.error('Ошибка в модуле initSliders:', err.message, err.stack);
	}
};