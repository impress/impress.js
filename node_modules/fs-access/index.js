'use strict';
var fs = require('fs');
var nullCheck = require('null-check');

var access = module.exports = function (pth, mode, cb) {
	if (typeof pth !== 'string') {
		throw new TypeError('path must be a string');
	}

	if (typeof mode === 'function') {
		cb = mode;
		mode = access.F_OK;
	} else if (typeof cb !== 'function') {
		throw new TypeError('callback must be a function');
	}

	if (!nullCheck(pth, cb)) {
		return;
	}

	mode = mode | 0;

	if (mode === access.F_OK) {
		fs.stat(pth, cb);
	}
};

access.sync = function (pth, mode) {
	nullCheck(pth);

	mode = mode === undefined ? access.F_OK : mode | 0;

	if (mode === access.F_OK) {
		fs.statSync(pth);
	}
};

access.F_OK = 0;
access.R_OK = 4;
access.W_OK = 2;
access.X_OK = 1;
