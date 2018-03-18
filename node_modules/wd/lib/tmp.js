// inspired by https://github.com/raszi/node-tmp, but only
// provides tmp paths.

var
  fs     = require('fs'),
  path   = require('path'),
  os     = require('os'),
  utils     = require('./utils');

function _isUndefined(obj) {
  return typeof obj === 'undefined';
}

function _parseArguments() {
  var fargs = utils.varargs(arguments);
  var callback = fargs.callback;
  var options = fargs.all[0];
  return [ options, callback ];
}

/**
 * Gets the temp directory.
 *
 * @return {String}
 * @api private
 */
function _getTMPDir() {
  var tmpNames = [ 'TMPDIR', 'TMP', 'TEMP' ];

  for (var i = 0, length = tmpNames.length; i < length; i++) {
    if (_isUndefined(process.env[tmpNames[i]])) { continue; }

    return process.env[tmpNames[i]];
  }

  // fallback to the default
  return '/tmp';
}

var
  exists = fs.exists || path.exists,
  tmpDir = os.tmpDir || _getTMPDir,
  _TMP = tmpDir(),
  randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
  randomCharsLength = randomChars.length;

/**
 * Gets a temporary file name.
 *
 * @param {Object} opts
 * @param {Function} cb
 * @api private
 */
function _getTmpName(options, callback) {
  var
    args = _parseArguments(options, callback),
    opts = args[0],
    cb = args[1],
    template = opts.template,
    templateDefined = !_isUndefined(template),
    tries = opts.tries || 3;

  if (isNaN(tries) || tries < 0)
    { return cb(new Error('Invalid tries')); }

  if (templateDefined && !template.match(/XXXXXX/))
    { return cb(new Error('Invalid template provided')); }

  function _getName() {

    // prefix and postfix
    if (!templateDefined) {
      var name = [
        (_isUndefined(opts.prefix)) ? 'tmp-' : opts.prefix,
        process.pid,
        (Math.random() * 0x1000000000).toString(36),
        opts.postfix
      ].join('');

      return path.join(opts.dir || _TMP, name);
    }

    // mkstemps like template
    var chars = [];

    for (var i = 0; i < 6; i++) {
      chars.push(randomChars.substr(Math.floor(Math.random() * randomCharsLength), 1));
    }

    return template.replace(/XXXXXX/, chars.join(''));
  }

  (function _getUniqueName() {
    var name = _getName();

    // check whether the path exists then retry if needed
    exists(name, function _pathExists(pathExists) {
      if (pathExists) {
        if (tries-- > 0) { return _getUniqueName(); }

        return cb(new Error('Could not get a unique tmp filename, max tries reached'));
      }

      cb(null, name);
    });
  }());
}

// exporting all the needed methods
module.exports.tmpdir = _TMP;
module.exports.tmpName = _getTmpName;
