/**
 * Requires sticking unary operators to the left.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to disallow space before postfix for all unary operators
 * (i.e. increment/decrement operators)
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBeforePostfixUnaryOperators": ["++", "--"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x = y++; y = z--;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x = y ++; y = z --;
 * ```
 */

var assert = require('assert');
var defaultOperators = require('../utils').incrementAndDecrementOperators;

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
        return 'disallowSpaceBeforePostfixUnaryOperators';
    },

    check: function(file, errors) {
        var operatorIndex = this._operatorIndex;

        // 'UpdateExpression' involve only ++ and -- operators
        file.iterateNodesByType('UpdateExpression', function(node) {
            // "!node.prefix" means postfix type of (inc|dec)rement
            if (!node.prefix && operatorIndex[node.operator]) {
                var operatorToken = file.getLastNodeToken(node);
                errors.assert.noWhitespaceBetween({
                    token: file.getPrevToken(operatorToken),
                    nextToken: operatorToken,
                    message: 'Operator ' + node.operator + ' should stick to operand'
                });
            }
        });
    }
};
