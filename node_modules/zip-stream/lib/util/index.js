/**
 * node-zip-stream
 *
 * Copyright (c) 2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-zip-stream/blob/master/LICENSE-MIT
 */
var fs = require('fs');
var path = require('path');

var Stream = require('stream').Stream;
var PassThrough = require('readable-stream').PassThrough;

var _ = require('lodash');

var util = module.exports = {};

util.convertDateTimeDos = function(input) {
  return new Date(
    ((input >> 25) & 0x7f) + 1980,
    ((input >> 21) & 0x0f) - 1,
    (input >> 16) & 0x1f,
    (input >> 11) & 0x1f,
    (input >> 5) & 0x3f,
    (input & 0x1f) << 1
  );
};

util.dateify = function(dateish) {
  dateish = dateish || new Date();

  if (dateish instanceof Date) {
    dateish = dateish;
  } else if (typeof dateish === 'string') {
    dateish = new Date(dateish);
  } else {
    dateish = new Date();
  }

  return dateish;
};

// this is slightly different from lodash version
util.defaults = function(object, source, guard) {
  var args = arguments;
  args[0] = args[0] || {};

  return _.defaults.apply(_, args);
};

util.dosDateTime = function(d, utc) {
  d = (d instanceof Date) ? d : util.dateify(d);
  utc = utc || false;

  var year = utc ? d.getUTCFullYear() : d.getFullYear();

  if (year < 1980) {
    return 2162688; // 1980-1-1 00:00:00
  } else if (year >= 2044) {
    return 2141175677; // 2043-12-31 23:59:58
  }

  var val = {
    year: year,
    month: utc ? d.getUTCMonth() : d.getMonth(),
    date: utc ? d.getUTCDate() : d.getDate(),
    hours: utc ? d.getUTCHours() : d.getHours(),
    minutes: utc ? d.getUTCMinutes() : d.getMinutes(),
    seconds: utc ? d.getUTCSeconds() : d.getSeconds()
  };

  return ((val.year-1980) << 25) | ((val.month+1) << 21) | (val.date << 16) |
    (val.hours << 11) | (val.minutes << 5) | (val.seconds / 2);
};

util.isStream = function(source) {
  return source instanceof Stream;
};

util.normalizeInputSource = function(source) {
  if (source === null) {
    return new Buffer(0);
  } else if (typeof source === 'string') {
    return new Buffer(source);
  } else if (util.isStream(source) && !source._readableState) {
    var normalized = new PassThrough();
    source.pipe(normalized);

    return normalized;
  }

  return source;
};

util.sanitizePath = function() {
  var filepath = path.join.apply(path, arguments);
  return filepath.replace(/\\/g, '/').replace(/:/g, '').replace(/^\/+/, '');
};

util.unixifyPath = function() {
  var filepath = path.join.apply(path, arguments);
  return filepath.replace(/\\/g, '/');
};