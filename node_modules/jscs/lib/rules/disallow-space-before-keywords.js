/**
 * Disallows space before keyword.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted keywords or `true` to disallow spaces before all possible keywords.
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBeforeKeywords": [
 *     "else",
 *     "catch"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * }else {
 *     y--;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * } else {
 *     y--;
 * }
 * ```
 */

var assert = require('assert');

var defaultKeywords = require('../utils').spacedKeywords;

module.exports = function() {};

module.exports.prototype = {

    configure: function(keywords) {
        assert(
            Array.isArray(keywords) || keywords === true,
            this.getOptionName() + ' option requires array or true value');

        if (keywords === true) {
            keywords = defaultKeywords;
        }

        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'disallowSpaceBeforeKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var prevToken = file.getPrevToken(token, {includeComments: true});
            if (!prevToken || prevToken.isComment) {
                return;
            }

            if (prevToken.type !== 'Keyword' && prevToken.value !== ';') {
                errors.assert.noWhitespaceBetween({
                    token: prevToken,
                    nextToken: token,
                    message: 'Illegal space before "' + token.value + '" keyword'
                });
            }
        });
    }

};
