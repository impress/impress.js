'use strict';

var parser = require('../peg_lib/jsdoctype.js');

module.exports = {
  SyntaxError: parser.SyntaxError,
  parse: parser.parse,
};
