/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

module.exports = function repeat(str, count) {
  if (typeof str !== 'string') {
    throw new TypeError('repeat-string expects a string.');
  }

  if (count < 1) {
    return '';
  }

  var result = '';
  while (count > 0) {
    if (count & 1) {
      result += str;
    }
    count >>= 1;
    str += str;
  }
  return result;
};
