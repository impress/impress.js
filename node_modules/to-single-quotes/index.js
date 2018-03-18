'use strict';
module.exports = function (str) {
	return str.replace(/(?:\\*)?"([^"\\]*\\.)*[^"]*"/g, function (match) {
		return match
			// unescape double-quotes
			.replace(/([^\\]|^)\\"/g, '$1"')
			// escape escapes
			.replace(/(^|[^\\])(\\+)'/g, '$1$2\\\'')
			// escape single-quotes - round 1
			.replace(/([^\\])'/g, '$1\\\'')
			// escape single-quotes - round 2 (for consecutive single-quotes)
			.replace(/([^\\])'/g, '$1\\\'')
			// convert
			.replace(/^"|"$/g, '\'');
	});
};
