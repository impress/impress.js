/**
 * Requires spaces inbetween for statement.
 *
 * Type: `Boolean`
 *
 * Value: `true` to requires spaces inbetween for statement.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInForStatement": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * for(var i = 0; i<l; i++) {
 *     x++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * for(var i = 0;i<l;i++) {
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
var TokenCategorizer = require('../token-categorizer');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireSpacesInForStatement';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ForStatement', function(node) {
            if (node.test) {
                var testToken = file.getFirstNodeToken(node.test);
                var prevToken = file.getPrevToken(testToken);

                if (prevToken.value === '(' &&
                    TokenCategorizer.categorizeOpenParen(prevToken, file) === 'ParenthesizedExpression') {
                    testToken = prevToken;
                    prevToken = file.getPrevToken(prevToken);
                }
                errors.assert.spacesBetween({
                    token: prevToken,
                    nextToken: testToken,
                    exactly: 1,
                    message: 'One space required after semicolon'
                });
            }
            if (node.update) {
                var updateToken = file.getFirstNodeToken(node.update);
                errors.assert.spacesBetween({
                    token: file.getPrevToken(updateToken),
                    nextToken: updateToken,
                    exactly: 1,
                    message: 'One space required after semicolon'
                });
            }
        });
    }
};
