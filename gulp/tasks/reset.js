import { deleteAsync } from 'del';
import { paths } from '../config/paths.js';

export const reset = () => {
	return deleteAsync(paths.build);
}