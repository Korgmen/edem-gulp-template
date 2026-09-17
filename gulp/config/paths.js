export const paths = {
	build: 'build',
	html: {
		src: 'src/html/**/*.html',
		chunks: 'src/html/chunks/**/*.html',
		drafts: 'src/html/**/_*.html',
		dest: 'build',
	},
	scss: {
		entry: 'src/scss/main.scss',
		watch: 'src/scss/**/*.scss',
		generatedIndexDirs: ['src/scss/components', 'src/scss/layout', 'src/scss/_example'],
		dest: 'build/css',
	},
	js: {
		entry: 'src/js/main.js',
		watch: 'src/js/**/*.js',
		dest: 'build/js',
	},
	img: {
		base: 'src/img',
		src: 'src/img/**/*.*',
		icons: 'src/img/icons/**/*.svg',
		dest: 'build/img',
	},
	svg: {
		src: 'src/img/icons/**/*.svg',
		dest: 'build',
	},
	fonts: {
		base: 'src/fonts',
		ttf: 'src/fonts/*.ttf',
		woff2: 'src/fonts/*.woff2',
		watch: 'src/fonts/**/*.*',
		cache: '.cache/fonts',
		dest: 'build/fonts',
	},
	root: {
		base: 'src/root',
		src: 'src/root/**/*.*',
		dest: 'build',
	},
	demo: {
		html: 'src/html/_demo/**',
	},
	example: {
		html: 'src/html/_example/**',
		scss: 'src/scss/example.scss',
		js: 'src/js/example.js',
		img: 'src/img/_example/**',
	},
};
