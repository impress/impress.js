/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var isNumber = require('./');


var shouldPass = [  0,
  5e3,
  -1.1,
  0,

  // 012, Octal literal not allowed in strict mode
  parseInt('012'),
  parseFloat('012'),
  0xff,
  1,
  1.1,
  10,
  10.10,
  100,

  Math.abs(1),
  Math.acos(1),
  Math.asin(1),
  Math.atan(1),
  Math.atan2(1, 2),
  Math.ceil(1),
  Math.cos(1),
  Math.E,
  Math.exp(1),
  Math.floor(1),
  Math.LN10,
  Math.LN2,
  Math.log(1),
  Math.LOG10E,
  Math.LOG2E,
  Math.max(1, 2),
  Math.min(1, 2),
  Math.PI,
  Math.pow(1, 2),
  Math.pow(5, 5),
  Math.random(1),
  Math.round(1),
  Math.sin(1),
  Math.sqrt(1),
  Math.SQRT1_2,
  Math.SQRT2,
  Math.tan(1),

  Number.MAX_VALUE,
  Number.MIN_VALUE,

  // these fail in strict mode
  '-1.1',
  '0',
  '012',
  '0xff',
  '1',
  '1.1',
  '10',
  '10.10',
  '100',
  '5e3'
];

var shouldFail = [
  '3abc',
  'abc',
  'abc3',
  'null',
  'undefined',
  [1, 2, 3],
  function () {},
  new Buffer('abc'),
  null,
  undefined,
  {abc: 'abc'},
  {},
  []
];


describe('is a number', function () {
  shouldPass.forEach(function (num) {
    it('"' + num + '" should be a number', function () {
      assert.equal(isNumber(num), true);
    });
  });

  assert.equal(isNumber(Infinity), true);
  assert.equal(isNumber('Infinity'), true);
});


describe('is a finite number:', function () {
  function isNum(val) {
    return isNumber(val) && isFinite(val);
  }

  assert.equal(isNum(Infinity), false);
  assert.equal(isNum('Infinity'), false);

  shouldPass.forEach(function (num) {
    it('"' + num + '" should be a number', function () {
      assert.equal(isNum(num), true);
    });
  });

  shouldFail.forEach(function (num) {
    it('"' + num + '" should be a number', function () {
      assert.equal(isNum(num), false);
    });
  });
});


describe('is not a number', function () {
  shouldFail.forEach(function (num) {
    it('"' + num + '" should not be a number', function () {
      assert.equal(isNumber(num), false);
    });
  });
});