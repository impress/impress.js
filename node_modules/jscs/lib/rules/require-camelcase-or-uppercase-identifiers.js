/**
 * Requires identifiers to be camelCased or UPPERCASE_WITH_UNDERSCORES
 *
 * Types: `Boolean` or `String` or `Object`
 *
 * Values:
 *
 * - `true`
 * - `"ignoreProperties"` allows an exception for object property names. Deprecated, Please use the `Object` value
 * - `Object`:
 *    - `ignoreProperties`:  boolean that allows an exception for object property names
 *    - `strict`: boolean that forces the first character to not be capitalized
 *    - `allowedPrefixes`: array of String, RegExp, or ESTree RegExpLiteral values permitted as prefixes
 *    - `allowedSuffixes`: array of String, RegExp, or ESTree RegExpLiteral values permitted as suffixes
 *    - `allExcept`: array of String, RegExp, or ESTree RegExpLiteral values permitted as exceptions
 *
 * JSHint: [`camelcase`](http://jshint.com/docs/options/#camelcase)
 *
 * #### Example
 *
 * ```js
 * "requireCamelCaseOrUpperCaseIdentifiers": true
 *
 * "requireCamelCaseOrUpperCaseIdentifiers": {"ignoreProperties": true, "strict": true}
 *
 * "requireCamelCaseOrUpperCaseIdentifiers": {"allowedPrefixes": ["opt_", /pfx\d+_/]}
 *
 * "requireCamelCaseOrUpperCaseIdentifiers": {"allowedSuffixes": ["_dCel", {regex: {pattern: "_[kMG]?Hz"}}]}
 *
 * "requireCamelCaseOrUpperCaseIdentifiers": {"allExcept": ["var_args", {regex: {pattern: "^ignore", flags: "i"}}]}
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var camelCase = 0;
 * var CamelCase = 1;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * var lower_case = 1;
 * var Mixed_case = 2;
 * var mixed_Case = 3;
 * ```
 *
 * ##### Valid for mode `ignoreProperties`
 *
 * ```js
 * var camelCase = 0;
 * var CamelCase = 1;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * var obj.snake_case = 5;
 * var camelCase = { snake_case: 6 };
 * ```
 *
 * ##### Invalid for mode `ignoreProperties`
 *
 * ```js
 * var lower_case = 1;
 * var Mixed_case = 2;
 * var mixed_Case = 3;
 * var snake_case = { snake_case: 6 };
 * ```
 *
 * ##### Valid for mode `strict`
 *
 * ```js
 * var camelCase = 0;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * var obj.snake_case = 5;
 * var camelCase = { snake_case: 6 };
 * ```
 *
 * ##### Invalid for mode `strict`
 *
 * ```js
 * var Mixed_case = 2;
 * var Snake_case = { snake_case: 6 };
 * var snake_case = { SnakeCase: 6 };
 * ```
 *
 * ##### Valid for `{ allowedPrefix: ["opt_", /pfx\d+_/] }`
 * ```js
 * var camelCase = 0;
 * var CamelCase = 1;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * var opt_camelCase = 5;
 * var pfx32_camelCase = 6;
 * ```
 *
 * ##### Invalid for `{ allowedPrefix: ["opt_", /pfx\d+/] }`
 * ```js
 * var lower_case = 1;
 * var Mixed_case = 2;
 * var mixed_Case = 3;
 * var req_camelCase = 4;
 * var pfx_CamelCase = 5;
 * ```
 *
 * ##### Valid for `{ allowedSuffixes: ["_dCel", {regex:{pattern:"_[kMG]?Hz"}}] }`
 * ```js
 * var camelCase = 0;
 * var CamelCase = 1;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * var camelCase_dCel = 5;
 * var _camelCase_MHz = 6;
 * ```
 *
 * ##### Invalid for `{ allowedSuffixes: ["_dCel", {regex:{pattern:"_[kMG]?Hz"}}] }`
 * ```js
 * var lower_case = 1;
 * var Mixed_case = 2;
 * var mixed_Case = 3;
 * var camelCase_cCel = 4;
 * var CamelCase_THz = 5;
 * ```
 *
 * ##### Valid for `{ allExcept: ["var_args", {regex:{pattern:"^ignore",flags:"i"}}] }`
 * ```js
 * var camelCase = 0;
 * var CamelCase = 1;
 * var _camelCase = 2;
 * var camelCase_ = 3;
 * var UPPER_CASE = 4;
 * var var_args = 5;
 * var ignoreThis_Please = 6;
 * var iGnOrEeThis_Too = 7;
 * ```
 *
 * ##### Invalid for `{ allExcept: ["var_args", {regex:{pattern:"^ignore",flags:"i"}}] }`
 * ```js
 * var lower_case = 1;
 * var Mixed_case = 2;
 * var mixed_Case = 3;
 * var var_arg = 4;
 * var signore_per_favore = 5;
 * ```
 */

var assert = require('assert');

// Convert an array of String or RegExp or ESTree RegExpLiteral values
// into an array of String or RegExp values.  Returns falsy if the
// input does not match expectations.
function processArrayOfStringOrRegExp(iv) {
    if (!Array.isArray(iv)) {
        return;
    }
    var rv = [];
    var i = 0;
    while (rv && (i < iv.length)) {
        var elt = iv[i];
        if (typeof elt === 'string') {
            // string values OK
            rv.push(elt);
        } else if (elt instanceof RegExp) {
            // existing RegExp OK
            rv.push(elt);
        } else if (elt && (typeof elt === 'object')) {
            try {
                // ESTree RegExpLiteral ok if it produces RegExp
                rv.push(new RegExp(elt.regex.pattern, elt.regex.flags || ''));
            } catch (e) {
                // Not a valid RegExpLiteral
                rv = null;
            }
        } else {
            // Unknown value
            rv = null;
        }
        ++i;
    }
    return rv;
}

// Return undefined or the start of the unprefixed value.
function startAfterStringPrefix(value, prefix) {
    var start = prefix.length;
    if (start >= value.length) {
        return;
    }
    if (value.substr(0, prefix.length) !== prefix) {
        return;
    }
    return start;
}

// Return undefined or the start of the unprefixed value.
function startAfterRegExpPrefix(value, prefix) {
    var match = prefix.exec(value);
    if (!match) {
        return;
    }
    if (match.index !== 0) {
        return;
    }
    return match[0].length;
}

// Return undefined or the end of the unsuffixed value.
function endBeforeStringSuffix(value, suffix) {
    var ends = value.length - suffix.length;
    if (ends <= 0) {
        return;
    }
    if (value.substr(ends) !== suffix) {
        return;
    }
    return ends;
}

// Return undefined or the end of the unsuffixed value.
function endBeforeRegExpSuffix(value, suffix) {
    var match = suffix.exec(value);
    if (!match) {
        return;
    }
    var ends = match.index;
    if ((ends + match[0].length) !== value.length) {
        return;
    }
    return ends;
}

// Return truthy iff the value matches the exception.
function matchException(value, exception) {
    if (typeof exception === 'string')  {
        return (exception === value);
    }
    return exception.test(value);
}

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
              options === true || options === 'ignoreProperties',
              this.getOptionName() + ' option requires a true value or `ignoreProperties`'
            );
            var _options = {
                ignoreProperties: options === 'ignoreProperties' ? true : false,
                strict: false
            };
            return this.configure(_options);
        }

        assert(
          !options.hasOwnProperty('ignoreProperties') || typeof options.ignoreProperties === 'boolean',
          this.getOptionName() + ' option should have boolean value for ignoreProperties'
        );
        this._ignoreProperties = options.ignoreProperties;

        assert(
          !options.hasOwnProperty('strict') || typeof options.strict === 'boolean',
          this.getOptionName() + ' option should have boolean value for strict'
        );
        this._strict = options.strict;

        var asre = processArrayOfStringOrRegExp(options.allowedPrefixes);
        assert(
          !options.hasOwnProperty('allowedPrefixes') || asre,
          this.getOptionName() + ' option should have array of string or RegExp for allowedPrefixes'
        );
        if (asre) {
            this._allowedPrefixes = asre;
        }

        asre = processArrayOfStringOrRegExp(options.allowedSuffixes);
        assert(
          !options.hasOwnProperty('allowedSuffixes') || asre,
          this.getOptionName() + ' option should have array of string or RegExp for allowedSuffixes'
        );
        if (asre) {
            this._allowedSuffixes = asre;
        }

        asre = processArrayOfStringOrRegExp(options.allExcept);
        assert(
          !options.hasOwnProperty('allExcept') || asre,
          this.getOptionName() + ' option should have array of string or RegExp for allExcept'
        );
        if (asre) {
            this._allExcept = asre;
        }

    },

    getOptionName: function() {
        return 'requireCamelCaseOrUpperCaseIdentifiers';
    },

    check: function(file, errors) {
        file.iterateTokensByType('Identifier', function(token) {
            var value = token.value;

            // Leading and trailing underscores signify visibility/scope and do not affect
            // validation of the rule.  Remove them to simplify the checks.
            var isPrivate = (value[0] === '_');
            value = value.replace(/^_+|_+$/g, '');

            // Detect exceptions before stripping prefixes/suffixes.
            if (this._allExcept) {
                for (i = 0, len = this._allExcept.length; i < len; ++i) {
                    if (matchException(value, this._allExcept[i])) {
                        return;
                    }
                }
            }

            // Strip at most one prefix permitted text from the identifier.  This transformation
            // cannot change an acceptable identifier into an unacceptable identifier so we can
            // continue with the normal verification of whatever it produces.
            var i;
            var len;
            if (this._allowedPrefixes) {
                for (i = 0, len = this._allowedPrefixes.length; i < len; ++i) {
                    var prefix = this._allowedPrefixes[i];
                    var start;
                    if (typeof prefix === 'string') {
                        start = startAfterStringPrefix(value, prefix);
                    } else {
                        start = startAfterRegExpPrefix(value, prefix);
                    }
                    if (start !== undefined) {
                        value = value.substr(start);
                        break;
                    }
                }
            }

            // As with prefix but for one suffix permitted text.
            if (this._allowedSuffixes) {
                for (i = 0, len = this._allowedSuffixes.length; i < len; ++i) {
                    var suffix = this._allowedSuffixes[i];
                    var ends;
                    if (typeof suffix === 'string') {
                        ends = endBeforeStringSuffix(value, suffix);
                    } else {
                        ends = endBeforeRegExpSuffix(value, suffix);
                    }
                    if (ends !== undefined) {
                        value = value.substr(0, ends);
                        break;
                    }
                }
            }

            if (value.indexOf('_') === -1 || value.toUpperCase() === value) {
                if (!this._strict) {return;}
                if (value.length === 0 || value[0].toUpperCase() !== value[0] || isPrivate) {
                    return;
                }
            }
            if (this._ignoreProperties) {
                var nextToken = file.getNextToken(token);
                var prevToken = file.getPrevToken(token);

                if (nextToken && nextToken.value === ':') {
                    return;
                }

                /* This enables an identifier to be snake cased via the object
                 * destructuring pattern. We must check to see if the identifier
                 * is being used to set values into an object to determine if
                 * this is a legal assignment.
                 * Example: ({camelCase: snake_case}) => camelCase.length
                 */
                if (prevToken && prevToken.value === ':') {
                    var node = file.getNodeByRange(token.range[0]);
                    var parentNode = node.parentNode;
                    if (parentNode && parentNode.type === 'Property') {
                        var grandpa = parentNode.parentNode;
                        if (grandpa && grandpa.type === 'ObjectPattern') {
                            return;
                        }
                    }
                }

                if (prevToken && (prevToken.value === '.' ||
                    prevToken.value === 'get' || prevToken.value === 'set')) {
                    return;
                }
            }
            errors.add(
                'All identifiers must be camelCase or UPPER_CASE',
                token.loc.start.line,
                token.loc.start.column
            );
        }.bind(this));
    }

};
