import Plyr from 'plyr';

const plyrPlayers = Array.from(document.querySelectorAll('[data-plyr]')).map(pl => new Plyr(pl, { controls: ['play-large'] }));
plyrPlayers.forEach((pl, i) => {
	// фикс проблемы с невозможностью остановить видео на мобильных
	document.getElementsByClassName('plyr__poster')[i].addEventListener('click', (e) => {
		pl.togglePlay();
		e.stopPropagation();
	});
});