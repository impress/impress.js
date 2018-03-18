/**
 * node-crc32-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-crc32-stream/blob/master/LICENSE-MIT
 */
var zlib = require('zlib');
var inherits = require('util').inherits;

var crc32 = require('buffer-crc32');

var DeflateCRC32Stream = module.exports = function (options) {
  zlib.DeflateRaw.call(this, options);

  this.checksum = new Buffer(4);
  this.checksum.writeInt32BE(0, 0);

  this.rawSize = 0;
  this.compressedSize = 0;

  // BC v0.8
  if (typeof zlib.DeflateRaw.prototype.push !== 'function') {
    this.on('data', function(chunk) {
      if (chunk) {
        this.compressedSize += chunk.length;
      }
    });
  }
};

inherits(DeflateCRC32Stream, zlib.DeflateRaw);

DeflateCRC32Stream.prototype.push = function(chunk, encoding) {
  if (chunk) {
    this.compressedSize += chunk.length;
  }

  return zlib.DeflateRaw.prototype.push.call(this, chunk, encoding);
};

DeflateCRC32Stream.prototype.write = function(chunk, enc, cb) {
  if (chunk) {
    this.checksum = crc32(chunk, this.checksum);
    this.rawSize += chunk.length;
  }

  return zlib.DeflateRaw.prototype.write.call(this, chunk, enc, cb);
};

DeflateCRC32Stream.prototype.digest = function() {
  return crc32.unsigned(0, this.checksum);
};

DeflateCRC32Stream.prototype.hex = function() {
  return this.digest().toString(16).toUpperCase();
};

DeflateCRC32Stream.prototype.size = function(compressed) {
  compressed = compressed || false;

  if (compressed) {
    return this.compressedSize;
  } else {
    return this.rawSize;
  }
};