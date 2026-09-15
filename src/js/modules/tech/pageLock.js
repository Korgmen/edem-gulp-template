//Блокировка страницы [readme 1.1]==========
export default (condition, base, object) => {
	const body = document.body;
	if (condition == 'lock') {
		body.classList.add('lock');
		if (object) body.classList.add(`lock--${object}`);
		if (base == false) body.classList.add('lock--clear');
	} else if (condition == 'unlock') {
		const lockClasses = [...body.classList].filter(name => name === 'lock' || name.startsWith('lock--'));
		body.classList.remove(...lockClasses);
	}
}
////Блокировка страницы [readme 1.1]==========