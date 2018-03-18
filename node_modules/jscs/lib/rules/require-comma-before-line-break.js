/**
 * Requires commas as last token on a line in lists.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * JSHint: [`laxcomma`](http://www.jshint.com/docs/options/#laxcomma)
 *
 * #### Example
 *
 * ```js
 * "requireCommaBeforeLineBreak": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = {
 *     one: 1,
 *     two: 2
 * };
 * var y = { three: 3, four: 4};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = {
 *     one: 1
 *     , two: 2
 * };
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
        return 'requireCommaBeforeLineBreak';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
            var prevToken = file.getPrevToken(token);

            if (prevToken.value === ',') {
                return;
            }
            errors.assert.sameLine({
                token: prevToken,
                nextToken: token,
                message: 'Commas should not be placed on new line'
            });
        });
    }

};
