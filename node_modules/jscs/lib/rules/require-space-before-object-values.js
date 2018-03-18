/**
 * Requires space after object keys.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireSpaceBeforeObjectValues": true
 * ```
 *
 * ##### Valid
 * ```js
 * var x = {a: 1};
 * ```
 * ##### Invalid
 * ```js
 * var x = {a:1};
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
        return 'requireSpaceBeforeObjectValues';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ObjectExpression', function(node) {
            node.properties.forEach(function(property) {
                if (property.shorthand || property.method || property.kind !== 'init' ||
                    node.type === 'SpreadProperty') {
                    return;
                }

                var keyToken = file.getFirstNodeToken(property.key);

                var colon = file.findNextToken(keyToken, 'Punctuator', ':');

                errors.assert.whitespaceBetween({
                    token: colon,
                    nextToken: file.getNextToken(colon),
                    message: 'Missing space after key colon'
                });
            });
        });
    }

};
