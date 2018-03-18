'use strict';

/**
 * brace-expansion
 */

var expand = require('brace-expansion');

module.exports = function (str) {
  return expand('{' + str + '}');
};