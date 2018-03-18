/**
 * Disallows space after opening array square bracket and before closing.
 * Reports only on arrays, not on property accessors.
 * Use [disallowSpacesInsideBrackets](http://jscs.info/rule/disallowSpacesInsideBrackets.html)
 * to report on all brackets.
 *
 * Types: `Boolean`, `String` or `Object`
 *
 * Values: `"all"` or `true` for strict mode, `"nested"` (*deprecated* use `"allExcept": [ "[", "]" ]`)
 * ignores closing brackets in a row.
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInsideArrayBrackets": "all"
 *
 * // or
 *
 * "disallowSpacesInsideArrayBrackets": {
 *     "allExcept": [ "[", "]", "{", "}" ]
 * }
 * ```
 *
 * ##### Valid for mode `"all"`
 *
 * ```js
 * var x = [[1]];
 * var x = a[ 0 ]; // Property accessor not an array
 * ```
 *
 *
 * ##### Valid for mode `"nested"`
 *
 * ```js
 * var x = [ [1] ];
 * ```
 *
 * ##### Valid for mode `"allExcept"`
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
        var mode;
        var modes = {
            'all': true,
            'nested': true
        };
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule' +
        ' requires string value "all" or "nested" or object';

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
            this._exceptions['['] = this._exceptions[']'] = true;
        }
    },

    getOptionName: function() {
        return 'disallowSpacesInsideArrayBrackets';
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
                errors.assert.noWhitespaceBetween({
                    token: openBracket,
                    nextToken: afterOpen,
                    message: 'Illegal space after opening bracket'
                });
            }

            if (!(beforeClose.value in exceptions)) {
                errors.assert.noWhitespaceBetween({
                    token: beforeClose,
                    nextToken: closeBracket,
                    message: 'Illegal space before closing bracket'
                });
            }
        });
    }
};
