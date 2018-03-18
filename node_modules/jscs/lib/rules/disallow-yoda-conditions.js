/**
 * Requires the variable to be the left hand operator when doing a boolean comparison
 *
 * Type: `Array` or `Boolean`
 *
 * Values: Array of quoted operators or `true` to disallow yoda conditions for most possible comparison operators
 *
 * #### Example
 *
 * ```js
 * "disallowYodaConditions": [
 *     "==",
 *     "===",
 *     "!=",
 *     "!=="
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (a == 1) {
 *     return
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (1 == a) {
 *     return
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(operators) {
        var isTrue = operators === true;

        assert(
            Array.isArray(operators) || isTrue,
            this.getOptionName() + ' option requires array or true value'
        );

        if (isTrue) {
            operators = ['==', '===', '!=', '!=='];
        }

        this._operatorIndex = {};
        for (var i = 0, l = operators.length; i < l; i++) {
            this._operatorIndex[operators[i]] = true;
        }
    },

    getOptionName: function() {
        return 'disallowYodaConditions';
    },

    check: function(file, errors) {
        var operators = this._operatorIndex;
        file.iterateNodesByType('BinaryExpression', function(node) {
            if (operators[node.operator]) {
                if (node.left.type === 'Literal' ||
                    (node.left.type === 'Identifier' && node.left.name === 'undefined')
                ) {
                    errors.add('Yoda condition', node.left.loc.start);
                }
            }
        });
    }

};
