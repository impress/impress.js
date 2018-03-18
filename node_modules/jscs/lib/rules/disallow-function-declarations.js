/**
 * Disallows function declarations.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowFunctionDeclarations": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var expressed = function() {
 *
 * };
 *
 * var expressed = function deeply() {
 *
 * };
 *
 * $('#foo').click(function bar() {
 *
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function stated() {
 *
 * }
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
        return 'disallowFunctionDeclarations';
    },

    check: function(file, errors) {
        file.iterateNodesByType('FunctionDeclaration', function(node) {
            errors.add('Illegal function declaration', node.loc.start);
        });
    }
};
