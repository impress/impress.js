'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var bufferUtil;

try {
  bufferUtil = require('bufferutil');
} catch (e) {
  bufferUtil = require('./BufferUtil.fallback');
}

module.exports = bufferUtil.BufferUtil || bufferUtil;
