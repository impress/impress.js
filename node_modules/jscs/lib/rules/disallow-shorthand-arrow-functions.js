/**
 * Require arrow functions to use a block statement (explicit return).
 *
 * Why enable this rule? Arrow functions' syntax can cause maintenance issues:
 *
 * - When you add additional lines to an arrow function's expression body, the
 *   function will now return `undefined`, unless you remember to add an
 *   explicit `return`.
 * - The shorthand syntax is ambiguous in terms of returning objects.
 *   `(name) => {id: name}` is interpreted as a longhand arrow function with the
 *   label `id:`.
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
 * "disallowShorthandArrowFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // block statement
 * evens.map(v => {
 *     return v + 1;
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * // single expression
 * evens.map(v => v + 1);
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
        return 'disallowShorthandArrowFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ArrowFunctionExpression', function(node) {
            if (node.expression) {
                errors.add(
                    'Use arrow function with explicit block and explicit return',
                    node.body.loc.start
                );
            }
        });
    }

};
