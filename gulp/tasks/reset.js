import {deleteAsync} from 'del';

export const reset = () => {
	return deleteAsync('./build');
}