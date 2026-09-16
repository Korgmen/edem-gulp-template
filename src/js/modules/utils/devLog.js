//Диагностика модулей==========
// __DEV__ подставляет esbuild, в прод-бандле условие и его тело вырезаются
export const devWarn = (module, message, element) => {
	if (__DEV__) console.warn(`[${module}] ${message}`, element ?? '');
};
////Диагностика модулей==========

//Получение обязательного элемента==========
// null вместо исключения: кривая разметка одного блока не должна ронять остальные
export const requireChild = (parent, selector, module) => {
	const element = parent.querySelector(selector);
	if (!element) devWarn(module, `не найден обязательный элемент "${selector}" — блок пропущен`, parent);
	return element;
};
////Получение обязательного элемента==========
