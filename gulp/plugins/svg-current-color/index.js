const BLACK = /^(black|#000|#000000|rgb\(\s*0\s*,\s*0\s*,\s*0\s*\))$/i;

export default {
	name: 'svgCurrentColor',
	type: 'visitor',
	fn: () => ({
		element: {
			enter: (node) => {
				for (const attr of ['fill', 'stroke']) {
					if (BLACK.test(node.attributes[attr] ?? '')) node.attributes[attr] = 'currentColor';
				}
			},
		},
	}),
};
