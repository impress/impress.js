var test = require('tape').test;
var exeq = require('..');

test('kill process 1', function(t) {

  // Keep the origin promise instance
  var proc = exeq([
    'echo 1',
    'sleep 10',
    'echo 2'
  ]);

  proc.catch(function(err) {
    t.equal(err.stderr, '1\nProcess has been killed.');
  }).finally(function(){
    t.end();
  });

  setTimeout(function(){
    proc.q.kill();
  }, 300);

});

test('kill process 2', function(t) {

  var proc = exeq([
    'sleep 10',
    'echo 1',
    'echo 2'
  ]);

  proc.catch(function(err) {
    t.equal(err.errno, 'SIGTERM');
    t.equal(err.stderr, 'Process has been killed.');
  }).finally(function(){
    t.end();
  });

  setTimeout(function(){
    proc.q.kill();
  }, 300);

});
