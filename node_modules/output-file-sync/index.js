/*!
 * output-file-sync | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/output-file-sync
*/
'use strict';

var dirname = require('path').dirname;
var writeFileSync = require('graceful-fs').writeFileSync;
var inspect = require('util').inspect;

var objectAssign = require('object-assign');
var mkdirpSync = require('mkdirp').sync;

module.exports = function outputFileSync(filePath, data, options) {
  if (typeof filePath !== 'string') {
    throw new TypeError(
      inspect(filePath) +
      ' is not a string. Expected a file path to write a file.'
    );
  }

  if (filePath === '') {
    throw new Error('Expected a file path to write a file, but received an empty string instead.');
  }

  options = options || {};

  var mkdirpOptions;
  if (typeof options === 'string') {
    mkdirpOptions = null;
  } else if (options.dirMode) {
    mkdirpOptions = objectAssign({}, options, {mode: options.dirMode});
  } else {
    mkdirpOptions = options;
  }

  var writeFileOptions;
  if (options.fileMode) {
    writeFileOptions = objectAssign({}, options, {mode: options.fileMode});
  } else {
    writeFileOptions = options;
  }

  var createdDirPath = mkdirpSync(dirname(filePath), mkdirpOptions);
  writeFileSync(filePath, data, writeFileOptions);
  return createdDirPath;
};
