/**
 * Requires function declarations by disallowing assignment of functions
 * expressions to variables. Function expressions are allowed in all other
 * contexts, including when passed as function arguments or immediately invoked.
 *
 * Assignment of function expressions to object members is also permitted, since
 * these can't be declared.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireFunctionDeclarations": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function declared() {
 *
 * };
 *
 * (function iife() {
 *     void 0;
 * })();
 *
 * var obj = {
 *     a: function () {}
 * };
 *
 * obj.b = function () { };
 *
 * $('#foo').click(function bar() {
 *
 * };)
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var expressed = function() {
 *
 * };
 *
 * var expressed = function deeply() {
 *
 * };
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
        return 'requireFunctionDeclarations';
    },

    check: function(file, errors) {
        file.iterateNodesByType(
            'VariableDeclarator',
            function(node) {
                if (node.init && node.init.type === 'FunctionExpression') {
                    errors.add('Use a function declaration instead', node.loc.start);
                }
            }
        );

        file.iterateNodesByType(
            'AssignmentExpression',
            function(node) {
                if (node.left.type !== 'MemberExpression' &&
                    node.right.type === 'FunctionExpression') {
                    errors.add('Use a function declaration instead', node.loc.start);
                }
            }
        );
    }
};
