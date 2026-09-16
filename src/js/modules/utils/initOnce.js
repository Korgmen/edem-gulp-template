//Идемпотентная инициализация элементов==========
// WeakMap, а не data-атрибут: разметка остаётся чистой, а записи умирают вместе с узлами
const processed = new WeakMap();

export default (root, selector, name, callback) => {
	const scope = root ?? document;
	const nodes = scope instanceof Element && scope.matches(selector)
		? [scope, ...scope.querySelectorAll(selector)]
		: [...scope.querySelectorAll(selector)];

	for (const node of nodes) {
		let names = processed.get(node);
		if (!names) processed.set(node, names = new Set());
		if (names.has(name)) continue;

		names.add(name);
		callback(node);
	}

	return nodes.length;
};
////Идемпотентная инициализация элементов==========
