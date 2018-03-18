/**
 * Disallows the not, not equals, and strict not equals operators in conditionals.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowNotOperatorsInConditionals": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (clause) {
 *     // Do something really crazy
 * } else {
 *     // Do something crazy
 * }
 *
 * if (a == 1) {
 *     // Do something really crazy
 * } else {
 *     // Do something crazy
 * }
 *
 * var a = (clause) ? 1 : 0
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (!clause) {
 *     // Do something crazy
 * } else {
 *     // Do something really crazy
 * }
 *
 * if (a != 1) {
 *     // Do something crazy
 * } else {
 *     // Do something really crazy
 * }
 *
 * if (a !== 1) {
 *     // Do something crazy
 * } else {
 *     // Do something really crazy
 * }
 *
 * var a = (!clause) ? 0 : 1
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
        return 'disallowNotOperatorsInConditionals';
    },

    check: function(file, errors) {
        function hasNotOperator(test) {
            return test.type === 'UnaryExpression' && test.operator === '!';
        }

        function hasNotEqualOperator(test) {
            return test.type === 'BinaryExpression' && test.operator === '!=';
        }

        function hasStrictNotEqualOperator(test) {
            return test.type === 'BinaryExpression' && test.operator === '!==';
        }

        file.iterateNodesByType(['IfStatement', 'ConditionalExpression'], function(node) {
            var alternate = node.alternate;

            // check if the if statement has an else block
            if (node.type === 'IfStatement' && (!alternate || alternate.type !== 'BlockStatement')) {
                return;
            }
            var test = node.test;
            if (hasNotOperator(test)) {
                errors.add('Illegal use of not operator in if statement', test.loc.start);
            }
            if (hasNotEqualOperator(test)) {
                errors.add('Illegal use of not equal operator in if statement', test.loc.end);
            }
            if (hasStrictNotEqualOperator(test)) {
                errors.add('Illegal use of strict not equal operator in if statement', test.loc.end);
            }
        });
    }
};
