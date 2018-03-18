/**
 * Disallows newline before line comments
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowPaddingNewLinesBeforeLineComments": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = 2;
 * // comment
 * return a;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = 2;
 *
 * //comment
 * return a;
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
        return 'disallowPaddingNewLinesBeforeLineComments';
    },

    check: function(file, errors) {
        file.iterateTokensByType('Line', function(comment) {
            if (comment.loc.start.line === 1) {
                return;
            }

            errors.assert.linesBetween({
                token: file.getPrevToken(comment, {includeComments: true}),
                nextToken: comment,
                atMost: 1,
                message: 'Line comments must not be preceded with a blank line'
            });
        });
    }
};
