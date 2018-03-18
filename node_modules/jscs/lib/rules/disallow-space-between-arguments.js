/**
 * Ensure there are no spaces after argument separators in call expressions.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBetweenArguments": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * a(b,c);
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * a(b, c);
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
        return 'disallowSpaceBetweenArguments';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['CallExpression'], function(node) {
            node.arguments.forEach(function(param) {
                var token = file.getFirstNodeToken(param);
                var punctuatorToken = file.getPrevToken(token);

                if (punctuatorToken.value === ',') {
                    errors.assert.noWhitespaceBetween({
                        token: punctuatorToken,
                        nextToken: file.getNextToken(punctuatorToken),
                        message: 'Illegal space between arguments'
                    });
                }
            });
        });
    }
};
