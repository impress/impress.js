// This script licensed under the MIT.
// http://orgachem.mit-license.org


var Benchmark = require('benchmark');
var jsdoctypelexer = require('../lib');
var TypeLexer = jsdoctypelexer.Lexer;

var suite = new Benchmark.Suite();
var util = require('../lib/util');

var lexer = new TypeLexer();

suite
    .add('Primitive type', function() {
      lexer.analyze('boolean');
    })
    .add('Global Object', function() {
      lexer.analyze('Window');
    })
    .add('User Object', function() {
      lexer.analyze('goog.ui.Menu');
    })
    .add('Generics with a parameter', function() {
      lexer.analyze('Array.<string>');
    })
    .add('Generics with two parameters', function() {
      lexer.analyze('Object.<string, number>');
    })
    .add('Generics in Jsdoc style', function() {
      lexer.analyze('String[]');
    })
    .add('Formal type union', function() {
      lexer.analyze('(number|boolean)');
    })
    .add('Informal type union', function() {
      lexer.analyze('number|boolean');
    })
    .add('Record type', function() {
      lexer.analyze('{myNum: number, myObject}');
    })
    .add('Record type in generics', function() {
      lexer.analyze('Array.<{length}>');
    })
    .add('NUllable type', function() {
      lexer.analyze('?number');
    })
    .add('Nullable on a tail', function() {
      lexer.analyze('goog.ui.Component?');
    })
    .add('Non nullable type', function() {
      lexer.analyze('!Object');
    })
    .add('Non nullable type on a tail', function() {
      lexer.analyze('Object!');
    })
    .add('Function type', function() {
      lexer.analyze('Function');
    })
    .add('Function type with no parameter', function() {
      lexer.analyze('function()');
    })
    .add('Function type with a parameter', function() {
      lexer.analyze('function(string)');
    })
    .add('Function type with two parameters', function() {
      lexer.analyze('function(string, boolean)');
    })
    .add('Function type with a return', function() {
      lexer.analyze('function(): number');
    })
    .add('Function type with a context type', function() {
      lexer.analyze('function(this:goog.ui.Menu, string)');
    })
    .add('Function type as a constructor', function() {
      lexer.analyze('function(new:goog.ui.Menu, string)');
    })
    .add('Function type with variable parameters', function() {
      lexer.analyze('function(string, ...[number]): number');
    })
    .add('Function type with nullable or optional parameters', function() {
      lexer.analyze('function(?string=, number=)');
    })
    .add('Function type as goog.ui.Component#forEachChild', function() {
      lexer.analyze('function(this:T,?,number):?');
    })
    .add('Variable type', function() {
      lexer.analyze('...number');
    })
    .add('Optional type', function() {
      lexer.analyze('number=');
    })
    .add('All type', function() {
      lexer.analyze('*');
    })
    .add('Unknown type', function() {
      lexer.analyze('?');
    })
    .add('Unknown type with a keyword', function() {
      lexer.analyze('unknown');
    })
    .add('Optional type with a "undefined" keyword', function() {
      lexer.analyze('Object|undefined');
    })
    .add('Optional type with a "void" keyword', function() {
      lexer.analyze('Object|void');
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
