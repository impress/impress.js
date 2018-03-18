/**
 * Requires placing keywords on a new line.
 *
 * Type: `Array`
 *
 * Values: Array of quoted keywords
 *
 * #### Example
 *
 * ```js
 * "requireKeywordsOnNewLine": ["else"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x < 0) {
 *     x++;
 * }
 * else {
 *     x--;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x < 0) {
 *     x++;
 * } else {
 *     x--;
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(keywords) {
        assert(Array.isArray(keywords), this.getOptionName() + ' option requires array value');
        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'requireKeywordsOnNewLine';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            errors.assert.differentLine({
                token: file.getPrevToken(token),
                nextToken: token
            });
        });
    }

};
