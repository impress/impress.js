/**
 * Requires quoted keys in objects.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireQuotedKeysInObjects": true
 * ```
 *
 * ##### Valid
 *
 * ```js
  * var x = { 'a': { "default": 1 } };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = { a: 1 };
 * ```
 */

var assert = require('assert');

module.exports = function() { };

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireQuotedKeysInObjects';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ObjectExpression', function(node) {
            node.properties.forEach(function(property) {
                if (property.shorthand || property.method || property.kind !== 'init' ||
                    node.type === 'SpreadProperty') {
                    return;
                }

                var key = property.key;
                if (!(typeof key.value === 'string' && key.type === 'Literal')) {
                    errors.add('Object key without surrounding quotes', property.loc.start);
                }
            });
        });
    }
};
