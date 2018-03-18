/**
 * Disallows sticking unary operators to the right.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to require space after prefix for all unary operators
 *
 * #### Example
 *
 * ```js
 * "requireSpaceAfterPrefixUnaryOperators": ["++", "--", "+", "-", "~", "!"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x = ! y; y = ++ z;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x = !y; y = ++z;
 * ```
 */

var assert = require('assert');
var defaultOperators = require('../utils').unaryOperators;

module.exports = function() {};

module.exports.prototype = {

    configure: function(operators) {
        var isTrue = operators === true;

        assert(
            Array.isArray(operators) || isTrue,
            this.getOptionName() + ' option requires array or true value'
        );

        if (isTrue) {
            operators = defaultOperators;
        }

        this._operatorIndex = {};
        for (var i = 0, l = operators.length; i < l; i++) {
            this._operatorIndex[operators[i]] = true;
        }
    },

    getOptionName: function() {
        return 'requireSpaceAfterPrefixUnaryOperators';
    },

    check: function(file, errors) {
        var operatorIndex = this._operatorIndex;

        file.iterateNodesByType(['UnaryExpression', 'UpdateExpression'], function(node) {
            // Check "node.prefix" for prefix type of (inc|dec)rement
            if (node.prefix && operatorIndex[node.operator]) {
                var argument = node.argument.type;
                var operatorToken = file.getFirstNodeToken(node);
                var nextToken = file.getNextToken(operatorToken);

                // Do not report consecutive operators (#405)
                if (
                    argument === 'UnaryExpression' || argument === 'UpdateExpression' &&
                    nextToken.value !== '('
                ) {
                    return;
                }

                errors.assert.whitespaceBetween({
                    token: operatorToken,
                    nextToken: nextToken,
                    message: 'Operator ' + node.operator + ' should not stick to operand'
                });
            }
        });
    }
};
