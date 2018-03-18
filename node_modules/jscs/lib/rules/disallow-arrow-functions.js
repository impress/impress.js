/**
 * Disallows arrow functions.
 *
 * Why enable this rule? Arrow functions might cause more problems than they
 * solve:
 *
 * - Object-orientation may be better without ECMAScript's `this`.
 * - You can't name an arrow function.
 * - Arrow functions' syntax can cause maintenance issues; see
 *   `disallowShorthandArrowFunctions`.
 * - Arrow functions shouldn't be used on prototypes, as objects' methods,
 *   as event listeners, or as anything polymorhpic- or mixin-related. See
 *   [here](https://gist.github.com/qubyte/43e0093274e793cc82ba#gistcomment-1292183).
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
 * "disallowArrowFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // function expression in a callback
 * [1, 2, 3].map(function (x) {
 *     return x * x;
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * // arrow function
 * [1, 2, 3].map((x) => {
 *     return x * x;
 * });
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
        return 'disallowArrowFunctions';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['ArrowFunctionExpression'], function(node) {
            errors.add('Do not use arrow functions', node.loc.start);
        });
    }
};
