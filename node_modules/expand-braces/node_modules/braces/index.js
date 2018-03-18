/*!
 * braces <https://github.com/jonschlinkert/braces>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Module dependencies
 */

var expand = require('expand-range');

/**
 * Expose `braces`
 */

module.exports = function (str, fn) {
  return braces(str, fn);
};

/**
 * Expand `{foo,bar}` or `{1..5}` braces in the
 * give `string`.
 *
 * @param  {String} `str`
 * @param  {Array} `arr`
 * @return {Array}
 */

function braces(str, arr, fn) {
  var match = regex().exec(str);
  if (match == null) {
    return [str];
  }

  if (typeof str !== 'string') {
    throw new Error('braces expects a string');
  }

  if (typeof arr === 'function') {
    fn = arr;
    arr = [];
  }

  arr = arr || [];
  var paths;

  if (/\.{2}/.test(match[2])) {
    paths = expand(match[2], fn);
  } else {
    paths = match[2].split(',');
  }

  var len = paths.length;
  var i = 0, val, idx;

  while (len--) {
    val = splice(str, match[1], paths[i++]);
    idx = val.indexOf('{');

    if (idx !== -1) {
      if (val.indexOf('}', idx + 2) === -1) {
        var msg = '[brace expansion] imbalanced brace in: ';
        throw new Error(msg + str);
      }
      arr = braces(val, arr);
    } else if (arr.indexOf(val) === -1) {
      arr.push(val);
    }
  }

  return arr;
}

/**
 * Braces regex.
 */

function regex() {
  return /.*(\{([^\\}]*)\})/g;
}

/**
 * Faster alternative to `String.replace()`
 */

function splice(str, token, replacement) {
  var i = str.indexOf(token);
  var end = i + token.length;
  return str.substr(0, i)
    + replacement
    + str.substr(end, str.length);
}
