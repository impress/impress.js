/**
 * Disallow a newline after blocks
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowPaddingNewLinesAfterBlocks": true
 * ```
 *
 * ##### Valid
 *
 * ```js
  * function () {
 *     for (var i = 0; i < 2; i++) {
 *         if (true) {
 *             return false;
 *         }
 *         continue;
 *     }
 *     var obj = {
 *         foo: function() {
 *             return 1;
 *         },
 *         bar: function() {
 *             return 2;
 *         }
 *     };
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function () {
 *     for (var i = 0; i < 2; i++) {
 *         if (true) {
 *             return false;
 *         }
 *
 *         continue;
 *     }
 *
 *     var obj = {
 *         foo: function() {
 *             return 1;
 *         },
 *
 *         bar: function() {
 *             return 2;
 *         }
 *     };
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        assert(
            value === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowPaddingNewLinesAfterBlocks';
    },

    check: function(file, errors) {
        file.iterateNodesByType('BlockStatement', function(node) {
            var endToken = file.getLastNodeToken(node);
            var nextToken = file.getNextToken(endToken);

            while (nextToken.type !== 'EOF') {
                if (endToken.loc.end.line === nextToken.loc.start.line) {
                    endToken = nextToken;
                    nextToken = file.getNextToken(nextToken);
                    continue;
                }

                errors.assert.linesBetween({
                    token: endToken,
                    nextToken: nextToken,
                    atMost: 1,
                    message: 'Extra newline after closing curly brace'
                });

                return;
            }
        });
    }
};
