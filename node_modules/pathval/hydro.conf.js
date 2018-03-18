/*!
 * Module dependencies.
 */

var props = require('./');
var assert = require('simple-assert');

/**
 * Test configurations.
 *
 * @param {Hydro} hydro
 * @api public
 */

module.exports = function(hydro) {
  hydro.set({
    suite: 'pathval',
    formatter: 'hydro-doc',
    globals: {
      assert: assert,
      set: props.set,
      get: props.get,
    },
    plugins: [
      'hydro-file-suite',
      'hydro-doc',
      'hydro-bdd',
    ],
    tests: [
      'test/*.js'
    ]
  });
};
