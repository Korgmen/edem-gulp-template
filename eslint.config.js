import js from '@eslint/js';
import globals from 'globals';

export default [
	{ ignores: ['build/', 'src/js/libs/'] },
	js.configs.recommended,
	{
		rules: {
			'no-empty': ['error', { allowEmptyCatch: true }],
			// init(root) — общий контракт модулей, даже если модуль слушает весь документ
			'no-unused-vars': ['error', { argsIgnorePattern: '^root$' }],
		},
	},
	{
		files: ['src/js/**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				// Подставляется esbuild через define (gulp/tasks/js.js)
				__DEV__: 'readonly',
			},
		},
	},
	{
		files: ['gulp/**/*.js', '*.js'],
		languageOptions: { globals: globals.node },
	},
];
