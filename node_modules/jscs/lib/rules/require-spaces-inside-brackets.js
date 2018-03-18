/**
 * Requires space after opening square bracket and before closing.
 * Reports on all on brackets, even on property accessors.
 * Use [requireSpacesInsideArrayBrackets](http://jscs.info/rule/requireSpacesInsideArrayBrackets.html)
 * to exclude property accessors.
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `Boolean`
 *      - `true`: strict mode
 *  - `Object`:
 *      - `"allExcept"`: Array specifying list of tokens that can occur after an opening square bracket or before a
 *        closing square bracket without a space

 * #### Example
 *
 * ```js
 * "requireSpacesInsideBrackets": true
 * ```
 * ```js
 * "requireSpacesInsideBrackets": {
 *     "allExcept": [ "[", "]", "{", "}" ]
 * }
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var x = [ 1 ];
 * var x = a[ 1 ];
 * ```
 *
 * ##### Valid for mode `{ allExcept": [ "[", "]", "{", "}" ] }`
 *
 * ```js
 * var x = [[ 1 ], [ 2 ]];
 * var x = [{ a: 1 }, { b: 2}];
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = [1];
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
        return 'requireSpacesInsideBrackets';
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

            errors.assert.spacesBetween({
                token: token,
                nextToken: nextToken,
                exactly: 1,
                message: 'One space required after opening bracket'
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

            errors.assert.spacesBetween({
                token: prevToken,
                nextToken: token,
                exactly: 1,
                message: 'One space required before closing bracket'
            });
        });
    }
};
