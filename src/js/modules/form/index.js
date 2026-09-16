import * as telInput from './telInput.js';
import * as select from './select.js';
import * as numberInput from './numberInput.js';
import * as rangeInput from './rangeInput.js';
import * as dualRangeInput from './dualRangeInput.js';
import * as fileInput from './fileInput.js';

// Модули полей формы [readme 3]
export const init = (root = document) => {
	telInput.init(root);
	select.init(root);
	numberInput.init(root);
	rangeInput.init(root);
	dualRangeInput.init(root);
	fileInput.init(root);
};
