/**
 * Disallows placing object keys on new line
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowObjectKeysOnNewLine": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = {
 *     b: 'b', c: 'c'
 * };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = {
 *     b: 'b',
 *     c: 'c'
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
        return 'disallowObjectKeysOnNewLine';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ObjectExpression', function(node) {
            for (var i = 1; i < node.properties.length; i++) {
                var lastValueToken = file.getLastNodeToken(node.properties[i - 1].value);
                var comma = file.findNextToken(lastValueToken, 'Punctuator', ',');

                var firstKeyToken = file.getFirstNodeToken(node.properties[i].key);

                errors.assert.sameLine({
                    token: comma,
                    nextToken: firstKeyToken,
                    message: 'Object keys must go on a new line'
                });
            }
        });
    }
};
