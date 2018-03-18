/*!
 * repeat-string <https://github.com/jonschlinkert/repeat-string>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var assert = require('assert');
var should = require('should');
var repeat = require('./');

describe('repeat', function () {
  it('should return an empty string when a number is not given:', function () {
    repeat('a').should.equal('');
  });

  it('should return an empty string when zero is given as the number:', function () {
    repeat('', 0).should.equal('');
    repeat('a', 0).should.equal('');
  });

  it('should return an empty string when null is given as the number:', function () {
    repeat('', null).should.equal('');
    repeat('a', null).should.equal('');
  });

  it('should throw an error when no string is given:', function () {
    (function() {repeat(10); }).should.throw('repeat-string expects a string.');
    (function() {repeat(null); }).should.throw('repeat-string expects a string.');
  });

  it('should repeat the given string n times', function () {
    repeat('a', 0).should.equal('');
    repeat('a', 1).should.equal('a');
    repeat('a', 2).should.equal('aa');
    repeat('a', 10).should.equal('aaaaaaaaaa');
    repeat('a ', 10).trim().should.equal('a a a a a a a a a a');
  });
});
