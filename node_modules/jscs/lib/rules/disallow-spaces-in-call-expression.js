/**
 * Disallows space before `()` in call expressions.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInCallExpression": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = foobar();
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = foobar ();
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
        return 'disallowSpacesInCallExpression';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['CallExpression', 'NewExpression'], function(node) {
            function doesTokenBelongToNode(token, node) {
                return token.range[1] <= node.range[1];
            }

            var lastCalleeToken = file.getLastNodeToken(node.callee);
            var roundBraceToken = file.findNextToken(lastCalleeToken, 'Punctuator', '(');

            // CallExpressions can't have missing parens, otherwise they're identifiers
            if (node.type === 'NewExpression') {
                if (roundBraceToken === null || !doesTokenBelongToNode(roundBraceToken, node)) {
                    return;
                }
            }

            errors.assert.noWhitespaceBetween({
                token: file.getPrevToken(roundBraceToken),
                nextToken: roundBraceToken,
                message: 'Illegal space before opening round brace'
            });
        });
    }
};
