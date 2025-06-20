'use strict';
import PluginError from 'plugin-error';
import through from 'through2';
const PLUGIN_NAME = 'svg-remove-fill';

export default () => {
	return through.obj((file, enc, callback) => {

		if (file.isNull()) {
			callback(null, file);
			return;
		}
		if (file.isStream()) {
			callback(new PluginError('svg-remove-fill', 'Streaming not supported'));
			return;
		}
		(async () => {
			let content = file.contents.toString();

			content = content.replace(/ fill="black"/g, ' fill="currentColor"');
			content = content.replace(/ fill="none"/g, '');

			file.contents = Buffer.from(String(content));
			callback(null, file);
		})();
	});
};