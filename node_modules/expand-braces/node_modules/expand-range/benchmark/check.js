'use strict';

var path = require('path');
var glob = require('glob');

/**
 * Sanity check
 *
 * Run to ensure that all fns return the same result.
 */

var fixtures = glob.sync(__dirname + '/fixtures/*.*');

glob.sync(__dirname + '/libs/*.js').forEach(function (fp) {
  var fn = require(path.resolve(__dirname, 'libs', fp));

  fixtures.forEach(function (fixture) {
    console.log(fn.apply(null, require(fixture)));
  });
});
