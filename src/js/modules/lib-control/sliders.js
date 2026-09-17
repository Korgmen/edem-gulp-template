import { init as prepareSliders } from '../func/initSliders.js';

// Слайдеры [readme 4.1]
export const init = (root = document) => {
	// Swiper падает без готовой обёртки .swiper-wrapper, поэтому разметка строится до его вызова
	prepareSliders(root);
};
