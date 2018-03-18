/**
 * Require space after colon in object destructuring.
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
 * "requireSpaceBeforeDestructuredValues": true
 * ```
 *
 * ##### Valid
 * ```js
 * const { foo: objectsFoo } = SomeObject;
 * ```
 * ##### Invalid
 * ```js
 * const { foo:objectsFoo } = SomeObject;
 * ```
 *
 * ##### Valid
 * ```js
 * const { [ { foo: objectsFoo } ] } = SomeObject;
 * ```
 * ##### Invalid
 * ```js
 * const { [ { foo:objectsFoo } ] } = SomeObject;
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
        return 'requireSpaceBeforeDestructuredValues';
    },

    check: function(file, errors) {
        var checkSpaceMissing = function(propKey) {
            var keyToken = file.getFirstNodeToken(propKey);
            var colon    = file.findNextToken(keyToken, 'Punctuator', ':');

            errors.assert.whitespaceBetween({
                token: colon,
                nextToken: file.getNextToken(colon),
                message: 'Missing space after key colon'
            });
        };

        var letsCheckThisOne = function(item) {

            if (!item) {
                return;
            }

            if (item.type === 'ObjectPattern') {
                item.properties.forEach(function(property) {

                    if (property.shorthand || property.method || property.kind !== 'init') {
                        return;
                    }

                    checkSpaceMissing(property.key);

                    //Strategy for nested structures
                    var propValue = property.value;

                    if (!propValue) {
                        return;
                    }

                    letsCheckThisOne(propValue);
                });
            }

            if (item.type === 'ArrayPattern') {
                item.elements.forEach(letsCheckThisOne);
            }
        };

        file.iterateNodesByType(['VariableDeclaration', 'AssignmentExpression'], function(node) {

            if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(function(declaration) {
                    letsCheckThisOne(declaration.id || {});
                });
            }

            if (node.type === 'AssignmentExpression') {
                var left = node.left;

                if (left) {
                    letsCheckThisOne(left);
                }
            }
        });
    }
};
