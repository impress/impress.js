/**
 * Requires space after opening array square bracket and before closing.
 * Reports only on arrays, not on property accessors.
 * Use [requireSpacesInsideBrackets](http://jscs.info/rule/requireSpacesInsideBrackets.html)
 * to report on all brackets.
 *
 * Types: `String` or `Object`
 *
 * Values:
 *  - `String`
 *      - `"all"`: strict mode
 *      - `"allButNested"`: (*deprecated* use Object version with `"allExcept": [ "[", "]" ]`) ignores nested
 *        closing brackets in a row
 *  - `Object`:
 *      - `"allExcept"`: Array specifying list of tokens that can occur after an opening square bracket or before a
 *        closing square bracket without a space
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInsideArrayBrackets": "all"
 * ```
 * ```js
 * "requireSpacesInsideArrayBrackets": {
 *     "allExcept": [ "[", "]", "{", "}" ]
 * }
 * ```
 *
 * ##### Valid for mode `"all"`
 *
 * ```js
 * var x = [ 1 ];
 * var x = a[1];
 * ```
 *
 * ##### Valid for mode `{ "allExcept": [ "[", "]" ] }` or `"allButNested"`
 *
 * ```js
 * var x = [[ 1 ], [ 2 ]];
 * ```
 *
 * ##### Valid for mode `{ "allExcept": [ "[", "]", "{", "}" ] }`
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
        var mode;
        var modes = {
            'all': true,
            'allButNested': true
        };
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule' +
        ' requires string value "all" or "allButNested" or object';

        if (typeof value === 'string') {
            assert(modes[value], error);

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

        if (mode === 'allButNested') {
            this._exceptions['['] = this._exceptions[']'] = true;
        }
    },

    getOptionName: function() {
        return 'requireSpacesInsideArrayBrackets';
    },

    check: function(file, errors) {
        var exceptions = this._exceptions;

        file.iterateNodesByType('ArrayExpression', function(node) {
            var openBracket = file.getFirstNodeToken(node);
            var afterOpen = file.getNextToken(openBracket, {includeComments: true});
            var closeBracket = file.getLastNodeToken(node);
            var beforeClose = file.getPrevToken(closeBracket, {includeComments: true});

            // Skip for empty array brackets
            if (afterOpen.value === ']') {
                return;
            }

            if (!(afterOpen.value in exceptions)) {
                errors.assert.spacesBetween({
                    token: openBracket,
                    nextToken: afterOpen,
                    exactly: 1,
                    message: 'One space required after opening bracket'
                });
            }

            if (!(beforeClose.value in exceptions)) {
                errors.assert.spacesBetween({
                    token: beforeClose,
                    nextToken: closeBracket,
                    exactly: 1,
                    message: 'One space required before closing bracket'
                });
            }
        });
    }
};
