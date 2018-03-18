/**
 * Require arrow functions to use an expression body when returning a single statement
 * (no block statement, implicit return).
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
 * "requireShorthandArrowFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // single expression
 * evens.map(v => v + 1);
 * // multiple statments require a block
 * evens.map(v => {
 *     v = v + 1;
 *     return v;
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * evens.map(v => { return v + 1; });
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
        return 'requireShorthandArrowFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ArrowFunctionExpression', function(node) {
            var body = node.body;
            if (body.type === 'BlockStatement' &&
                body.body.length === 1 &&
                body.body[0].type === 'ReturnStatement') {
                errors.add(
                    'Use the shorthand arrow function form',
                    node.body.loc.start
                );
            }
        });
    }

};
