// This script licensed under the MIT.
// http://orgachem.mit-license.org
'use strict';


var defineProp = Object.defineProperty;
var Lexer = require('./legacy/TypeLexer.js');


/**
 * Namespace for jsdoctypeparser.
 * @namespace
 * @exports jsdoctypeparser
 */
module.exports = {


  /**
   * An alias for type expression parsers.
   * @type {module:lib/legacy/TypeParser}
   * @see module:lib/legacy/TypeParser
   */
  get Parser() {
    var Parser = require('./Parser.js');
    var transform = require('./TransformForLegacy.js');

    /**
     * A class for type expression parser.  This type parser can parse:
     * @constructor
     * @exports lib/TypeParser
     */
    function ParserWithTransform() {}

    /**
     * Parses a type expression. This method use a new parser and transform
     * its result. Because the old parser has many bugs such as infinite
     * recursions and parsing confusions.
     * @param {string} typeExp Type expression string to parse.
     * @return {module:lib/TypeBuilder.TypeUnion} Type union object.
     */
    ParserWithTransform.prototype.parse = function(typeExp) {
      try {
        var ast = Parser.parse(typeExp);
        return transform(ast);
      }
      catch (e) {
        if (e instanceof transform.TransformationError) {
          var unknownType = transform(Parser.parse('unknown'));
          return unknownType;
        }

        if (e instanceof Parser.SyntaxError) {
          throw new Lexer.SyntaxError(e.message, typeExp, e.offset);
        }

        throw e;
      }
    };


    /**
     * A class for transform errors.
     * @param {string} msg Error message.
     * @constructor
     * @extends {Error}
     */
    ParserWithTransform.TransformationError = transform.TransformationError;

    defineProp(this, 'Parser', { value: ParserWithTransform });
    return this.Parser;
  },


  /**
   * An alias for type expression lexers.
   * @type {module:lib/legacy/TypeLexer}
   * @see module:lib/legacy/TypeLexer
   * @deprecated Do not use the module directly. This lexer has legacy
   *     implementation including infite recursions and lexing confusions.
   */
  get Lexer() {
    defineProp(this, 'Lexer', { value: Lexer });
    return this.Lexer;
  },


  /**
   * An alias for type expression object builders.
   * @type {module:lib/legacy/TypeBuilder}
   * @see module:lib/legacy/TypeBuilder
   * @deprecated Do not use the module directly. This builder will be removed
   *     after v2.0.0. You can check node types without the builder by using
   *     NodeType after v2.0.0.
   */
  get Builder() {
    defineProp(this, 'Builder', { value: require('./legacy/TypeBuilder.js') });
    return this.Builder;
  },


  /**
   * An alias for type name dictionaries.
   * @type {module:lib/legacy/TypeDictionary}
   * @see module:lib/legacy/TypeDictionary
   */
  get Dictionary() {
    defineProp(this, 'Dictionary', { value: require('./legacy/TypeDictionary.js') });
    return this.Dictionary;
  },
};
