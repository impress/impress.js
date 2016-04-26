(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

describe('Core', function () {

  it('should fail', function () {
    expect(true).toBeTruthy();
  });
});

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.arrayify = arrayify;
// `arraify` takes an array-like object and turns it into real Array
// to make all the Array.prototype goodness available.
function arrayify(a) {
    return [].slice.call(a);
};

},{}],3:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

describe('Utils', function () {

  it('should convert arguments to array', function () {
    expect((0, _utils.arrayify)('foo', 'bar')).toEqual(['foo', 'bar']);
  });
});

},{"./utils":2}]},{},[1,3]);
