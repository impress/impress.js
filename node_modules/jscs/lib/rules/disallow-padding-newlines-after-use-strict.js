/**
 * Disallow a blank line after `'use strict';` statements
 *
 * Values: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowPaddingNewLinesAfterUseStrict": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * 'use strict';
 * // code
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * 'use strict';
 *
 * // code
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(disallowPaddingNewLinesAfterUseStrict) {
        assert(
            disallowPaddingNewLinesAfterUseStrict === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowPaddingNewLinesAfterUseStrict';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ExpressionStatement', function(node) {
            var expression = node.expression;

            if (expression.type !== 'Literal' || expression.value !== 'use strict') {
                return;
            }

            var endOfNode = file.getLastNodeToken(node);
            var nextToken = file.getNextToken(endOfNode, {
                includeComments: true
            });

            errors.assert.linesBetween({
                atMost: 1,
                token: endOfNode,
                nextToken: nextToken
            });
        });
    }
};
