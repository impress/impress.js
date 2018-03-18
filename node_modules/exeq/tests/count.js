var test = require('tape').test;
var exeq = require('..');

test('command count', function(t) {

  exeq(
    'cd /usr/bin',
    'cd ..',
    'cd /usr/bin'
  ).then(function(results) {
    t.equal(results.length, 3);
    return exeq();
  }).then(function(results) {
    t.equal(results.length, 0);
    t.end();
  });

});
