/**
 * Disallows sticking binary operators to the right.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to require space after all possible binary operators
 *
 * #### Example
 *
 * ```js
 * "requireSpaceAfterBinaryOperators": [
 *     "=",
 *     ",",
 *     "+",
 *     "-",
 *     "/",
 *     "*",
 *     "==",
 *     "===",
 *     "!=",
 *     "!=="
 *     // etc
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x + y;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x +y;
 * ```
 */

var assert = require('assert');
var allOperators = require('../utils').binaryOperators;

module.exports = function() {};

module.exports.prototype = {

    configure: function(operators) {
        var isTrue = operators === true;

        assert(
            Array.isArray(operators) || isTrue,
            this.getOptionName() + ' option requires array or true value'
        );

        if (isTrue) {
            operators = allOperators;
        }

        this._operatorIndex = {};
        for (var i = 0, l = operators.length; i < l; i++) {
            this._operatorIndex[operators[i]] = true;
        }
    },

    getOptionName: function() {
        return 'requireSpaceAfterBinaryOperators';
    },

    check: function(file, errors) {
        var operators = this._operatorIndex;

        // Comma
        if (operators[',']) {
            file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
                errors.assert.whitespaceBetween({
                    token: token,
                    nextToken: file.getNextToken(token),
                    message: 'Operator , should not stick to following expression'
                });
            });
        }

        // For everything else
        file.iterateNodesByType(
            ['BinaryExpression', 'AssignmentExpression', 'VariableDeclarator', 'LogicalExpression'],
            function(node) {
                var operator;
                var expression;

                if (node.type === 'VariableDeclarator') {
                    expression = node.init;
                    operator = '=';
                } else {
                    operator = node.operator;
                    expression = node.right;
                }

                if (expression === null) {
                    return;
                }

                var operatorToken = file.findPrevOperatorToken(
                    file.getFirstNodeToken(expression),
                    operator
                );

                var nextToken = file.getNextToken(operatorToken);

                if (operators[operator]) {
                    errors.assert.whitespaceBetween({
                        token: operatorToken,
                        nextToken: nextToken,
                        message: 'Operator ' + operator + ' should not stick to following expression'
                    });
                }
            }
        );
    }

};
