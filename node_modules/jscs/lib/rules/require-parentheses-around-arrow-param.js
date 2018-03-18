/**
 * Requires parentheses around arrow function expressions with a single parameter.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireParenthesesAroundArrowParam": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * [1, 2, 3].map((x) => x * x);
 * // params are always required for multiple parameters
 * [1, 2, 3].map((x, y, z) => x * x);
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * [1, 2, 3].map(x => x * x);
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireParenthesesAroundArrowParam';
    },

    check: function(file, errors) {
        function isWrapped(node) {
            var openParensToken = file.getPrevToken(file.getFirstNodeToken(node));
            var closingParensToken = file.getNextToken(file.getLastNodeToken(node));
            var closingTokenValue = closingParensToken ? closingParensToken.value : '';

            return openParensToken.value + closingTokenValue === '()';
        }

        file.iterateNodesByType('ArrowFunctionExpression', function(node) {
            var params = node.params;
            var firstParam = params[0];

            if (params.length === 1 && !isWrapped(firstParam)) {
                errors.add(
                    'Wrap arrow function expressions in parentheses',
                    firstParam.loc.start
                );
            }
        });
    }

};
