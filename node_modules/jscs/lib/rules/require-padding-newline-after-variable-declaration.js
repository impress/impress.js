/**
 * Requires an extra blank newline after var declarations, as long
 * as it is not the last expression in the current block.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requirePaddingNewLineAfterVariableDeclaration": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = {
 *     a: 1
 * };
 *
 * foo({
 *     a: {
 *         b: 1
 *     }
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = { a: 1 };
 * foo({a:{b:1}});
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(requirePaddingNewLineAfterVariableDeclaration) {
        assert(
            requirePaddingNewLineAfterVariableDeclaration === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requirePaddingNewLineAfterVariableDeclaration';
    },

    check: function(file, errors) {
        file.iterateNodesByType('VariableDeclaration', function(node) {
            if (node.parentNode.type === 'ForStatement' ||
                node.parentNode.type === 'ForInStatement' ||
                node.parentNode.type === 'ForOfStatement') {
                return;
            }

            var endOfDeclaration = file.getLastNodeToken(node);
            var nextToken = file.getNextToken(endOfDeclaration);

            // check export declaration
            if (nextToken.value === 'export') {
                nextToken = file.getNextToken(nextToken);
            }

            if (nextToken.value in {'var': true, 'let': true, 'const': true}) {
                return;
            }

            if (nextToken.value === '}') {
                return;
            }

            if (nextToken.type === 'EOF') {
                return;
            }

            errors.assert.linesBetween({
                atLeast: 2,
                token: endOfDeclaration,
                nextToken: nextToken
            });
        });
    }

};
