/**
 * Disallows space after opening object curly brace and before closing.
 *
 * Types: `Object`, `Boolean` or `String`
 *
 * Values: `"all"` or `true` for strict mode, `"nested"` (*deprecated* use `"allExcept": ['}']`)
 * ignores closing brackets in a row.
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInsideObjectBrackets": {
 *     "allExcept": [ "}", ")" ]
 * }
 *
 * // or
 * "disallowSpacesInsideObjectBrackets": true | "all" | "nested"
 * ```
 *
 * ##### Valid for mode `"all"`
 *
 * ```js
 * var x = {a: {b: 1}};
 * ```
 *
 * ##### Valid for mode `"nested"`
 *
 * ```js
 * var x = {a: {b: 1} };
 * ```
 *
 * ##### Valid for mode `"allExcept": ["}"]`
 *
 * ```js
 * var x = {a: {b: 1} };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = { a: { b: 1 } };
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        var mode;
        var modes = {
            'all': true,
            'nested': true
        };
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule' +
        ' requires string "all" or "nested", true value or object';

        if (typeof value === 'string' || value === true) {
            assert(modes[value === true ? 'all' : value], error);

        } else if (isObject) {
            assert('allExcept' in value, error);
        } else {
            assert(false, error);
        }

        this._exceptions = {};

        if (isObject) {
            (value.allExcept || []).forEach(function(value) {
                this._exceptions[value] = true;
            }, this);

        } else {
            mode = value;
        }

        if (mode === 'nested') {
            this._exceptions['}'] = true;
        }
    },

    getOptionName: function() {
        return 'disallowSpacesInsideObjectBrackets';
    },

    check: function(file, errors) {
        var exceptions = this._exceptions;

        file.iterateNodesByType(['ObjectExpression', 'ObjectPattern'], function(node) {
            var openingBracket = file.getFirstNodeToken(node);
            var nextToken = file.getNextToken(openingBracket);

            errors.assert.noWhitespaceBetween({
                token: openingBracket,
                nextToken: nextToken,
                message: 'Illegal space after opening curly brace'
            });

            var closingBracket = file.getLastNodeToken(node);
            var prevToken = file.getPrevToken(closingBracket);

            if (prevToken.value in exceptions) {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: prevToken,
                nextToken: closingBracket,
                message: 'Illegal space before closing curly brace'
            });
        });
    }
};
