/**
 * Disallows multiple blank lines in a row.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowMultipleLineBreaks": true
 * ```
 *
 * ##### Valid
 * ```js
 * var x = 1;
 *
 * x++;
 * ```
 *
 * ##### Invalid
 * ```js
 * var x = 1;
 *
 *
 * x++;
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
        return 'disallowMultipleLineBreaks';
    },

    check: function(file, errors) {
        // Iterate over all tokens (including comments)
        file.getTokens().forEach(function(token) {
            if (token.type === 'Whitespace') {
                return;
            }

            // If there are no trailing tokens, exit early
            var nextToken = file.getNextToken(token, {includeComments: true});
            if (!nextToken) {
                return;
            }

            errors.assert.linesBetween({
                token: token,
                nextToken: nextToken,
                atMost: 2
            });
        });
    }

};
