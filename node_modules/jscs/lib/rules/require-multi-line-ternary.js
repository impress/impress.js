/**
 * Requires the test, consequent and alternate to be on separate lines when using the ternary operator.
 *
 * Types: `Boolean`
 *
 * #### Example
 *
 * ```js
 * "requireMultiLineTernary": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var foo = (a === b)
 *   ? 1
 *   : 2;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var foo = (a === b) ? 1 : 2;
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
        return 'requireMultiLineTernary';
    },

    check: function(file, errors) {
        file.iterateNodesByType('ConditionalExpression', function(node) {

            errors.assert.differentLine({
                token: node.test,
                nextToken: node.consequent,
                message: 'Missing new line after test'
            });

            errors.assert.differentLine({
                token: node.consequent,
                nextToken: node.alternate,
                message: 'Missing new line after consequent'
            });

        });
    }

};
