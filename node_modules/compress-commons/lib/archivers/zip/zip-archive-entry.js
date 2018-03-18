/**
 * node-compress-commons
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-compress-commons/blob/master/LICENSE-MIT
 */
var inherits = require('util').inherits;

var ArchiveEntry = require('../archive-entry');
var GeneralPurposeBit = require('./general-purpose-bit');

var constants = require('./constants');
var zipUtil = require('./util');

var ZipArchiveEntry = module.exports = function(name) {
  if (!(this instanceof ZipArchiveEntry)) {
    return new ZipArchiveEntry(name);
  }

  ArchiveEntry.call(this);

  this.platform = constants.PLATFORM_FAT;
  this.method = -1;

  this.name = null;
  this.size = -1;
  this.csize = -1;
  this.gpb = new GeneralPurposeBit();
  this.crc = 0;
  this.time = -1;

  this.minver = constants.MIN_VERSION_INITIAL;
  this.mode = -1;
  this.extra = null;
  this.exattr = 0;
  this.inattr = 0;
  this.comment = null;

  if (name) {
    this.setName(name);
  }
};

inherits(ZipArchiveEntry, ArchiveEntry);

ZipArchiveEntry.prototype.getCentralDirectoryExtra = function() {
  return this.getExtra();
};

ZipArchiveEntry.prototype.getComment = function() {
  return this.comment !== null ? this.comment : '';
};

ZipArchiveEntry.prototype.getCompressedSize = function() {
  return this.csize;
};

ZipArchiveEntry.prototype.getCrc = function() {
  return this.crc;
};

ZipArchiveEntry.prototype.getExternalAttributes = function() {
  return this.exattr;
};

ZipArchiveEntry.prototype.getExtra = function() {
  return this.extra !== null ? this.extra : constants.EMPTY;
};

ZipArchiveEntry.prototype.getGeneralPurposeBit = function() {
  return this.gpb;
};

ZipArchiveEntry.prototype.getInternalAttributes = function() {
  return this.inattr;
};

ZipArchiveEntry.prototype.getLastModifiedDate = function() {
  return this.getTime();
};

ZipArchiveEntry.prototype.getLocalFileDataExtra = function() {
  return this.getExtra();
};

ZipArchiveEntry.prototype.getMethod = function() {
  return this.method;
};

ZipArchiveEntry.prototype.getName = function() {
  return this.name;
};

ZipArchiveEntry.prototype.getPlatform = function() {
  return this.platform;
};

ZipArchiveEntry.prototype.getSize = function() {
  return this.size;
};

ZipArchiveEntry.prototype.getTime = function() {
  return this.time !== -1 ? zipUtil.dosToDate(this.time) : -1;
};

ZipArchiveEntry.prototype.getTimeDos = function() {
  return this.time !== -1 ? this.time : 0;
};

ZipArchiveEntry.prototype.getUnixMode = function() {
  return this.platform !== constants.PLATFORM_UNIX ? 0 : ((this.getExternalAttributes() >> constants.SHORT_SHIFT) & constants.SHORT_MASK) & constants.MODE_MASK;
};

ZipArchiveEntry.prototype.getVersionNeededToExtract = function() {
  return this.minver;
};

ZipArchiveEntry.prototype.setComment = function(comment) {
  if (Buffer.byteLength(comment) !== comment.length) {
    this.getGeneralPurposeBit().useUTF8ForNames(true);
  }

  this.comment = comment;
};

ZipArchiveEntry.prototype.setCompressedSize = function(size) {
  if (size < 0) {
    throw new Error('invalid entry compressed size');
  }

  this.csize = size;
};

ZipArchiveEntry.prototype.setCrc = function(crc) {
  if (crc < 0) {
    throw new Error('invalid entry crc32');
  }

  this.crc = crc;
};

ZipArchiveEntry.prototype.setExternalAttributes = function(attr) {
  this.exattr = attr >>> 0;
};

ZipArchiveEntry.prototype.setExtra = function(extra) {
  this.extra = extra;
};

ZipArchiveEntry.prototype.setGeneralPurposeBit = function(gpb) {
  if (!(gpb instanceof GeneralPurposeBit)) {
    throw new Error('invalid entry GeneralPurposeBit');
  }

  this.gpb = gpb;
};

ZipArchiveEntry.prototype.setInternalAttributes = function(attr) {
  this.inattr = attr;
};

ZipArchiveEntry.prototype.setMethod = function(method) {
  if (method < 0) {
    throw new Error('invalid entry compression method');
  }

  this.method = method;
};

ZipArchiveEntry.prototype.setName = function(name) {
  name = name.replace(/\\/g, '/').replace(/:/g, '').replace(/^\/+/, '');

  if (Buffer.byteLength(name) !== name.length) {
    this.getGeneralPurposeBit().useUTF8ForNames(true);
  }

  this.name = name;
};

ZipArchiveEntry.prototype.setPlatform = function(platform) {
  this.platform = platform;
};

ZipArchiveEntry.prototype.setSize = function(size) {
  if (size < 0) {
    throw new Error('invalid entry size');
  }

  this.size = size;
};

ZipArchiveEntry.prototype.setTime = function(time) {
  if (!(time instanceof Date)) {
    throw new Error('invalid entry time');
  }

  this.time = zipUtil.dateToDos(time);
};

ZipArchiveEntry.prototype.setUnixMode = function(mode) {
  mode &= ~constants.S_IFMT;
  mode |= this.isDirectory() ? constants.S_IFDIR : constants.S_IFREG;

  var extattr = 0;
  extattr |= (mode << constants.SHORT_SHIFT) | (this.isDirectory() ? constants.S_DOS_D : constants.S_DOS_A);

  this.setExternalAttributes(extattr);
  this.mode = mode & constants.MODE_MASK;
  this.platform = constants.PLATFORM_UNIX;
};

ZipArchiveEntry.prototype.setVersionNeededToExtract = function(minver) {
  this.minver = minver;
};

ZipArchiveEntry.prototype.isDirectory = function() {
  return this.getName().slice(-1) === '/';
};

ZipArchiveEntry.prototype.isZip64 = function() {
  return this.csize > constants.ZIP64_MAGIC || this.size > constants.ZIP64_MAGIC;
};