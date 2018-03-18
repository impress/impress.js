/**
 * Requires newline before single if statements
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireNewlineBeforeSingleStatementsInIf": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x)
 *    doX();
 * else
 *    doY();
 *
 * if (x)
 *    doX();
 * else if (v)
 *    doV();
 * else
 *    doY();
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x) doX();
 * else doY();
 *
 * if (x) doX();
 * else if (v) doV();
 * else doY();
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
        return 'requireNewlineBeforeSingleStatementsInIf';
    },

    check: function(file, errors) {
        function isExpressionStatement(entity) {
            return entity.type === 'ExpressionStatement';
        }

        function assertDifferentLine(token, nextToken) {
            errors.assert.differentLine({
                token: token,
                nextToken: nextToken,
                message: 'Newline before single statement in if is required'
            });
        }

        file.iterateNodesByType('IfStatement', function(node) {
            var token;
            var consequentNode = node.consequent;
            var alternateNode = node.alternate;

            if (isExpressionStatement(consequentNode)) {
                token = file.getFirstNodeToken(consequentNode);

                assertDifferentLine(
                    consequentNode,
                    file.findPrevToken(token, 'Keyword')
                );
            }

            if (isExpressionStatement(alternateNode)) {
                token = file.getFirstNodeToken(alternateNode);

                assertDifferentLine(
                    alternateNode,
                    file.findPrevToken(token, 'Keyword')
                );
            }
        });
    }
};
