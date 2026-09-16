import PhotoSwipeLightbox from 'photoswipe/lightbox';
import initOnce from '../utils/initOnce.js';
import { devWarn } from '../utils/devLog.js';

// Галереи изображений [readme 4.2]
// Ядро PhotoSwipe (около 50 КБ) подгружается только при первом открытии галереи
export const init = (root = document) => {
	initOnce(root, '[data-gallery]', 'galleries', gallery => {
		const links = gallery.querySelectorAll('a[href]');
		if (!links.length) return;

		if (__DEV__) {
			links.forEach(link => {
				if (!link.dataset.pswpWidth || !link.dataset.pswpHeight) {
					devWarn('galleries', 'у ссылки нет data-pswp-width и data-pswp-height — изображение откроется в неверном масштабе', link);
				}
			});
		}

		const lightbox = new PhotoSwipeLightbox({
			gallery,
			children: 'a[href]',
			pswpModule: () => import('photoswipe'),
		});

		lightbox.init();
	});
};
