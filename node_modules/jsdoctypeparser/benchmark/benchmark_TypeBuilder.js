// This script licensed under the MIT.
// http://orgachem.mit-license.org


var Benchmark = require('benchmark');
var jsdoctypebuilder = require('../lib');
var TypeBuilder = jsdoctypebuilder.Builder;

var suite = new Benchmark.Suite();
var util = require('../lib/util');

var builder = new TypeBuilder();


suite
    .add('Primitive type', function() {
      builder.setTypeString('boolean');
      builder.build();
    })
    .add('Global Object', function() {
      builder.setTypeString('Window');
      builder.build();
    })
    .add('User Object', function() {
      builder.setTypeString('goog.ui.Menu');
      builder.build();
    })
    .add('Generics with a parameter', function() {
      builder.setTypeString('Array.<string>');
      builder.build();
    })
    .add('Generics with two parameters', function() {
      builder.setTypeString('Object.<string, number>');
      builder.build();
    })
    .add('Generics in Jsdoc style', function() {
      builder.setTypeString('String[]');
      builder.build();
    })
    .add('Formal type union', function() {
      builder.setTypeString('(number|boolean)');
      builder.build();
    })
    .add('Informal type union', function() {
      builder.setTypeString('number|boolean');
      builder.build();
    })
    .add('Record type', function() {
      builder.setTypeString('{myNum: number, myObject}');
      builder.build();
    })
    .add('Record type in generics', function() {
      builder.setTypeString('Array.<{length}>');
      builder.build();
    })
    .add('NUllable type', function() {
      builder.setTypeString('?number');
      builder.build();
    })
    .add('Nullable on a tail', function() {
      builder.setTypeString('goog.ui.Component?');
      builder.build();
    })
    .add('Non nullable type', function() {
      builder.setTypeString('!Object');
      builder.build();
    })
    .add('Non nullable type on a tail', function() {
      builder.setTypeString('Object!');
      builder.build();
    })
    .add('Function type', function() {
      builder.setTypeString('Function');
      builder.build();
    })
    .add('Function type with no parameter', function() {
      builder.setTypeString('function()');
      builder.build();
    })
    .add('Function type with a parameter', function() {
      builder.setTypeString('function(string)');
      builder.build();
    })
    .add('Function type with two parameters', function() {
      builder.setTypeString('function(string, boolean)');
      builder.build();
    })
    .add('Function type with a return', function() {
      builder.setTypeString('function(): number');
      builder.build();
    })
    .add('Function type with a context type', function() {
      builder.setTypeString('function(this:goog.ui.Menu, string)');
      builder.build();
    })
    .add('Function type as a constructor', function() {
      builder.setTypeString('function(new:goog.ui.Menu, string)');
      builder.build();
    })
    .add('Function type with variable parameters', function() {
      builder.setTypeString('function(string, ...[number]): number');
      builder.build();
    })
    .add('Function type with nullable or optional parameters', function() {
      builder.setTypeString('function(?string=, number=)');
      builder.build();
    })
    .add('Function type as goog.ui.Component#forEachChild', function() {
      builder.setTypeString('function(this:T,?,number):?');
      builder.build();
    })
    .add('Variable type', function() {
      builder.setTypeString('...number');
      builder.build();
    })
    .add('Optional type', function() {
      builder.setTypeString('number=');
      builder.build();
    })
    .add('All type', function() {
      builder.setTypeString('*');
      builder.build();
    })
    .add('Unknown type', function() {
      builder.setTypeString('?');
      builder.build();
    })
    .add('Unknown type with a keyword', function() {
      builder.setTypeString('unknown');
      builder.build();
    })
    .add('Optional type with a "undefined" keyword', function() {
      builder.setTypeString('Object|undefined');
      builder.build();
    })
    .add('Optional type with a "void" keyword', function() {
      builder.setTypeString('Object|void');
      builder.build();
    })
    .on('complete', function() {
      var elapsed = 0;
      for (var i = 0, l = this.length, benchmark; i < l; ++i) {
          benchmark = this[i];
          var name = benchmark.name;
          var whites = util.repeat(' ', 55 - name.length);

          console.log(name + whites + ': ' + (benchmark.times.period * 1000) + ' msec');
          elapsed += benchmark.times.elapsed;
      }
      console.log('Complete (' + benchmark.times.elapsed + ' sec)');
    })
    .run({ 'async': true });
