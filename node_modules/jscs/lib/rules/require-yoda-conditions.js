/**
 * Requires the variable to be the right hand operator when doing a boolean comparison
 *
 * Types: `Array` or `Boolean`
 *
 * Values:
 * - `true` specifies that yoda conditions are required for most possible comparison operators
 * - `Array`: represents the list of quoted operators that requires yoda conditions
 *
 * #### Example
 *
 * ```js
 * "requireYodaConditions": true
 * ```
 * ```js
 * "requireYodaConditions": [
 *     "==",
 *     "===",
 *     "!=",
 *     "!=="
 * ]
 * ```
 *
 * ##### Valid for mode `true` or `['==']`
 * ```js
 * if (1 == a) {
 *     return
 * }
 * ```
 *
 * ##### Invalid for mode `true` or `['==']`
 *
 * ```js
 * if (a == 1) {
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
        return 'requireYodaConditions';
    },

    check: function(file, errors) {
        var operators = this._operatorIndex;
        file.iterateNodesByType('BinaryExpression', function(node) {
            if (operators[node.operator]) {
                if (node.right.type === 'Literal' ||
                    (node.right.type === 'Identifier' && node.right.name === 'undefined')
                ) {
                    errors.add('Not yoda condition', node.left.loc.start);
                }
            }
        });
    }

};
