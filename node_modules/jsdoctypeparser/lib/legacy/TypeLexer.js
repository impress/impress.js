// This script licensed under the MIT.
// http://orgachem.mit-license.org

/**
 * @fileoverview A class for Jsdoc type lexers.
 * @author orga.chem.job@gmail.com (OrgaChem)
 */


var util = require('./util.js');



/**
 * A class for Jsdoc type lexers.  This lexer can analyze JsDoc type expressions
 * and ClosureCompiler type expressions.  See
 * {@link https://code.google.com/p/jsdoc-toolkit/wiki/TagParam} and
 * {@link https://developers.google.com/closure/compiler/docs/js-for-compiler}.
 *
 * This lexer calls handlers in a {@code map}. This is a list of method names of
 * handlers:
 * <dl>
 * <dt>Type name token handler</dt>
 * <dd>{@code handleTypeNameToken(typeName)}</dd>
 *
 * <dt>Type union token handlers</dt>
 * <dd>{@code handleOpenTypeUnionToken()},
 *     {@code handleCloseTypeUnionToken()}</dd>
 *
 * <dt>Function type token handlers</dt>
 * <dd>{@code handleOpenFunctionTypeToken()},
 *     {@code handleCloseFunctionTypeToken()},
 *     {@code handleOpenFunctionTypeParametersToken()},
 *     {@code handleCloseFunctionTypeParametersToken()},
 *     {@code handleFunctionTypeReturnTypeUnionToken()},
 *     {@code handleFunctionTypeContextTypeUnionToken()},
 *     {@code handleConstructorTypeUnionToken()}</dd>
 *
 * <dt>Generic type token handlers</dt>
 * <dd>{@code handleOpenGenericTypeToken()},
 *     {@code handleCloseGenericTypeToken()},
 *     {@code handleGenericTypeNameToken()},
 *     {@code handleOpenGenericTypeParametersToken()},
 *     {@code handleCloseGenericTypeParametersToken()}</dd>
 *
 * <dt>Record type token handlers</dt>
 * <dd>{@code handleOpenRecordTypeToken()},
 *     {@code handleCloseRecordTypeToken()},
 *     {@code handleEntryKeyNameToken(keyName)},
 *     {@code handleEntryValueTypeUnionToken()}</dd>
 *
 * <dt>Type operator token handlers</dt>
 * <dd>{@code handleNullableTypeOperatorToken()},
 *     {@code handleNonNullableTypeOperatorToken()},
 *     {@code handleOptionalTypeOperatorToken()},
 *     {@code handleVariableTypeOperatorToken()},
 *     {@code handleAllTypeOperatorToken()},
 *     {@code handleUnknownTypeOperatorToken()}</dd>
 *
 * <dt>Module token handlers</dt>
 * <dd>{@code handleModuleNameToken(moduleName)}</dd>
 * </dl>
 *
 * @param {Object.<function(string=)>=} opt_map Optional token handlers.
 * @constructor
 * @exports lib/TypeLexer
 */
var TypeLexer = function(opt_map) {
  this.setTokenHandlers(opt_map || {});
};



/**
 * Type expression syntax error object.
 * @param {string=} opt_msg Error message.
 * @param {string=} opt_org Original type expression string was analyzed.
 * @param {number=} opt_index Error location.
 * @constructor
 * @extends {Error}
 * @alias lib/TypeLexer.SyntaxError
 */
TypeLexer.SyntaxError = function(opt_msg, opt_org, opt_index) {
  Error.call(this);

  var msg = opt_msg || '';
  var org = opt_org || '';
  var index = opt_index || 1;

  this.name = 'TypeLexerSyntaxError';

  this.message = [
    msg + ':',
    org,
    util.repeat(' ', index - 1) + '^'
  ].join('\n');
};
util.inherits(TypeLexer.SyntaxError, Error);


/**
 * Original type expression to analyze.
 * @type {?string}
 * @private
 */
TypeLexer.prototype.org_ = null;


/**
 * Fail the analizing.
 * @param {string} msg Error message.
 * @param {number} index Error location.
 * @private
 */
TypeLexer.prototype.fail_ = function(msg, index) {
  throw new TypeLexer.SyntaxError(msg, this.org_, index);
};


/**
 * Listner map.
 * @type {Object.<function(string=)>}
 * @private
 */
TypeLexer.prototype.handlers_ = null;


/**
 * Sets an object has token handlers.
 * @param {Object.<function(string=)>} map Token handlers.
 */
TypeLexer.prototype.setTokenHandlers = function(map) {
  this.handlers_ = map;
};


/**
 * Analyzes a type string.
 * @param {string} arg Type expression string.
 */
TypeLexer.prototype.analyze = function(arg) {
  this.org_ = arg;

  var str = this.analyzeTypeUnion(arg);
  if (str) {
    this.fail_('Type union string was remained', this.org_.length - str.length);
  }
};


/**
 * Analyzes a type union expression.
 * @param {string} arg Type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeTypeUnion = function(arg) {
  if (this.handlers_.handleOpenTypeUnionToken) {
    this.handlers_.handleOpenTypeUnionToken();
  }

  var str = arg.replace(/^\s+/, '');
  var hasQuestionMark = false;
  var hasType = false;
  var wasOpenParens = false;

  // Check type operators on a head of the type union.
  var tmp, matched;
  if (tmp = str.match(/^[=!\?\.\s]+/)) {
    matched = tmp[0];
    str = str.slice(matched.length);

    if (matched.indexOf('=') >= 0) {
      if (this.handlers_.handleOptionalTypeOperatorToken) {
        this.handlers_.handleOptionalTypeOperatorToken();
      }
    }
    if (matched.indexOf('...') >= 0) {
      if (this.handlers_.handleVariableTypeOperatorToken) {
        this.handlers_.handleVariableTypeOperatorToken();
      }
    }
    if (matched.indexOf('!') >= 0) {
      if (this.handlers_.handleNonNullableTypeOperatorToken) {
        this.handlers_.handleNonNullableTypeOperatorToken();
      }
    }
    if (matched.indexOf('?') >= 0) {
      // Cannot determine the question mark means 'the all type' or 'nullable'
      // without type count.
      hasQuestionMark = true;
    }
  }


  if (str[0] === '(' || str[0] === '[') {
    // Identify a square bracket with a parenthesis.1
    str = str.replace(/^[\(\[]\s*/, '');
    if (this.handlers_.handleOpenParenthesis) {
      this.handlers_.handleOpenParenthesis();
    }
    wasOpenParens = true;
  }

  while (str[0]) {
    if (str.match(/^[\)\]\}>,]/)) {
      // This is an end of union.  The close parens used as function params
      if (wasOpenParens && (str[0] === ')' || str[0] === ']')) {
        // Identify a square bracket with a parenthesis.1
        str = str.replace(/^[\)\]]\s*/, '');
        if (this.handlers_.handleCloseParenthesis) {
          this.handlers_.handleCloseParenthesis();
        }
      }
      break;
    }
    else {
      // Check type operators on a tail of the type union.
      if (tmp = str.match(/^[=!?\s]+/)) {
        matched = tmp[0];
        str = str.slice(matched.length);

        if (matched.indexOf('=') >= 0) {
          if (this.handlers_.handleOptionalTypeOperatorToken) {
            this.handlers_.handleOptionalTypeOperatorToken();
          }
        }
        if (matched.indexOf('!') >= 0) {
          if (this.handlers_.handleNonNullableTypeOperatorToken) {
            this.handlers_.handleNonNullableTypeOperatorToken();
          }
        }
        if (matched.indexOf('?') >= 0) {
          hasQuestionMark = true;
        }
      }
      else {
        str = this.analyzeType(str).replace(/^\|\s*/, '');
        hasType = true;
      }
    }
  }

  // Check a type count.  If the count is less than 1, the question mark means
  // the all type, otherwise nullable.
  if (hasQuestionMark) {
    if (hasType) {
      if (this.handlers_.handleNullableTypeOperatorToken) {
        this.handlers_.handleNullableTypeOperatorToken();
      }
    }
    else {
      if (this.handlers_.handleUnknownTypeOperatorToken) {
        this.handlers_.handleUnknownTypeOperatorToken();
      }
    }
  }


  if (this.handlers_.handleCloseTypeUnionToken) {
    this.handlers_.handleCloseTypeUnionToken();
  }
  return str;
};


/**
 * Analyzes a single type expression such as: type name, generics, function.
 * @param {string} arg Type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeType = function(arg) {
  var str = arg;
  var tmp;

  if (!str) {
    this.fail_('Unexpected token: ""', this.org_.length);
  }
  else if (str.match(/^\*/)) {
    if (this.handlers_.handleAllTypeOperatorToken) {
      this.handlers_.handleAllTypeOperatorToken();
    }
    str = str.replace(/^\*\s*/, '');
  }
  else if (tmp = str.match(/^(void|undefined)\b/)) {
    if (this.handlers_.handleOptionalTypeOperatorToken) {
      this.handlers_.handleOptionalTypeOperatorToken(tmp[1]);
    }
    str = str.replace(/^(void|undefined)\s*/, '');
  }
  else if (str.match(/^null\b/)) {
    if (this.handlers_.handleNullableTypeOperatorToken) {
      this.handlers_.handleNullableTypeOperatorToken();
    }
    str = str.replace(/^null\s*/, '');
  }
  else if (str.match(/^[Uu]nknown\b/)) {
    if (this.handlers_.handleUnknownTypeOperatorToken) {
      this.handlers_.handleUnknownTypeOperatorToken();
    }
    str = str.replace(/^[Uu]nknown\s*/, '');
  }
  else if (str.match(/^function\b/)) {
    str = this.analyzeFunctionType(str);
  }
  else if (str.match(/^\{/)) {
    str = this.analyzeRecordType(str);
  }
  else {
    str = this.analyzeTypeName(str);
  }

  return str;
};


/**
 * Analyzes a type name and a module name expressioon.
 * @param {string} arg Type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeTypeName = function(arg) {
  var str = arg, tmp, matched, isModule;

  if (isModule = str.match(/^module:/)) {
    // Support "module:" expression.
    str = str.replace(/^module:\s*/, '');
    tmp = str.match(/^[\w\s\.#\/$_]+/);
    matched = tmp[0];
    str = str.slice(matched.length);
    matched = matched.replace(/\s+/g, '');

    if (this.isJsdocGenericType(str)) {
      str = this.analyzeJsdocGenericType(str, matched);
    }
    else if (this.isGenericType(str)) {
      // Check an opening generic params token that is after the type name.
      // This is generic type name if a square bracket was found.
      str = this.analyzeGenericType('module:' + matched + str);
    }
    else if (matched) {
      if (this.handlers_.handleModuleNameToken) {
        this.handlers_.handleModuleNameToken(matched);
      }
    }
    else {
      // This is an empty type that has only white spaces.
      this.fail_('Unexpected token: "' + str + '"', this.org_.length -
          str.length);
    }
  }
  else {
    tmp = str.match(/^[\w\s\.#$_]+/);

    if (!tmp) {
      // This is an empty type such as ',foobar' or '|foobar'.
      this.fail_('Unexpected token: ""', this.org_.length - str.length);
    }

    matched = tmp[0];
    str = str.slice(matched.length);
    matched = matched.replace(/\s+/g, '');

    if (this.isJsdocGenericType(str)) {
      str = this.analyzeJsdocGenericType(str, matched);
    }
    else if (this.isGenericType(str)) {
      // Check an opening generic params token that is after the type name.
      // This is generic type name if a square bracket was found.
      str = this.analyzeGenericType(matched + str);
    }
    else if (matched) {
      if (this.handlers_.handleTypeNameToken) {
        this.handlers_.handleTypeNameToken(matched);
      }
    }
    else {
      // This is an empty type that has only white spaces.
      this.fail_('Unexpected token: "' + str + '"', this.org_.length -
          str.length);
    }
  }

  return str;
};


/**
 * Whether a type expression is a jsdoc generic type expression.
 * @param {string} str Type expression string.
 * @return {boolean} Whether a type expression is a jsdoc generic type
 *     expression.
 */
TypeLexer.prototype.isJsdocGenericType = function(str) {
  return !!str.match(/^\[\s*\]/);
};


/**
 * Analyzes a jsdoc generic type expression.
 * @param {string} arg Type expression string.
 * @param {string} matched Generic parameter type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeJsdocGenericType = function(arg, matched) {
  // Support an array generic type as JsDoc official such as "String[]".
  // String[] => Array.<String>
  var str = arg.replace(/^\[\s*\]\s*/, '');
  str = this.analyzeGenericType('Array.<' + matched + '>' + str);
  return str;
};


/**
 * Whether a type expression is a generic type expression.
 * @param {string} str Type expression string.
 * @return {boolean} Whether a type expression is a generic type expression.
 */
TypeLexer.prototype.isGenericType = function(str) {
  return !!str.match(/^</);
};


/**
 * Analyzes a function type expression.
 * @param {string} arg Function type string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeFunctionType = function(arg) {
  var str = arg.replace(/^function\s*/, '');

  if (str[0] === '(') {
    if (this.handlers_.handleOpenFunctionTypeToken) {
      this.handlers_.handleOpenFunctionTypeToken();
    }

    if (this.handlers_.handleOpenFunctionTypeParametersToken) {
      this.handlers_.handleOpenFunctionTypeParametersToken();
    }
    str = str.replace(/\(\s*/, '');

    if (str.match(/^new\s*:/)) {
      if (this.handlers_.handleConstructorTypeUnionToken) {
        this.handlers_.handleConstructorTypeUnionToken();
      }
      str = this.analyzeTypeUnion(str.replace(/^new\s*:\s*/, ''))
          .replace(/^,?\s*/, '');
    }
    else if (str.match(/^this\s*:/)) {
      if (this.handlers_.handleFunctionTypeContextTypeUnionToken) {
        this.handlers_.handleFunctionTypeContextTypeUnionToken();
      }
      str = this.analyzeTypeUnion(str.replace(/^this\s*:\s*/, ''))
          .replace(/^,?\s*/, '');
    }

    var char;
    while ((char = str[0]) !== ')') {
      if (char) {
        str = this.analyzeTypeUnion(str).replace(/^,?\s*/, '');
      }
      else {
        this.fail_('Parameter parenthesis was not closed',
            this.org_.length - str.length);
      }
    }

    str = str.replace(/^\)\s*/, '');

    if (this.handlers_.handleCloseFunctionTypeParametersToken) {
      this.handlers_.handleCloseFunctionTypeParametersToken();
    }

    if (str.match(/^:/)) {
      if (this.handlers_.handleFunctionTypeReturnTypeUnionToken) {
        this.handlers_.handleFunctionTypeReturnTypeUnionToken();
      }
      str = this.analyzeTypeUnion(str.replace(/^:\s*/, ''));
    }

    if (this.handlers_.handleCloseFunctionTypeToken) {
      this.handlers_.handleCloseFunctionTypeToken();
    }
  }
  else {
    str = this.analyzeTypeName(arg.match(/^[Ff]unction/)[0]);
  }

  return str;
};


/**
 * Analyzes a generic type expression.
 * @param {string} arg Type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeGenericType = function(arg) {
  if (this.handlers_.handleOpenGenericTypeToken) {
    this.handlers_.handleOpenGenericTypeToken();
  }

  // Remove a period at the last.  Because an AS3 generic type form has a period
  // between a type name and an opening square bracket.
  var genericTypeName = arg.match(/^[^<]+/)[0].replace(/\.$/, '');

  if (this.handlers_.handleGenericTypeNameToken) {
    this.handlers_.handleGenericTypeNameToken();
  }

  this.analyzeTypeName(genericTypeName);

  var str = arg.replace(/^[^<]+<\s*/, '');

  var char;
  while ((char = str[0]) !== '>') {
    if (char) {
      str = this.analyzeTypeUnion(str).replace(/^,?\s*/, '');
    }
    else {
      this.fail_('Square bracket as generic params was not closed',
          this.org_.length - str.length);
    }
  }

  if (this.handlers_.handleCloseGenericTypeParametersToken) {
    this.handlers_.handleCloseGenericTypeParametersToken();
  }

  if (this.handlers_.handleCloseGenericTypeToken) {
    this.handlers_.handleCloseGenericTypeToken();
  }
  return str.replace(/^>\s*/, '');
};


/**
 * Analyzes a record type expression.
 * @param {string} arg Type expression string.
 * @return {string} Remained string.
 * @protected
 */
TypeLexer.prototype.analyzeRecordType = function(arg) {
  if (this.handlers_.handleOpenRecordTypeToken) {
    this.handlers_.handleOpenRecordTypeToken();
  }

  var str = arg.replace(/^\{\s*/, '');

  var tmp, matched;
  while (str[0] !== '}') {
    if (tmp = str.match(/^[^:\}]+/)) {
      matched = tmp[0];
      str = str.slice(matched.length);
      if (this.handlers_.handleEntryKeyNameToken) {
        this.handlers_.handleEntryKeyNameToken(matched.replace(/\s+/g, ''));
      }
    }

    if (this.handlers_.handleEntryValueTypeUnionToken) {
      this.handlers_.handleEntryValueTypeUnionToken();
    }

    if (str[0] === ':') {
      str = this.analyzeTypeUnion(str.replace(/^:\s*/, '')).
          replace(/^,?\s*/, '');
    }
    else {
      // See a record value type as the all type if a colon was not found.
      this.analyzeTypeUnion('*');
      str = str.replace(/^,?\s*/, '');
    }
  }

  if (this.handlers_.handleCloseRecordTypeToken) {
    this.handlers_.handleCloseRecordTypeToken();
  }
  return str.replace(/^\}\s*/, '');
};


// Exports the constructor.
module.exports = TypeLexer;
