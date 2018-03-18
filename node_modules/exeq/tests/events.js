var test = require('tape').test;
var exeq = require('..');

test('event done', function(t) {

  // Keep the origin promise instance
  var proc = exeq([
    'echo 1',
    'echo 2'
  ]);

  var stdout = [];

  proc.q.on('stdout', function(data) {
    stdout.push(data);
  });

  proc.q.on('done', function() {
    t.equal(stdout.join(''), '1\n2\n');
    t.end();
  });

});

test('event fail', function(t) {

  var proc = exeq([
    'fail-me'
  ]);

  var stderr = [];

  proc.catch(function(){});

  proc.q.on('stderr', function(data) {
    stderr.push(data);
  });

  proc.q.on('failed', function() {
    t.ok(stderr.join('').indexOf('not found') > -1 );
    t.end();
  });
});

test('event killed', function(t) {
  var proc = exeq([
    'echo 1',
    'sleep 10',
    'echo 2'
  ]);

  var stdout = [];


  proc.q.on('stdout', function(data) {
    stdout.push(data);
  });

  proc.q.on('killed', function(data) {
    t.equal(stdout.join(''), '1\n');
    t.equal(data.stderr, '1\nProcess has been killed.');
    t.end();
  });

  proc.catch(function(){});

  setTimeout(function(){
    proc.q.kill();
  }, 600);
});
