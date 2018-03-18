'use strict';

var braces = require('./');

/**
 * Expand an array of strings with braces.
 *
 * ```js
 * expand(['{foo,bar}', '{baz,quux}']);
 * //=> [ 'foo', 'bar', 'baz', 'quux' ];
 * ```
 *
 * @param  {Array|String} `arr`
 * @return {Array}
 */

function expand1(arr) {
  arr = Array.isArray(arr) ? arr : [arr];

  return arr.reduce(function (acc, str) {
    return acc.concat(braces(str));
  }, [])
}

console.log(expand1(['{foo,bar}', '{baz,quux}', '{a,{a-{b,c}}}']));


// faster but less readable
function expand2(val) {
  val = Array.isArray(val) ? val : [val];
  var len = val.length;
  var arr = [];
  var i = 0;

  while (i < len) {
    arr = arr.concat(braces(val[i++]));
  }
  return arr;
}

console.log(expand2(['{foo,bar}', '{baz,quux}', '{a,{a-{b,c}}}']));
