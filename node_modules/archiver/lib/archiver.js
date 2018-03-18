/**
 * node-archiver
 *
 * Copyright (c) 2012-2014 Chris Talkington, contributors.
 * Licensed under the MIT license.
 * https://github.com/archiverjs/node-archiver/blob/master/LICENSE-MIT
 */
var ArchiverCore = require('./core');
var formats = {};

var archiver = module.exports = function(format, options) {
  return archiver.create(format, options);
};

archiver.create = function(format, options) {
  if (formats[format]) {
    var instance = new ArchiverCore(options);
    instance.setFormat(format);
    instance.setModule(new formats[format](options));

    return instance;
  } else {
    throw new Error('create(' + format + '): format not registered');
  }
};

archiver.registerFormat = function(format, module) {
  if (formats[format]) {
    throw new Error('register(' + format + '): format already registered');
  }

  if (typeof module !== 'function') {
    throw new Error('register(' + format + '): format module invalid');
  }

  if (typeof module.prototype.append !== 'function' || typeof module.prototype.finalize !== 'function') {
    throw new Error('register(' + format + '): format module missing methods');
  }

  formats[format] = module;

  // backwards compat - to be removed in 0.14
  var compatName = 'create' + format.charAt(0).toUpperCase() + format.slice(1);
  archiver[compatName] = function(options) {
    return archiver.create(format, options);
  };
};

archiver.registerFormat('zip', require('./plugins/zip'));
archiver.registerFormat('tar', require('./plugins/tar'));
archiver.registerFormat('json', require('./plugins/json'));