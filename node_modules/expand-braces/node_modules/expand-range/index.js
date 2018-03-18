/*!
 * expand-range <https://github.com/jonschlinkert/expand-range>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var isNumber = require('is-number');
var repeat = require('repeat-string');

module.exports = function expandRange(str, fn) {
  var match = str.split('..');
  if (match == null) {
    return str;
  }

  var m1 = match[0];
  var m2 = match[1];

  var number = isNumber(parseInt(m1));

  var a = coerce(m1);
  var b = coerce(m2);

  if (typeof fn === 'function') {
    return range(a, b, fn);
  } else if (number === false) {
    return range(a, b, 'alpha');
  } else if (a.length === b.length) {
    return range(a, b, m2.length);
  }

  return range(a, b);
};

function range(start, stop, special) {
  var len = String(stop).length;
  var arr = [], i = start - 1, idx = 0;

  while (i++ < stop) {
    if (typeof special === 'function') {
      arr.push(special(String.fromCharCode(i), i, idx++));
    } else if (typeof special === 'number') {
      arr.push(pad(i, special));
    } else if (special === 'alpha') {
      arr.push(String.fromCharCode(i));
    } else {
      arr.push(String(i));
    }
  }

  return arr;
}

function coerce(val) {
  var ch = parseInt(val, 10); /* 01 || Aa */
  return val == ch ? ch : val.charCodeAt(0);
}

function pad(val, longest) {
  var diff = longest - String(val).length;
  return repeat('0', diff) + val;
}
