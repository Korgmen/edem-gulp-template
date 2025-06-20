import { Fancybox } from '@fancyapps/ui';

// самая удобная настройка для галерей, скрывает все элементы управления, кроме закрывашки и листалок
Fancybox.bind('[data-fancybox]', {
	hideScrollbar: false,
	Toolbar: {
		display: {
			left: [],
			middle: [],
			right: ["close"],
		},
	}
});