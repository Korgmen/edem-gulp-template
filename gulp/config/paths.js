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
		generatedIndexDirs: ['src/scss/components', 'src/scss/layout'],
		dest: 'build/css',
	},
	js: {
		entry: 'src/js/main.js',
		watch: 'src/js/**/*.js',
		dest: 'build/js',
	},
	img: {
		base: 'src/img',
		src: 'src/img/**/*.{png,jpg,jpeg,gif,svg}',
		icons: 'src/img/icons/**/*.svg',
		dest: 'build/img',
	},
	svg: {
		src: 'src/img/icons/**/*.svg',
		dest: 'build',
	},
	fonts: {
		src: 'src/fonts/*.ttf',
		watch: 'src/fonts/**/*.*',
		dest: 'build/fonts',
	},
	root: {
		base: 'src/root',
		src: 'src/root/**/*.*',
		dest: 'build',
	},
};
