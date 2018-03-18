/**
 * Requires that arrow functions are used instead of anonymous function expressions in callbacks.
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
 * "requireArrowFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // arrow function
 * [1, 2, 3].map((x) => {
 *     return x * x;
 * });
 * // function declaration
 * function a(n) { return n + 1; }
 * // getter/setter
 * var x = { get y() {}, set y(y) {} }
 * // object shorthand
 * var x = { bar() {} }
 * // class method
 * class Foo { bar() {} }
 * // function expression in a return statement
 * function a(x) {
 *     return function(x) { return x };
 * };
 * // function expression in a variable declaration
 * var a = function(x) { return x };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * // function expression in a callback
 * [1, 2, 3].map(function (x) {
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
        return 'requireArrowFunctions';
    },

    check: function(file, errors) {

        function isCallback(node) {
            return node.type === 'FunctionExpression' && node.parentNode.type === 'CallExpression';
        }

        function isFunctionBindWithThis(node) {
            return node.callee &&
            node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'FunctionExpression' &&
            node.callee.property.type === 'Identifier' &&
            node.callee.property.name === 'bind' &&
            node.arguments &&
            node.arguments.length === 1 && node.arguments[0].type === 'ThisExpression';
        }

        file.iterateNodesByType(['FunctionExpression', 'CallExpression'], function(node) {
            if (isCallback(node) || isFunctionBindWithThis(node)) {
                errors.add('Use arrow functions instead of function expressions', node.loc.start);
            }

        });
    }
};
