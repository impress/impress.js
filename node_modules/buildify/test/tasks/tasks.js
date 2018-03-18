/**
 * This script contains four buildify tasks:
 *
 * concat
 * minify (depends on concat)
 * test   (depends on concat and minify)
 * deploy (depends on test, and indirectly on concat and minify)
 *
 * The script will output a JSON array with the executed tasks.
 */
var buildify = require('../../index'),
    assert = require('assert');

var output = [];

buildify.task({
  name: 'minify',
  depends: ['concat'],
  task: function () {
    output.push('minify');
  }
});

buildify.task({
  name: 'concat',
  task: function () {
    output.push('concat');
  }
});

buildify.task({
  name: 'test',
  depends: ['concat', 'minify'],
  task: function () {
    output.push('test');
  }
});

buildify.task({
  name: 'deploy',
  depends: ['test'],
  task: function () {
    output.push('deploy');
  }
});

// output the list with executed tasks
process.nextTick(function () {
  process.nextTick(function () {
    console.log(JSON.stringify(output));
  });
});
