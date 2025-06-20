//Функция смены класса у элемента==========
export default (element, className, add) => {
	element.classList[add ? 'add' : 'remove'](className);
}
////Функция смены класса у элемента==========