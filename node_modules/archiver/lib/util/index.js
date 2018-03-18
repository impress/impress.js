/**
 * node-archiver
 *
 * Copyright (c) 2012-2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-archiver/blob/master/LICENSE-MIT
 */
var fs = require('fs');
var path = require('path');

var Stream = require('stream').Stream;
var PassThrough = require('readable-stream').PassThrough;

var util = module.exports = {};

util._ = require('lodash');
util.lazystream = require('lazystream');
util.file = require('./file');

util.collectStream = function(source, callback) {
  var collection = [];
  var size = 0;

  source.on('error', callback);

  source.on('data', function(chunk) {
    collection.push(chunk);
    size += chunk.length;
  });

  source.on('end', function() {
    var buf = new Buffer(size, 'utf8');
    var offset = 0;

    collection.forEach(function(data) {
      data.copy(buf, offset);
      offset += data.length;
    });

    callback(null, buf);
  });
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

  return util._.defaults.apply(util._, args);
};

util.isStream = function(source) {
  return source instanceof Stream;
};

util.lazyReadStream = function(filepath) {
  return new util.lazystream.Readable(function() {
    return fs.createReadStream(filepath);
  });
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
  return filepath.replace(/\\/g, '/').replace(/:/g, '').replace(/^(\.\.\/|\.\/|\/)+/, '');
};

util.trailingSlashIt = function(str) {
  return str.slice(-1) !== '/' ? str + '/' : str;
};

util.unixifyPath = function() {
  var filepath = path.join.apply(path, arguments);
  return filepath.replace(/\\/g, '/');
};

util.walkdir = function(dirpath, base, callback) {
  var results = [];

  if (typeof base === 'function') {
    callback = base;
    base = dirpath;
  }

  fs.readdir(dirpath, function(err, list) {
    var i = 0;
    var file;
    var filepath;

    if (err) {
      return callback(err);
    }

    (function next() {
      file = list[i++];

      if (!file) {
        return callback(null, results);
      }

      filepath = path.join(dirpath, file);

      fs.stat(filepath, function(err, stats) {
        results.push({
          path: filepath,
          relative: path.relative(base, filepath).replace(/\\/g, '/'),
          stats: stats
        });

        if (stats && stats.isDirectory()) {
          util.walkdir(filepath, base, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          next();
        }
      });
    })();
  });
};