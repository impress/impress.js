/**
 * Disallow spaces in between for statement.
 *
 * Type: `Boolean`
 *
 * Value: `true` to disallow spaces in between for statement.
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInForStatement": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * for(var i=0;i<l;i++) {
 *     x++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * for(var i = 0; i<l; i++) {
 *     x++;
 * }
 * ```
 *
 * ```js
 * for(var i = 0; i<l;i++) {
 *     x++;
 * }
 * ```
 *
 * ```js
 * for(var i = 0;i<l; i++) {
 *     x++;
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
        return 'disallowSpacesInForStatement';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ForStatement', function(node) {
            if (node.test) {
                var testToken = file.getFirstNodeToken(node.test);
                errors.assert.noWhitespaceBetween({
                    token: file.getPrevToken(testToken),
                    nextToken: testToken,
                    message: 'Space found after semicolon'
                });
            }
            if (node.update) {
                var updateToken = file.getFirstNodeToken(node.update);
                errors.assert.noWhitespaceBetween({
                    token: file.getPrevToken(updateToken),
                    nextToken: updateToken,
                    message: 'Space found after semicolon'
                });
            }
        });
    }
};
