'use strict';

var chai = require('chai');
var expect = chai.expect;

var Parser = require('../lib/Parser.js');
var Legacy = require('../lib/legacy/index.js');
var transform = require('../lib/TransformForLegacy.js');


var VALID_SYNTAX_SETS = [
  'TypeName',
  'undefined',
  'null',
  'void',
  '$',
  '_',
  '*',
  '?',
  'unknown',
  'Unknown',
  'module:path/to/file.js',
  'owner.Member',
  'owner . Member',
  'superOwner.owner.Member',
  'LeftType|RightType',
  'LeftType|MiddleType|RightType',
  '(LeftType|RightType)',
  '( LeftType | RightType )',
  '...variadicType',
  '{}',
  '{key:ValueType}',
  '{keyOnly}',
  '{key1:ValueType1,key2:ValueType2}',
  '{key:ValueType,keyOnly}',
  '{ key1 : ValueType1 , key2 : ValueType2 }',
  'Generic<ParamType>',
  'Generic<Inner<ParamType>>',
  'Generic<ParamType1,ParamType2>',
  'Generic < ParamType1, ParamType2 >',
  'Generic.<ParamType>',
  'Generic.<ParamType1,ParamType2>',
  'Generic .< ParamType1 , ParamType2 >',
  'ParamType[]',
  'string=',
  'Object|undefined',
  'Object|void',
  '?string',
  'string|null',
  '?string=',
  '...!Object',
  '!Object',
  'Object|unknown',
  'Object|Unknown',
  'function()',
  'function(Param)',
  'function(Param1,Param2)',
  'function():Returned',
  'function(this:ThisObject)',
  'function(new:NewObject)',
  'function( Param1 , Param2 ) : Returned',
];


describe('TransformForLegacy', function() {
  VALID_SYNTAX_SETS.forEach(function(validTypeExpr) {
    it('should return a result is equivalent to the old parser when "' +
      validTypeExpr + '" arrived', function() {

        var origin = parse(validTypeExpr);
        var legacy = legacyParse(validTypeExpr);

        setDebugInfo(this.test, origin, legacy);

        var convertedLegacy = transform(origin);

        expect(convertedLegacy).to.deep.equal(legacy);
      });
  });


  afterEach(function() {
    if (this.currentTest.state === 'passed') return;
    console.log('ORIGIN:');
    console.log(this.currentTest.debugInfo.origin);
    console.log('LEGACY:');
    console.log(this.currentTest.debugInfo.legacy);
  });
});


function setDebugInfo(test, origin, legacy) {
  test.debugInfo = {
    origin: origin,
    legacy: legacy,
  };
}


function parse(typeExprStr) {
  return Parser.parse(typeExprStr);
}


function legacyParse(typeExprStr) {
  var legacyParser = new Legacy.Parser();
  var legacyResult = legacyParser.parse(typeExprStr);

  return legacyResult;
}
