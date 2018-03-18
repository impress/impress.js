// This script licensed under the MIT.
// http://orgachem.mit-license.org


var defineProp = Object.defineProperty;


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
   * @deprecated Do not use the module directly. Use TransformToLegacy.
   */
  get Parser() {
    defineProp(this, 'Parser', { value: require('./TypeParser.js') });
    return this.Parser;
  },


  /**
   * An alias for type expression lexers.
   * @type {module:lib/legacy/TypeLexer}
   * @see module:lib/legacy/TypeLexer
   * @deprecated Do not use the module directly. Use TransformToLegacy.
   */
  get Lexer() {
    defineProp(this, 'Lexer', { value: require('./TypeLexer.js') });
    return this.Lexer;
  },


  /**
   * An alias for type expression object builders.
   * @type {module:lib/legacy/TypeBuilder}
   * @see module:lib/legacy/TypeBuilder
   * @deprecated Do not use the module directly. Use TransformToLegacy.
   */
  get Builder() {
    defineProp(this, 'Builder', { value: require('./TypeBuilder.js') });
    return this.Builder;
  },


  /**
   * An alias for type name dictionaries.
   * @type {module:lib/legacy/TypeDictionary}
   * @see module:lib/legacy/TypeDictionary
   * @deprecated Do not use the module directly. Use TransformToLegacy.
   */
  get Dictionary() {
    defineProp(this, 'Dictionary', { value: require('./TypeDictionary.js') });
    return this.Dictionary;
  }
};
