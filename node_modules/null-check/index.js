'use strict';
module.exports = function (pth, cb) {
	if (String(pth).indexOf('\u0000') !== -1) {
		var err = new Error('Path must be a string without null bytes.');
		err.code = 'ENOENT';

		if (typeof cb !== 'function') {
			throw err;
		}

		process.nextTick(function () {
			cb(err);
		});

		return false;
	}

	return true;
}
