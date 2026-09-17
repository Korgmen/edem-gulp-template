import setState from '../utils/setState.js';

//Блокировка страницы [readme 1.1]==========
export default (condition, base, object) => {
	const body = document.body;

	if (condition == 'lock') {
		setState(body, 'lock', true);
		if (object) setState(body, `lock-${object}`, true);
		if (base == false) setState(body, 'lock-clear', true);
	} else if (condition == 'unlock') {
		(body.dataset.state || '')
			.split(/\s+/)
			.filter((name) => name === 'lock' || name.startsWith('lock-'))
			.forEach((name) => setState(body, name, false));
	}
};
////Блокировка страницы [readme 1.1]==========
