var assert = require('assert');
var voidElements = require('../');
assert(!voidElements.span, '<span> is not a void element');
assert(voidElements.img, '<img> is a void element');
console.log('tests passed');
