var test = require('tape').test;
var exeq = require('..');

test('stdout', function(t) {

  exeq(
    'echo 123',
    'echo "string"',
    'echo 456',
    'date'
  ).then(function(results) {
    t.equal(results[0].stdout.trim(), '123');
    t.equal(results[1].stdout.trim(), 'string');
    t.equal(results[2].stdout.trim(), '456');
    var date = new Date(results[3].stdout.trim());
    t.notEqual(date.toString(), 'Invalid Date');
    t.end();
  });

});


