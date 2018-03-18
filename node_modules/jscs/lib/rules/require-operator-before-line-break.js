/**
 * Requires operators to appear before line breaks and not after.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to require all possible binary operators to appear before line breaks
 *
 * JSHint: [`laxbreak`](http://www.jshint.com/docs/options/#laxbreak)
 *
 * #### Example
 *
 * ```js
 * "requireOperatorBeforeLineBreak": [
 *     "?",
 *     "=",
 *     "+",
 *     "-",
 *     "/",
 *     "*",
 *     "==",
 *     "===",
 *     "!=",
 *     "!==",
 *     ">",
 *     ">=",
 *     "<",
 *     "<="
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x = y ? 1 : 2;
 * x = y ?
 *     1 : 2;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x = y
 *     ? 1 : 2;
 * ```
 */

var assert = require('assert');
var defaultOperators = require('../utils').binaryOperators.slice();

defaultOperators.push('?');

module.exports = function() {};

module.exports.prototype = {

    configure: function(operators) {
        var isTrue = operators === true;

        assert(
            Array.isArray(operators) || isTrue,
            this.getOptionName() + ' option requires array value or true value'
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
        return 'requireOperatorBeforeLineBreak';
    },

    check: function(file, errors) {
        var operators = this._operatorIndex;
        var throughTokens = ['?', ','];

        function errorIfApplicable(operatorToken) {
            errors.assert.sameLine({
                token: file.getPrevToken(operatorToken),
                nextToken: operatorToken,
                message: 'Operator ' + operatorToken.value + ' should not be on a new line',
                stickToPreviousToken: true
            });
        }

        throughTokens = throughTokens.filter(function(operator) {
            return operators[operator];
        });

        if (throughTokens.length) {
            file.iterateTokensByType('Punctuator', function(token) {
                var operator = token.value;

                if (throughTokens.every(function() {
                    return throughTokens.indexOf(operator) >= 0;
                })) {
                    errorIfApplicable(token);
                }
            });
        }

        file.iterateNodesByType(
            ['BinaryExpression', 'AssignmentExpression', 'LogicalExpression'],
            function(node) {
                var operator = node.operator;

                if (!operators[operator]) {
                    return;
                }

                var nextToken = file.getFirstNodeToken(node.argument || node.right);
                var token = file.findPrevOperatorToken(nextToken, operator);

                errorIfApplicable(token);
            }
        );
    }
};
