/**
 * Requires sticking unary operators to the right.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to disallow space after prefix for all unary operators
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceAfterPrefixUnaryOperators": ["++", "--", "+", "-", "~", "!"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x = !y; y = ++z;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x = ! y; y = ++ z;
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
        return 'disallowSpaceAfterPrefixUnaryOperators';
    },

    check: function(file, errors) {
        var operatorIndex = this._operatorIndex;

        file.iterateNodesByType(['UnaryExpression', 'UpdateExpression'], function(node) {
            // Check "node.prefix" for prefix type of (inc|dec)rement
            if (node.prefix && operatorIndex[node.operator]) {
                var operatorToken = file.getFirstNodeToken(node);
                errors.assert.noWhitespaceBetween({
                    token: operatorToken,
                    nextToken: file.getNextToken(operatorToken),
                    message: 'Operator ' + node.operator + ' should stick to operand'
                });
            }
        });
    }
};
