import fs from 'fs';
import * as esbuild from 'esbuild';
import browserslist from 'browserslist';
import { app } from '../config/app.js';
import { paths } from '../config/paths.js';

const ENGINES = { chrome: 'chrome', edge: 'edge', firefox: 'firefox', safari: 'safari', ios_saf: 'ios', opera: 'opera' };

// esbuild не читает browserslist сам: берём минимальную версию каждого поддерживаемого им движка
const getTargets = () => {
	const versions = {};
	for (const query of browserslist()) {
		const [name, range] = query.split(' ');
		const engine = ENGINES[name];
		const version = parseFloat(range);
		if (!engine || Number.isNaN(version)) continue;
		if (!versions[engine] || version < versions[engine]) versions[engine] = version;
	}
	return Object.entries(versions).map(([engine, version]) => `${engine}${version}`);
};

const options = () => ({
	entryPoints: [
		paths.js.entry,
		...(!app.isProd && fs.existsSync(paths.example.js) ? [paths.example.js] : []),
	],
	outdir: paths.js.dest,
	bundle: true,
	format: 'esm',
	splitting: true,
	chunkNames: 'chunks/[name]-[hash]',
	target: getTargets(),
	minify: app.isBuild,
	sourcemap: app.isDev ? 'linked' : false,
	// Флаг для веток диагностики в модулях: в прод-сборке esbuild вырезает их целиком
	define: { __DEV__: String(app.isDev) },
	logLevel: 'warning',
	logOverride: { 'equals-negative-zero': 'silent' },
});

export const js = async () => {
	try {
		await esbuild.build(options());
		app.plugins.browserSync.reload();
	} catch (err) {
		if (app.isBuild) throw err;
		app.plugins.notify.onError({ title: 'JS', message: 'Error: <%= error.message %>' })(err);
	}
};
