/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */
var inherits = require('util').inherits;
var Transform = require('readable-stream').Transform;

var crc32 = require('buffer-crc32');

var CRC32Stream = module.exports = function CRC32Stream(options) {
  Transform.call(this, options);
  this.checksum = new Buffer(4);
  this.checksum.writeInt32BE(0, 0);

  this.rawSize = 0;
};

inherits(CRC32Stream, Transform);

CRC32Stream.prototype._transform = function(chunk, encoding, callback) {
  if (chunk) {
    this.checksum = crc32(chunk, this.checksum);
    this.rawSize += chunk.length;
  }

  callback(null, chunk);
};

CRC32Stream.prototype.digest = function() {
  return crc32.unsigned(0, this.checksum);
};

CRC32Stream.prototype.hex = function() {
  return this.digest().toString(16).toUpperCase();
};

CRC32Stream.prototype.size = function() {
  return this.rawSize;
};