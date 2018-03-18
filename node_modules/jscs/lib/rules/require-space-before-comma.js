/**
 * Requires space before comma
 *
 * Types: `Boolean`
 *
 * Values: `true` to require a space before any comma
 *
 * #### Example
 *
 * ```js
 * "requireSpaceBeforeComma": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a ,b;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a,b;
 * ```
 */

var assert = require('assert');

module.exports = function() {
};

module.exports.prototype = {

    configure: function(option) {
        assert(
            option === true,
            this.getOptionName() + ' option requires true value'
        );
    },

    getOptionName: function() {
        return 'requireSpaceBeforeComma';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
            var prevToken = file.getPrevToken(token);

            errors.assert.whitespaceBetween({
                token: prevToken,
                nextToken: token,
                message: 'Space required before comma'
            });
        });
    }

};
