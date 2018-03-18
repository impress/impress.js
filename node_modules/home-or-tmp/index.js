'use strict';
var userHome = require('user-home');
var osTmpdir = require('os-tmpdir');

module.exports = userHome || osTmpdir();
