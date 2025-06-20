//Блокировка страницы [readme 1.1]==========
export default (condition, base, object) => {
	const body = document.body;
	if (condition == 'lock') {
		body.classList.add('lock');
		if (object) body.classList.add(`lock--${object}`);
		if (base == false) body.classList.add('lock--clear');
	} else if (condition == 'unlock') {
		const noLockList = [...body.classList].filter(word => !word.includes('lock'));
		body.classList = '';
		body.classList.add(...noLockList);
	}
}
////Блокировка страницы [readme 1.1]==========