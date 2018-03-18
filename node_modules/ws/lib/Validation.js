'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var isValidUTF8;

try {
  isValidUTF8 = require('utf-8-validate');
} catch (e) {
  isValidUTF8 = require('./Validation.fallback');
}

module.exports = typeof isValidUTF8 === 'object'
  ? isValidUTF8.Validation.isValidUTF8
  : isValidUTF8;
