// This script licensed under the MIT.
// http://orgachem.mit-license.org
'use strict';


var Parser = require('../lib/index.js').Parser;
var Lexer = require('../lib/index.js').Lexer;
var expect = require('chai').expect;


describe('Parser', function() {
  it('Build a primitive type name', function() {
    var parser = new Parser();
    var union = parser.parse('boolean');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('boolean');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('boolean');
    expect(union.toHtml()).to.equal('<code>boolean</code>');
  });


  it('Build a global type name', function() {
    var parser = new Parser();
    var union = parser.parse('Window');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Window');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('Window');
    expect(union.toHtml()).to.equal('<code>Window</code>');
  });


  it('Build an user-defined type name', function() {
    var parser = new Parser();
    var union = parser.parse('goog.ui.Menu');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('goog.ui.Menu');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('goog.ui.Menu');
    expect(union.toHtml()).to.equal('<a href="goog.ui.Menu.html">goog.ui.Menu</a>');
  });


  it('Build a generic type has a parameter', function() {
    var parser = new Parser();
    var union = parser.parse('Array.<string>');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var generic = union.types[0];
    expect(generic.genericTypeName.name).to.equal('Array');
    expect(generic.parameterTypeUnions.length).to.equal(1);

    var paramUnion = generic.parameterTypeUnions[0];
    expect(paramUnion.types.length).to.equal(1);
    expect(paramUnion.types[0].name).to.equal('string');
    expect(paramUnion.optional).to.equal(false);
    expect(paramUnion.nullable).to.equal(false);
    expect(paramUnion.nonNullable).to.equal(false);
    expect(paramUnion.variable).to.equal(false);
    expect(paramUnion.all).to.equal(false);
    expect(paramUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('Array.<string>');
    expect(union.toHtml()).to.equal('<code>Array</code>.&lt;<code>string</code>&gt;');
  });


  it('Build a generic type has 2 parameters', function() {
    var parser = new Parser();
    var union = parser.parse('Object.<string, number>');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var generic = union.types[0];
    expect(generic.genericTypeName.name).to.equal('Object');
    expect(generic.parameterTypeUnions.length).to.equal(2);

    var paramUnion1 = generic.parameterTypeUnions[0];
    expect(paramUnion1.types.length).to.equal(1);
    expect(paramUnion1.types[0].name).to.equal('string');
    expect(paramUnion1.optional).to.equal(false);
    expect(paramUnion1.nullable).to.equal(false);
    expect(paramUnion1.nonNullable).to.equal(false);
    expect(paramUnion1.variable).to.equal(false);
    expect(paramUnion1.all).to.equal(false);
    expect(paramUnion1.unknown).to.equal(false);

    var paramUnion2 = generic.parameterTypeUnions[1];
    expect(paramUnion2.types.length).to.equal(1);
    expect(paramUnion2.types[0].name).to.equal('number');
    expect(paramUnion2.optional).to.equal(false);
    expect(paramUnion2.nullable).to.equal(false);
    expect(paramUnion2.nonNullable).to.equal(false);
    expect(paramUnion2.variable).to.equal(false);
    expect(paramUnion2.all).to.equal(false);
    expect(paramUnion2.unknown).to.equal(false);

    expect(union.toString()).to.equal('Object.<string, number>');
    expect(union.toHtml()).to.equal('<code>Object</code>.&lt;<code>string</code>' +
                 ', <code>number</code>&gt;');
  });


  it('Build a JsDoc-formal generic type', function() {
    var parser = new Parser();
    var union = parser.parse('String[]');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var generic = union.types[0];
    expect(generic.genericTypeName.name).to.equal('Array');
    expect(generic.parameterTypeUnions.length).to.equal(1);

    var paramUnion = generic.parameterTypeUnions[0];
    expect(paramUnion.types.length).to.equal(1);
    expect(paramUnion.types[0].name).to.equal('String');
    expect(paramUnion.optional).to.equal(false);
    expect(paramUnion.nullable).to.equal(false);
    expect(paramUnion.nonNullable).to.equal(false);
    expect(paramUnion.variable).to.equal(false);
    expect(paramUnion.all).to.equal(false);
    expect(paramUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('Array.<String>');
    expect(union.toHtml()).to.equal('<code>Array</code>.&lt;<code>String</code>&gt;');
  });


  it('Build a formal type union', function() {
    var parser = new Parser();
    var union = parser.parse('(number|boolean)');

    expect(union.types.length).to.equal(2);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.types[1].name).to.equal('boolean');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('number|boolean');
    expect(union.toHtml()).to.equal('<code>number</code>|<code>boolean</code>');
  });


  it('Build a informal type union', function() {
    var parser = new Parser();
    var union = parser.parse('number|boolean');

    expect(union.types.length).to.equal(2);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.types[1].name).to.equal('boolean');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('number|boolean');
    expect(union.toHtml()).to.equal('<code>number</code>|<code>boolean</code>');
  });


  it('Build a record type with an entry', function() {
    var parser = new Parser();
    var union = parser.parse('{myNum}');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var record = union.types[0];
    expect(record.entries.length).to.equal(1);

    var entry = record.entries[0];
    expect(entry.name).to.equal('myNum');

    var valUnion = entry.typeUnion;
    expect(valUnion.types.length).to.equal(0);
    expect(valUnion.optional).to.equal(false);
    expect(valUnion.nullable).to.equal(false);
    expect(valUnion.nonNullable).to.equal(false);
    expect(valUnion.variable).to.equal(false);
    expect(valUnion.all).to.equal(true);
    expect(valUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('{ myNum: * }');
    expect(union.toHtml()).to.equal('{ myNum: <code>*</code> }');
  });


  it('Build a record type with 2 entries', function() {
    var parser = new Parser();
    var union = parser.parse('{myNum: number, myObject}');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var record = union.types[0];
    expect(record.entries.length).to.equal(2);

    var entry1 = record.entries[0];
    expect(entry1.name).to.equal('myNum');

    var valUnion1 = entry1.typeUnion;
    expect(valUnion1.types.length).to.equal(1);
    expect(valUnion1.types[0].name).to.equal('number');
    expect(valUnion1.optional).to.equal(false);
    expect(valUnion1.nullable).to.equal(false);
    expect(valUnion1.nonNullable).to.equal(false);
    expect(valUnion1.variable).to.equal(false);
    expect(valUnion1.all).to.equal(false);
    expect(valUnion1.unknown).to.equal(false);

    var entry2 = record.entries[1];
    expect(entry2.name).to.equal('myObject');

    var valUnion2 = entry2.typeUnion;
    expect(valUnion2.types.length).to.equal(0);
    expect(valUnion2.optional).to.equal(false);
    expect(valUnion2.nullable).to.equal(false);
    expect(valUnion2.nonNullable).to.equal(false);
    expect(valUnion2.variable).to.equal(false);
    expect(valUnion2.all).to.equal(true);
    expect(valUnion2.unknown).to.equal(false);

    expect(union.toString()).to.equal('{ myNum: number, myObject: * }');
    expect(union.toHtml()).to.equal('{ myNum: <code>number</code>, myObject: <code>*</code> }');
  });


  it('Build a generic type has a parameter as a record type', function() {
    var parser = new Parser();
    var union = parser.parse('Array.<{length}>');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var generic = union.types[0];
    expect(generic.genericTypeName.name).to.equal('Array');

    expect(generic.parameterTypeUnions.length).to.equal(1);
    var valUnion = generic.parameterTypeUnions[0];
    expect(valUnion.types.length).to.equal(1);
    expect(valUnion.optional).to.equal(false);
    expect(valUnion.nullable).to.equal(false);
    expect(valUnion.nonNullable).to.equal(false);
    expect(valUnion.variable).to.equal(false);
    expect(valUnion.all).to.equal(false);
    expect(valUnion.unknown).to.equal(false);

    var record = valUnion.types[0];
    expect(record.entries.length).to.equal(1);

    var entry = record.entries[0];
    expect(entry.name).to.equal('length');

    valUnion = entry.typeUnion;
    expect(valUnion.types.length).to.equal(0);
    expect(valUnion.optional).to.equal(false);
    expect(valUnion.nullable).to.equal(false);
    expect(valUnion.nonNullable).to.equal(false);
    expect(valUnion.variable).to.equal(false);
    expect(valUnion.all).to.equal(true);
    expect(valUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('Array.<{ length: * }>');
    expect(union.toHtml()).to.equal('<code>Array</code>.&lt;{ length: <code>*</code> }&gt;');
  });


  it('Build a nullable type has a nullable type operator on the head', function() {
    var parser = new Parser();
    var union = parser.parse('?number');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(true);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('number|null');
    expect(union.toHtml()).to.equal('<code>number</code>|<code>null</code>');
  });


  it('Build a nullable type has a nullable type operator on the tail', function() {
    var parser = new Parser();
    var union = parser.parse('goog.ui.Component?');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('goog.ui.Component');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(true);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('goog.ui.Component|null');
    expect(union.toHtml()).to.equal('<a href="goog.ui.Component.html">' +
                 'goog.ui.Component</a>|<code>null</code>');
  });


  it('Build a non-nullable type has a nullable type operator on the head', function() {
    var parser = new Parser();
    var union = parser.parse('!Object');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Object');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(true);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('!Object');
    expect(union.toHtml()).to.equal('!<code>Object</code>');
  });


  it('Build a non-nullable type has a nullable type operator on the tail', function() {
    var parser = new Parser();
    var union = parser.parse('Object!');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Object');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(true);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('!Object');
    expect(union.toHtml()).to.equal('!<code>Object</code>');
  });


  it('Build a function type', function() {
    var parser = new Parser();
    var union = parser.parse('Function');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Function');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('Function');
    expect(union.toHtml()).to.equal('<code>Function</code>');
  });


  it('Build a function type has no parameters', function() {
    var parser = new Parser();
    var union = parser.parse('function()');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(0);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    expect(union.toString()).to.equal('function()');
    expect(union.toHtml()).to.equal('function()');
  });


  it('Build a function type has a parameter', function() {
    var parser = new Parser();
    var union = parser.parse('function(string)');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(1);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var paramUnion = func.parameterTypeUnions[0];
    expect(paramUnion.types.length).to.equal(1);
    expect(paramUnion.types[0].name).to.equal('string');
    expect(paramUnion.optional).to.equal(false);
    expect(paramUnion.nullable).to.equal(false);
    expect(paramUnion.nonNullable).to.equal(false);
    expect(paramUnion.variable).to.equal(false);
    expect(paramUnion.all).to.equal(false);
    expect(paramUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(string)');
    expect(union.toHtml()).to.equal('function(<code>string</code>)');
  });


  it('Build a function type has 2 parameters', function() {
    var parser = new Parser();
    var union = parser.parse('function(string, boolean)');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(2);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var paramUnion1 = func.parameterTypeUnions[0];
    expect(paramUnion1.types.length).to.equal(1);
    expect(paramUnion1.types[0].name).to.equal('string');
    expect(paramUnion1.optional).to.equal(false);
    expect(paramUnion1.nullable).to.equal(false);
    expect(paramUnion1.nonNullable).to.equal(false);
    expect(paramUnion1.variable).to.equal(false);
    expect(paramUnion1.all).to.equal(false);
    expect(paramUnion1.unknown).to.equal(false);

    var paramUnion2 = func.parameterTypeUnions[1];
    expect(paramUnion2.types.length).to.equal(1);
    expect(paramUnion2.types[0].name).to.equal('boolean');
    expect(paramUnion2.optional).to.equal(false);
    expect(paramUnion2.nullable).to.equal(false);
    expect(paramUnion2.nonNullable).to.equal(false);
    expect(paramUnion2.variable).to.equal(false);
    expect(paramUnion2.all).to.equal(false);
    expect(paramUnion2.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(string, boolean)');
    expect(union.toHtml()).to.equal('function(<code>string</code>, <code>boolean</code>)');
  });


  it('Build a function type has a return', function() {
    var parser = new Parser();
    var union = parser.parse('function(): number');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(0);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var returnUnion = func.returnTypeUnion;
    expect(returnUnion.types.length).to.equal(1);
    expect(returnUnion.types[0].name).to.equal('number');
    expect(returnUnion.optional).to.equal(false);
    expect(returnUnion.nullable).to.equal(false);
    expect(returnUnion.nonNullable).to.equal(false);
    expect(returnUnion.variable).to.equal(false);
    expect(returnUnion.all).to.equal(false);
    expect(returnUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(): number');
    expect(union.toHtml()).to.equal('function(): <code>number</code>');
  });


  it('Build a function type has a context', function() {
    var parser = new Parser();
    var union = parser.parse('function(this:goog.ui.Menu, string)');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(1);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var contextUnion = func.contextTypeUnion;
    expect(contextUnion.types.length).to.equal(1);
    expect(contextUnion.types[0].name).to.equal('goog.ui.Menu');
    expect(contextUnion.optional).to.equal(false);
    expect(contextUnion.nullable).to.equal(false);
    expect(contextUnion.nonNullable).to.equal(false);
    expect(contextUnion.variable).to.equal(false);
    expect(contextUnion.all).to.equal(false);
    expect(contextUnion.unknown).to.equal(false);

    var paramUnion = func.parameterTypeUnions[0];
    expect(paramUnion.types.length).to.equal(1);
    expect(paramUnion.types[0].name).to.equal('string');
    expect(paramUnion.optional).to.equal(false);
    expect(paramUnion.nullable).to.equal(false);
    expect(paramUnion.nonNullable).to.equal(false);
    expect(paramUnion.variable).to.equal(false);
    expect(paramUnion.all).to.equal(false);
    expect(paramUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(this:goog.ui.Menu, string)');
    expect(union.toHtml()).to.equal('function(this:<a href="goog.ui.Menu.html">' +
                 'goog.ui.Menu</a>, <code>string</code>)');
  });


  it('Build a constructor type', function() {
    var parser = new Parser();
    var union = parser.parse('function(new:goog.ui.Menu, string)');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(1);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(true);

    var contextUnion = func.contextTypeUnion;
    expect(contextUnion.types.length).to.equal(1);
    expect(contextUnion.types[0].name).to.equal('goog.ui.Menu');
    expect(contextUnion.optional).to.equal(false);
    expect(contextUnion.nullable).to.equal(false);
    expect(contextUnion.nonNullable).to.equal(false);
    expect(contextUnion.variable).to.equal(false);
    expect(contextUnion.all).to.equal(false);
    expect(contextUnion.unknown).to.equal(false);

    var paramUnion = func.parameterTypeUnions[0];
    expect(paramUnion.types.length).to.equal(1);
    expect(paramUnion.types[0].name).to.equal('string');
    expect(paramUnion.optional).to.equal(false);
    expect(paramUnion.nullable).to.equal(false);
    expect(paramUnion.nonNullable).to.equal(false);
    expect(paramUnion.variable).to.equal(false);
    expect(paramUnion.all).to.equal(false);
    expect(paramUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(new:goog.ui.Menu, string)');
    expect(union.toHtml()).to.equal('function(new:<a href="goog.ui.Menu.html">' +
                 'goog.ui.Menu</a>, <code>string</code>)');
  });


  it('Build a function type has a variable parameter', function() {
    var parser = new Parser();
    var union = parser.parse('function(string, ...number): number');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(2);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var paramUnion1 = func.parameterTypeUnions[0];
    expect(paramUnion1.types.length).to.equal(1);
    expect(paramUnion1.types[0].name).to.equal('string');
    expect(paramUnion1.optional).to.equal(false);
    expect(paramUnion1.nullable).to.equal(false);
    expect(paramUnion1.nonNullable).to.equal(false);
    expect(paramUnion1.variable).to.equal(false);
    expect(paramUnion1.all).to.equal(false);
    expect(paramUnion1.unknown).to.equal(false);

    var paramUnion2 = func.parameterTypeUnions[1];
    expect(paramUnion2.types.length).to.equal(1);
    expect(paramUnion2.types[0].name).to.equal('number');
    expect(paramUnion2.optional).to.equal(false);
    expect(paramUnion2.nullable).to.equal(false);
    expect(paramUnion2.nonNullable).to.equal(false);
    expect(paramUnion2.variable).to.equal(true);
    expect(paramUnion2.all).to.equal(false);
    expect(paramUnion2.unknown).to.equal(false);

    var returnUnion = func.returnTypeUnion;
    expect(returnUnion.types.length).to.equal(1);
    expect(returnUnion.types[0].name).to.equal('number');
    expect(returnUnion.optional).to.equal(false);
    expect(returnUnion.nullable).to.equal(false);
    expect(returnUnion.nonNullable).to.equal(false);
    expect(returnUnion.variable).to.equal(false);
    expect(returnUnion.all).to.equal(false);
    expect(returnUnion.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(string, ...number): number');
    expect(union.toHtml()).to.equal('function(<code>string</code>, ...<code>number' +
                 '</code>): <code>number</code>');
  });


  it('Build a function type has parameters have some type operators', function() {
    var parser = new Parser();
    var union = parser.parse('function(?string=, number=)');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(2);
    expect(func.returnTypeUnion).to.equal(null);
    expect(func.contextTypeUnion).to.equal(null);
    expect(func.isConstructor).to.equal(false);

    var paramUnion1 = func.parameterTypeUnions[0];
    expect(paramUnion1.types.length).to.equal(1);
    expect(paramUnion1.types[0].name).to.equal('string');
    expect(paramUnion1.optional).to.equal(true);
    expect(paramUnion1.nullable).to.equal(true);
    expect(paramUnion1.nonNullable).to.equal(false);
    expect(paramUnion1.variable).to.equal(false);
    expect(paramUnion1.all).to.equal(false);
    expect(paramUnion1.unknown).to.equal(false);

    var paramUnion2 = func.parameterTypeUnions[1];
    expect(paramUnion2.types.length).to.equal(1);
    expect(paramUnion2.types[0].name).to.equal('number');
    expect(paramUnion2.optional).to.equal(true);
    expect(paramUnion2.nullable).to.equal(false);
    expect(paramUnion2.nonNullable).to.equal(false);
    expect(paramUnion2.variable).to.equal(false);
    expect(paramUnion2.all).to.equal(false);
    expect(paramUnion2.unknown).to.equal(false);

    expect(union.toString()).to.equal('function(string|undefined|null, number|undefined)');
    expect(union.toHtml()).to.equal('function(<code>string</code>|<code>undefined' +
                 '</code>|<code>null</code>, <code>number</code>|<code>undefined</code>)');
  });


  it('Build a goog.ui.Component#forEachChild', function() {
    var parser = new Parser();
    var union = parser.parse('function(this:T,?,number):?');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    var func = union.types[0];
    expect(func.parameterTypeUnions.length).to.equal(2);
    expect(func.isConstructor).to.equal(false);

    var contextUnion = func.contextTypeUnion;
    expect(contextUnion.types.length).to.equal(1);
    expect(contextUnion.types[0].name).to.equal('T');
    expect(contextUnion.optional).to.equal(false);
    expect(contextUnion.nullable).to.equal(false);
    expect(contextUnion.nonNullable).to.equal(false);
    expect(contextUnion.variable).to.equal(false);
    expect(contextUnion.all).to.equal(false);
    expect(contextUnion.unknown).to.equal(false);

    var paramUnion1 = func.parameterTypeUnions[0];
    expect(paramUnion1.types.length).to.equal(0);
    expect(paramUnion1.optional).to.equal(false);
    expect(paramUnion1.nullable).to.equal(false);
    expect(paramUnion1.nonNullable).to.equal(false);
    expect(paramUnion1.variable).to.equal(false);
    expect(paramUnion1.all).to.equal(false);
    expect(paramUnion1.unknown).to.equal(true);

    var paramUnion2 = func.parameterTypeUnions[1];
    expect(paramUnion2.types.length).to.equal(1);
    expect(paramUnion2.types[0].name).to.equal('number');
    expect(paramUnion2.optional).to.equal(false);
    expect(paramUnion2.nullable).to.equal(false);
    expect(paramUnion2.nonNullable).to.equal(false);
    expect(paramUnion2.variable).to.equal(false);
    expect(paramUnion2.all).to.equal(false);
    expect(paramUnion2.unknown).to.equal(false);

    var returnUnion = func.returnTypeUnion;
    expect(returnUnion.types.length).to.equal(0);
    expect(returnUnion.optional).to.equal(false);
    expect(returnUnion.nullable).to.equal(false);
    expect(returnUnion.nonNullable).to.equal(false);
    expect(returnUnion.variable).to.equal(false);
    expect(returnUnion.all).to.equal(false);
    expect(returnUnion.unknown).to.equal(true);

    expect(union.toString()).to.equal('function(this:T, ?, number): ?');
    expect(union.toHtml()).to.equal('function(this:<a href="T.html">T</a>, ' +
                 '<code>?</code>, <code>number</code>): <code>?</code>');
  });


  it('Build a variable type', function() {
    var parser = new Parser();
    var union = parser.parse('...number');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(true);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('...number');
    expect(union.toHtml()).to.equal('...<code>number</code>');
  });


  it('Build an optional type has an optional type operator on the head', function() {
    var parser = new Parser();
    var union = parser.parse('=number');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(true);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('number|undefined');
    expect(union.toHtml()).to.equal('<code>number</code>|<code>undefined</code>');
  });


  it('Build an optional type has an optional type operator on the tail', function() {
    var parser = new Parser();
    var union = parser.parse('number=');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('number');
    expect(union.optional).to.equal(true);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('number|undefined');
    expect(union.toHtml()).to.equal('<code>number</code>|<code>undefined</code>');
  });


  it('Build an optional type with a "undefined" keyword', function() {
    var parser = new Parser();
    var union = parser.parse('Object|undefined');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Object');
    expect(union.optional).to.equal(true);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('Object|undefined');
    expect(union.toHtml()).to.equal('<code>Object</code>|<code>undefined</code>');
  });


  it('Build an optional type with a "void" keyword', function() {
    var parser = new Parser();
    var union = parser.parse('Object|void');

    expect(union.types.length).to.equal(1);
    expect(union.types[0].name).to.equal('Object');
    expect(union.optional).to.equal(true);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('Object|undefined');
    expect(union.toHtml()).to.equal('<code>Object</code>|<code>undefined</code>');
  });


  it('Build an all type', function() {
    var parser = new Parser();
    var union = parser.parse('*');

    expect(union.types.length).to.equal(0);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(true);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('*');
    expect(union.toHtml()).to.equal('<code>*</code>');
  });


  it('Build an unknown type', function() {
    var parser = new Parser();
    var union = parser.parse('?');

    expect(union.types.length).to.equal(0);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(true);

    expect(union.toString()).to.equal('?');
    expect(union.toHtml()).to.equal('<code>?</code>');
  });


  it('Build an unknown type with an "unknown" keyword', function() {
    var parser = new Parser();
    var union = parser.parse('unknown');

    expect(union.types.length).to.equal(0);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(true);

    expect(union.toString()).to.equal('?');
    expect(union.toHtml()).to.equal('<code>?</code>');
  });


  it('Build an undefined type with an "undefined" keyword', function() {
    var parser = new Parser();
    var union = parser.parse('undefined');

    expect(union.types.length).to.equal(0);
    expect(union.optional).to.equal(true);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('undefined');
    expect(union.toHtml()).to.equal('<code>undefined</code>');
  });


  it('Build a null type with an "null" keyword', function() {
    var parser = new Parser();
    var union = parser.parse('null');

    expect(union.types.length).to.equal(0);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(true);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('null');
    expect(union.toHtml()).to.equal('<code>null</code>');
  });


  it('Build a module type', function() {
    var parser = new Parser();
    var union = parser.parse('module:foo/bar');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('module:foo/bar');
    expect(union.toHtml()).to.equal('module:<a href="module%3Afoo%2Fbar.html">foo/bar</a>');
  });


  it('Build a module type with a prefix nullable type operator', function() {
    var parser = new Parser();
    var union = parser.parse('?module:foo/bar');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(true);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('module:foo/bar|null');
    expect(union.toHtml()).to.equal('module:<a href="module%3Afoo%2Fbar.html">' +
                 'foo/bar</a>|<code>null</code>');
  });


  it('Build a module type with a postfix nullable type operator', function() {
    var parser = new Parser();
    var union = parser.parse('module:foo/bar?');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(true);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('module:foo/bar|null');
    expect(union.toHtml()).to.equal('module:<a href="module%3Afoo%2Fbar.html">' +
                 'foo/bar</a>|<code>null</code>');
  });


  it('Build a module type with a generic type operator', function() {
    var parser = new Parser();
    // Because the new generic type syntax was arrived, the old type generic
    // with the module keyword is not equivalent to the legacy behavior.
    //
    // For example, we get 2 parts as 'module:foo/bar.' and '<string>', when
    // the following type expression are arrived.
    //   var union = parser.parse('module:foo/bar.<string>');
    var union = parser.parse('module:foo/bar<string>');

    expect(union.types.length).to.equal(1);
    expect(union.optional).to.equal(false);
    expect(union.nullable).to.equal(false);
    expect(union.nonNullable).to.equal(false);
    expect(union.variable).to.equal(false);
    expect(union.all).to.equal(false);
    expect(union.unknown).to.equal(false);

    expect(union.toString()).to.equal('module:foo/bar.<string>');
    expect(union.toHtml()).to.equal('module:<a href="module%3Afoo%2Fbar.html">' +
                 'foo/bar</a>.&lt;<code>string</code>&gt;');
  });


  it('Build an illegal generic type', function() {
    var parser = new Parser();

    expect(function() {
      parser.parse('Array.<a');
    }).to.throw(Lexer.SyntaxError);
  });


  it('Build an illegal function type', function() {
    var parser = new Parser();

    expect(function() {
      parser.parse('function(string:');
    }).to.throw(Lexer.SyntaxError);
  });


  it('Build an illegal type union', function() {
    var parser = new Parser();

    expect(function() {
      parser.parse('|string');
    }).to.throw(Lexer.SyntaxError);
  });
});
