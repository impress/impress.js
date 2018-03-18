/**
 * Requires declaring objects via ES6 enhanced object literals
 *
 * Type: `Boolean`
 *
 * Values: true
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireEnhancedObjectLiterals": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var bar = true;
 * var obj = {
 *   foo() { },
 *   bar
 * };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var bar = true;
 * var obj = {
 *   foo: function() { },
 *   bar: bar
 * };
 * ```
 */

var assert = require('assert');

module.exports = function() { };

module.exports.prototype = {
    configure: function(option) {
        assert(option === true, this.getOptionName() + ' requires a true value');
    },

    getOptionName: function() {
        return 'requireEnhancedObjectLiterals';
    },

    check: function(file, errors) {
        file.iterateNodesByType('Property', function(node) {
            // node.key.name is used when the property key is an unquoted identifier
            // node.key.value is used when the property key is a quoted string
            var propertyName = node.key.name || node.key.value;
            var valueName = node.value.name;
            var shorthand = node.shorthand;
            var computed = node.computed;

            // check for non-shorthand properties
            if (propertyName && propertyName === valueName && !(shorthand || computed)) {
                errors.add(
                  'Property assignment should use enhanced object literal function.\n' +
                  ' `{ propName: propName }` is not allowed.',
                  node.loc.start
                );
            }

            // check for non-method function properties
            var valueType = node.value.type;
            var valueIsMethod = node.method;
            if (valueType === 'FunctionExpression' && !valueIsMethod) {
                errors.add(
                  'Property assignment should use enhanced object literal function.\n' +
                  ' `{ funcName: function() {} }` is not allowed.',
                  node.loc.start
                );
            }
        });
    }
};
