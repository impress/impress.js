var test = require('tape').test;
var exeq = require('..');

test('cd change cwd', function(t) {

  var tempDirName = '__temp-for-tests';

  exeq(
    'mkdir ' + tempDirName,
    'cd ' + tempDirName,
    'pwd',
    'cd ..',
    'pwd',
    'rm -rf ' + tempDirName
  ).then(function(results) {
    t.ok(results[2].stdout.indexOf(tempDirName) > -1);
    t.notOk(results[4].stdout.indexOf(tempDirName) > -1);
    t.end();
  });

});

