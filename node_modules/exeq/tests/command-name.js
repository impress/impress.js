var test = require('tape').test;
var exeq = require('..');

test('command name', function(t) {
  exeq(
    [
      'ls -l',
      'cd ..'
    ],
    'ps'
  ).then(function(results) {
    t.equal(results[0].cmd, 'ls -l');
    t.equal(results[1].cmd, 'cd ..');
    t.equal(results[2].cmd, 'ps');
    t.end();
  });
});
