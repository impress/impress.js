/**
 * Disallows parentheses around arrow function expressions with a single parameter.
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
 * "disallowParenthesesAroundArrowParam": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * [1, 2, 3].map(x => x * x);
 * // parentheses are always required for multiple parameters
 * [1, 2, 3].map((x, y, z) => x * x);
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * [1, 2, 3].map((x) => x * x);
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
        return 'disallowParenthesesAroundArrowParam';
    },

    check: function(file, errors) {
        function isWrapped(node) {
            var openParensToken = file.getPrevToken(file.getFirstNodeToken(node));
            var closingParensToken = file.getNextToken(file.getLastNodeToken(node));
            var closingTokenValue = closingParensToken ? closingParensToken.value : '';

            return openParensToken.value + closingTokenValue === '()';
        }

        file.iterateNodesByType('ArrowFunctionExpression', function(node) {
            if (node.params.length !== 1) {
                return;
            }
            var firstParam = node.params[0];

            // Old Esprima
            var hasDefaultParameter = node.defaults && node.defaults.length === 1;
            // ESTree
            var hasDefaultParameterESTree = firstParam.type === 'AssignmentPattern';
            var hasDestructuring = firstParam.type === 'ObjectPattern' || firstParam.type === 'ArrayPattern';
            var hasRestElement = firstParam.type === 'RestElement';

            if (hasDefaultParameter ||
                hasDefaultParameterESTree ||
                hasDestructuring ||
                hasRestElement) {
                return;
            }

            if (isWrapped(firstParam)) {
                errors.add(
                    'Illegal wrap of arrow function expressions in parentheses',
                    firstParam.loc.start
                );
            }
        });
    }

};
