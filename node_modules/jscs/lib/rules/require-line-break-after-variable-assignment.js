/**
 * Requires placing line feed after assigning a variable.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireLineBreakAfterVariableAssignment": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var abc = 8;
 * var foo = 5;
 *
 * var a, b, c,
 *     foo = 7,
 *     bar = 8;
 *
 * var a,
 *     foo = 7,
 *     a, b, c,
 *     bar = 8;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var abc = 8; var foo = 5;
 *
 * var a, b, c,
 *     foo = 7, bar = 8;
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
        return 'requireLineBreakAfterVariableAssignment';
    },

    check: function(file, errors) {
        var lastDeclaration;
        file.iterateNodesByType('VariableDeclaration', function(node) {
            if (node.parentNode.type === 'ForStatement' ||
                node.parentNode.type === 'ForInStatement' ||
                node.parentNode.type === 'ForOfStatement') {
                return;
            }

            for (var i = 0; i < node.declarations.length; i++) {
                var thisDeclaration = node.declarations[i];
                if (thisDeclaration.parentNode.kind === 'var' ||
                    thisDeclaration.parentNode.kind === 'let' ||
                    thisDeclaration.parentNode.kind === 'const') {
                    if (lastDeclaration && lastDeclaration.init) {
                        errors.assert.differentLine({
                            token: lastDeclaration,
                            nextToken: thisDeclaration,
                            message: 'Variable assignments should be followed by new line'
                        });
                    }
                    lastDeclaration = thisDeclaration;
                }
            }
        });
    }

};
