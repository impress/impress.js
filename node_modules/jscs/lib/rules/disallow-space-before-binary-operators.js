/**
 * Requires sticking binary operators to the left.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to disallow space before all possible binary operators
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBeforeBinaryOperators": [
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
 * x+ y;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x + y;
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
        return 'disallowSpaceBeforeBinaryOperators';
    },

    check: function(file, errors) {
        var operators = this._operatorIndex;

        // Comma
        if (operators[',']) {
            file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
                if (file.getPrevToken(token).value === ',') {
                    return;
                }
                errors.assert.noWhitespaceBetween({
                    token: file.getPrevToken(token, {includeComments: true}),
                    nextToken: token,
                    message: 'Operator , should stick to previous expression'
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

                var prevToken = file.getPrevToken(operatorToken, {includeComments: true});

                if (operators[operator]) {
                    errors.assert.noWhitespaceBetween({
                        token: prevToken,
                        nextToken: operatorToken,
                        message: 'Operator ' + node.operator + ' should stick to previous expression'
                    });
                }
            }
        );
    }

};
