/**
 * Disallows space after opening square bracket and before closing.
 * Reports on all on brackets, even on property accessors.
 * Use [disallowSpacesInsideArrayBrackets](http://jscs.info/rule/disallowSpacesInsideArrayBrackets.html)
 * to exclude property accessors.
 *
 * Types: `Boolean` or `Object`
 *
 * Values: `true` for strict mode, or `"allExcept": [ "[", "]" ]`
 * ignores closing brackets in a row.
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInsideBrackets": true
 *
 * // or
 *
 * "disallowSpacesInsideBrackets": {
 *     "allExcept": [ "[", "]", "{", "}" ]
 * }
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var x = [[1]];
 * var x = a[1];
 * ```
 *
 * ##### Valid for mode `{ allExcept": [ "[", "]", "{", "}" ] }`
 *
 * ```js
 * var x = [ [1] ];
 * var x = [ { a: 1 } ];
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = [ [ 1 ] ];
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule requires string value true or object';

        if (isObject) {
            assert('allExcept' in value, error);
        } else {
            assert(value === true, error);
        }

        this._exceptions = {};

        if (isObject) {
            (value.allExcept || []).forEach(function(value) {
                this._exceptions[value] = true;
            }, this);
        }
    },

    getOptionName: function() {
        return 'disallowSpacesInsideBrackets';
    },

    check: function(file, errors) {
        var exceptions = this._exceptions;

        file.iterateTokenByValue('[', function(token) {
            var nextToken = file.getNextToken(token, { includeComments: true });
            var value = nextToken.value;

            if (value in exceptions) {
                return;
            }

            // Skip for empty array brackets
            if (value === ']') {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: token,
                nextToken: nextToken,
                message: 'Illegal space after opening bracket'
            });
        });

        file.iterateTokenByValue(']', function(token) {
            var prevToken = file.getPrevToken(token, { includeComments: true });
            var value = prevToken.value;

            if (value in exceptions) {
                return;
            }

            // Skip for empty array brackets
            if (value === '[') {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: prevToken,
                nextToken: token,
                message: 'Illegal space before closing bracket'
            });
        });
    }
};
