var test = require('tape').test;
var exeq = require('..');
var isPromise = require('is-promise');

test('basic use', function(t) {

  t.equal(typeof exeq, 'function');
  t.equal(isPromise(exeq()), true);

  t.end();

});

