/*
	Состояние компонента живёт в атрибуте data-state, значения разделяются пробелом.
	В стилях состояние читается селектором [data-state~="fill"].
*/
export default (element, name, on) => {
	if (!element) return;

	const tokens = new Set((element.dataset.state || '').split(/\s+/).filter(Boolean));
	on ? tokens.add(name) : tokens.delete(name);

	const value = [...tokens].join(' ');
	if (value) element.dataset.state = value;
	else delete element.dataset.state;
};
