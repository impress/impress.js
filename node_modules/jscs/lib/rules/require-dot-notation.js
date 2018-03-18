/**
 * Requires member expressions to use dot notation when possible
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true`
 *  - `"except_snake_case"` (*deprecated* use `"allExcept": ["snake_case"]`) allow quoted snake cased identifiers
 *  - `Object`:
 *    - `'allExcept'` array of exceptions:
 *       - `'keywords'` allow quoted identifiers made of reserved words
 *       - `'snake_case'` allow quoted snake cased identifiers
 *
 * N.B.: keywords are always allowed with es3 enabled (http://jscs.info/overview.html#es3)
 *
 * JSHint: [`sub`](http://www.jshint.com/docs/options/#sub)
 *
 * #### Example
 *
 * ```js
 * "requireDotNotation": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = b[c];
 * var a = b.c;
 * var a = b[c.d];
 * var a = b[1];
 * var a = b.while; // reserved words can be property names in ES5
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = b['c'];
 * var a = b['snake_cased'];
 * var a = b['_camelCased'];
 * var a = b['camelCased_'];
 * ```
 *
 * #### Example for allExcept snake_case
 *
 * ```js
 * "requireDotNotation": { "allExcept": [ "snake_case" ] }
 * ```
 *
 * ##### Valid
 * ```js
 * var a = b[c];
 * var a = b.c;
 * var a = b['snake_cased'];
 * var a = b['camelCased_butWithSnakes'];
 * ```
 *
 * #### Example for allExcept keywords
 *
 * ```js
 * "requireDotNotation": { "allExcept": [ "keywords" ] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = b['yield']; // reserved word in ES5
 * var a = b['let'];
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = b['await']; // reserved word in ES6
 * ```
 *
 * #### Example for allExcept keywords with esnext
 *
 * ```js
 * "requireDotNotation": { "allExcept": [ "keywords" ] }
 * "esnext": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = b['await']; // reserved word in ES6
 * ```
 *
 * #### Example for `"es3": true`
 *
 * ```js
 * "requireDotNotation": true,
 * "es3": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = b[c];
 * var a = b.c;
 * var a = b[c.d];
 * var a = b[1];
 * var a = b['while']; // reserved word in ES3
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = b['c'];
 * ```
 */

var assert = require('assert');
var utils = require('../utils');
var reservedWords = require('reserved-words');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
                options === true || options === 'except_snake_case',
                this.getOptionName() + ' option requires either a true value or an object'
            );

            var _options = {};
            if (options === 'except_snake_case') {
                _options.allExcept = ['snake_case'];
            }

            return this.configure(_options);
        }

        assert(
            !options.allExcept || Array.isArray(options.allExcept),
            'allExcept value of ' + this.getOptionName() + ' option requires an array with exceptions'
        );

        if (Array.isArray(options.allExcept)) {
            this._exceptSnakeCase = options.allExcept.indexOf('snake_case') > -1;
            this._exceptKeywords = options.allExcept.indexOf('keywords') > -1;
        }
    },

    getOptionName: function() {
        return 'requireDotNotation';
    },

    check: function(file, errors) {
        var exceptSnakeCase = this._exceptSnakeCase;
        var exceptKeywords = this._exceptKeywords;

        var dialect = file.getDialect();
        file.iterateNodesByType('MemberExpression', function(node) {
            if (!node.computed || node.property.type !== 'Literal') {
                return;
            }

            var value = node.property.value;
            if (// allow numbers, nulls, and anything else
                typeof value !== 'string' ||
                // allow invalid identifiers
                !utils.isValidIdentifierName(value, file.getDialect()) ||
                // allow quoted snake cased identifiers if allExcept: ['snake_case']
                (exceptSnakeCase && utils.isSnakeCased(utils.trimUnderscores(value))) ||
                // allow quoted reserved words if allExcept: ['keywords']
                ((dialect === 'es3' || exceptKeywords) && reservedWords.check(value, dialect, true))
            ) {
                return;
            }

            errors.add(
                'Use dot notation instead of brackets for member expressions',
                node.property.loc.start
            );
        });
    }

};
