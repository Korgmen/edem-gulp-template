import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, Mousewheel, Autoplay, EffectFade } from 'swiper/modules';
import { init as prepareSliders } from '../func/initSliders.js';

// Слайдеры [readme 4.1]
export const init = (root = document) => {
	// Swiper падает без готовой обёртки .swiper-wrapper, поэтому разметка строится до его вызова
	prepareSliders(root);

	const exampleSlider = new Swiper('[data-swiper-id="example"]', {
		modules: [Navigation, Pagination, Autoplay, Scrollbar, Mousewheel, EffectFade],
		slidesPerView: 3, // сколько слайдов будет показано за раз (можно использовать настройку 'auto')
		//loop: true, // "залупливание" слайдера (зацикливание)
		speed: 800, // скорость анимации перемотки
		spaceBetween: 32, // расстояние между слайдами
		//initialSlide: 1, // какой слайд будет отображаться при загрузке страницы (отсчет с 0)
		slideToClickedSlide: true, // переход к слайду, по которому был совершен клик
		//effect: 'fade', // пример подключения эффекта
		mousewheel: { // настройка для трекпадов (чтобы можно было листать слайдер жестами)
			forceToAxis: true
		},
		freeMode: { // добавляет свободный скролл (удобно, чтобы не дожидаться, пока прилетит следующий слайд)
			enabled: true,
			sticky: true,
		},
		//allowTouchMove: false, //отключить любые взаимодействия мыши со слайдером для перелистывания
		breakpoints: { // брейкпоинты
			600: { // действует, когда экран 600px и более
				//slidesPerView: 2
			},
		},
		autoplay: { // автоперемотка слайдера
			delay: 3000 // задержка перед перемоткой в мс
		},
		navigation: { // добавляет навигацию
			prevEl: '.content__block:has([data-swiper-id="example"]) .slider-navigation__link--prev', // класс ссылки на предыдущий слайд (нужно добавить блок с этим классом в слайдер)
			nextEl: '.content__block:has([data-swiper-id="example"]) .slider-navigation__link--next', // класс ссылки на следующий слайд (нужно добавить блок с этим классом в слайдер)
			disabledClass: 'disable',
			hiddenClass: 'hidden'
		},
		pagination: { // добавляет пагинацию
			el: '.content__block:has([data-swiper-id="example"]) .slider-pagination', // класс пагинации (нужно добавить блок с этим классом в слайдер)
			clickable: true,
			clickableClass: 'clickable',
			bulletClass: 'slider-pagination__bullet',
			bulletActiveClass: 'active',
			lockClass: 'disable'
		},
		// pagination: { // добавляет нумерованную пагинацию
		// 	el: '.content__block:has([data-swiper-id="example"]) .slider-num', // класс нумерованной пагинации (нужно добавить блок с этим классом в слайдер)
		// 	type: 'fraction',
		// 	renderFraction: function (currentClass, totalClass) { // своя разметка нумерованной пагинации
		// 		return `<span class="${currentClass}"></span>/<span class="${totalClass}"></span>`;
		// 	},
		// 	currentClass: 'slider-num__current',
		// 	totalClass: 'slider-num__total',
		//	lockClass: 'disable'
		// },
		// pagination: { // добавляет кастомную пагинацию (свои блоки в качестве пунктов пагинации)
		// 	el: '.content__block:has([data-swiper-id="example"]) .slider-pagination-custom',
		// 	clickable: true,
		// 	type: 'custom',
		// 	clickableClass: 'clickable',
		// 	bulletClass: 'slider-pagination-custom__bullet',
		// 	lockClass: 'disable'
		// },
		scrollbar: { // добавляет скроллбар
			el: '.content__block:has([data-swiper-id="example"]) .slider-scrollbar', // класс скроллбара (нужно добавить блок с этим классом в слайдер)
			dragClass: 'slider-scrollbar__drag',
			draggable: true
		},
		slideActiveClass: 'current-slide' // класс активного слайда
	});

	//Код для переключения активного пункта пагинации для кастомной пагинации==========
	const customBullets = document.querySelectorAll('.content__block:has([data-swiper-id="example"]) .slider-pagination-custom__bullet');
	if (customBullets.length) {
		exampleSlider.on('slideChange', function () {
			customBullets.forEach(el => el.classList.remove('active'));
			customBullets[exampleSlider.realIndex]?.classList.add('active');
		});
	}
	////Код для переключения активного пункта пагинации для кастомной пагинации==========
};
