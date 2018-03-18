var test = require('tape').test;
var exeq = require('..');
var fs = require('fs');
var path = require('path');

test('output file', function(t) {

  var n = -1;

  exeq(
    'ls > a.txt'
  ).then(function(results) {
    t.ok(fs.existsSync(path.resolve('a.txt')));
    t.ok(fs.readFileSync('a.txt').toString().indexOf('a.txt') >= 0);
    return exeq('rm a.txt');
  }).then(function() {
    t.notOk(fs.existsSync('a.txt'));
    t.end();
  });

});
