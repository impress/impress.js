/**
 * Requires space before `()` in call expressions.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInCallExpression": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = foobar ();
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = foobar();
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
        return 'requireSpacesInCallExpression';
    },

    check: function(file, errors) {
        file.iterateNodesByType('CallExpression', function(node) {
            var lastCalleeToken = file.getLastNodeToken(node.callee);
            var roundBraceToken = file.findNextToken(lastCalleeToken, 'Punctuator', '(');

            errors.assert.whitespaceBetween({
                token: file.getPrevToken(roundBraceToken),
                nextToken: roundBraceToken,
                message: 'Missing space before opening round brace'
            });
        });
    }
};
