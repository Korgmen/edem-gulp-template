//Функция проверки существования элемента в DOM==========
export default (selector, parent = document) => {
	const element = parent.querySelector(selector);
	if (!element) throw new Error(`Элемент ${selector} не найден в родителе ${parent}`);
	return element;
};
////Функция проверки существования элемента в DOM==========