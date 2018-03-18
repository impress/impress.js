/**
 * Requires that a function expression be anonymous.
 *
 * Type: `Boolean`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *    - `'allExcept'` array of exceptions:
 *       - `'declarations'` ignores function declarations
 *
 * #### Example
 *
 * ```js
 * "requireAnonymousFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = function() {
 *
 * };
 *
 * $('#foo').click(function() {
 *
 * })
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = function foo() {
 *
 * };
 *
 * $('#foo').click(function bar() {
 *
 * });
 * ```
 *
 * ##### Valid for `{ "allExcept": ["declarations"] }`
 *
 * ```js
 * function foo() {
 *
 * }
 *
 * $('#foo').click(function() {
 *
 * })
 * ```
 *
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        var optionName = this.getOptionName();

        if (typeof options === 'object') {
            assert(Array.isArray(options.allExcept), optionName + ' option requires "allExcept" to be an array');
            assert(options.allExcept.length > 0, optionName + ' option requires "allExcept" to have at least one ' +
            ' item or be set to `true`');
            this._exceptDeclarations = options.allExcept.indexOf('declarations') > -1;
        } else {
            assert(options === true, this.getOptionName() + ' option requires either a true value or an object');
        }
    },

    getOptionName: function() {
        return 'requireAnonymousFunctions';
    },

    check: function(file, errors) {
        var exceptDeclarations = this._exceptDeclarations;

        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (exceptDeclarations && node.type === 'FunctionDeclaration') {
                return;
            }
            if (node.id !== null) {
                errors.add('Functions must not be named', node.loc.start);
            }
        });
    }
};
