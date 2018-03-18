/**
 * Requires object destructuring for multiple return values,
 * not array destructuring.
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
 * "disallowArrayDestructuringReturn": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * const { left, right } = processInput(input);
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * const [ left, __, top ] = processInput(input);
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
        return 'disallowArrayDestructuringReturn';
    },

    check: function(file, errors) {
        var addError = function(node) {
            errors.add(
                'Array destructuring is not allowed for return, ' +
                'use object destructuring instead',
                node.loc.start
            );
        };

        var isViolationDetected = function(maybeArrayPattern, maybeCallExpression) {

            return maybeCallExpression && maybeCallExpression.type === 'CallExpression' &&
                maybeArrayPattern && maybeArrayPattern.type === 'ArrayPattern';
        };

        file.iterateNodesByType(['VariableDeclaration', 'AssignmentExpression'], function(node) {

            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(function(declaration) {
                    if (!isViolationDetected(declaration.id, declaration.init)) {
                        return;
                    }

                    addError(declaration.init);
                });
            }

            if (node.type === 'AssignmentExpression') {
                if (!isViolationDetected(node.left, node.right)) {
                    return;
                }

                addError(node.right);
            }
        });
    }
};
