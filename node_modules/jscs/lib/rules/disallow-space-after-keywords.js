/**
 * Disallows space after keyword.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted keywords or `true` to disallow spaces after all possible keywords.
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceAfterKeywords": [
 *     "if",
 *     "else",
 *     "for",
 *     "while",
 *     "do",
 *     "switch",
 *     "try",
 *     "catch"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if(x > y) {
 *     y++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x > y) {
 *     y++;
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
            this.getOptionName() + ' option requires array or true value'
        );

        if (keywords === true) {
            keywords = defaultKeywords;
        }

        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'disallowSpaceAfterKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var nextToken = file.getNextToken(token);

            // Make an exception if the next token is not a Punctuator such as a Keyword or Identifier
            if (nextToken.type !== 'Punctuator') {
                return;
            }
            errors.assert.noWhitespaceBetween({
                token: token,
                nextToken: nextToken
            });
        });
    }

};
