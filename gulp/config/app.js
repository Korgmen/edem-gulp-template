import gulp from 'gulp';
import { plugins } from './plugins.js';

try {
	process.loadEnvFile('.env');
} catch (err) {
	if (err.code !== 'ENOENT') throw err;
}

const argv = process.argv;
const isBuild = argv.includes('--build');

const ENVS = ['stage', 'prod'];
const env = argv.find(arg => arg.startsWith('--env='))?.split('=')[1] ?? (isBuild ? 'prod' : 'stage');
if (!ENVS.includes(env)) throw new Error(`Неизвестное окружение --env=${env}, допустимо: ${ENVS.join(', ')}`);

export const app = {
	isDev: !isBuild,
	isBuild: isBuild,
	isDeploy: argv.includes('--deploy'),
	env: env,
	isProd: env === 'prod',
	port: Number(process.env.SERVER_PORT) || 3000,
	gulp: gulp,
	plugins: plugins
};
