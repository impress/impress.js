/**
 * Disallows the test, consequent and alternate to be on separate lines when using the ternary operator.
 *
 * Types: `Boolean`
 *
 * #### Example
 *
 * ```js
 * "disallowMultiLineTernary": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var foo = (a === b) ? 1 : 2;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var foo = (a === b)
 *   ? 1
 *   : 2;
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
        return 'disallowMultiLineTernary';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ConditionalExpression', function(node) {

            errors.assert.sameLine({
                token: node.test,
                nextToken: node.consequent,
                message: 'Illegal new line after test'
            });

            errors.assert.sameLine({
                token: node.consequent,
                nextToken: node.alternate,
                message: 'Illegal new line after consequent'
            });
        });
    }

};
