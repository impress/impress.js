// This script licensed under the MIT.
// http://orgachem.mit-license.org


var TypeBuilder = require('./TypeBuilder.js');



/**
 * A class for type expression parser.  This type parser can parse:
 * <dl>
 * <dt>Jsdoc type expressions</dt>
 * <dd>{@code 'foo.bar'},
 *     {@code 'String[]'}</dd>
 * <dt>Closure Compiler type expressions</dt>
 * <dd>{@code 'Array.&lt;string&gt;'},
 *     {@code 'function(this: Objext, arg1, arg2): ret'}</dd>
 * <dt>Nested type expressions</dt>
 * <dd>{@code 'Array.&lt;Array.&lt;string&gt;&gt;'},
 *     {@code 'function(function(Function))'}</dd>
 * </dl>
 *
 * For example:
 * <pre>
 * var parser = new TypeParser();
 * parser.parse('Array.&lt;string|number, ?Object=&gt;|string|undefined');
 * // ⇒ {
 * //   optional: true,
 * //   types: [
 * //     {
 * //       parameterTypeUnions: [
 * //         {
 * //           types: [
 * //             { name: 'string' },
 * //             { name: 'number' }
 * //           ]
 * //         },
 * //         {
 * //           nullable: true
 * //           optional: true
 * //           types: [
 * //             { name: 'Object' }
 * //           ]
 * //         }
 * //       ]
 * //     }, {
 * //       { name: 'string' }
 * //     }
 * //   ]
 * // }
 * </pre>
 * @constructor
 * @exports lib/TypeParser
 */
var TypeParser = function() {
  this.builder_ = new TypeBuilder();
};


/**
 * Type builder.
 * @type {module:lib/TypeBuilder}
 * @private
 */
TypeParser.prototype.builder_ = null;


/**
 * Parses a type expression.
 * @param {string} typeExp Type expression string to parse.
 * @return {module:lib/TypeBuilder.TypeUnion} Type union object.
 */
TypeParser.prototype.parse = function(typeExp) {
  var union;

  if (typeExp) {
    var builder = this.builder_;
    builder.setTypeString(typeExp);

    union = builder.build();
  }
  else {
    union = new TypeBuilder.TypeUnion();
    union.setUnknownType(true);
    return union;
  }

  return union;
};


// Exports the constructor.
module.exports = TypeParser;
