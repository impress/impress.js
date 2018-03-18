'use strict';
module.exports = function (str) {
	return str.replace(/(?:\\*)?'([^'\\]*\\.)*[^']*'/g, function (match) {
		return match
			// unescape single-quotes
			.replace(/\\'/g, '\'')
			// escape escapes
			.replace(/(^|[^\\])(\\+)"/g, '$1$2\\\"')
			// escape double-quotes
			.replace(/([^\\])"/g, '$1\\\"')
			// convert
			.replace(/^'|'$/g, '"');
	});
};
