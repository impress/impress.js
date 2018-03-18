/**
 * Requires space after keyword.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted keywords or `true` to require all of the keywords below to have a space afterward.
 *
 * #### Example
 *
 * ```js
 * "requireSpaceAfterKeywords": [
 *     "do",
 *     "for",
 *     "if",
 *     "else",
 *     "switch",
 *     "case",
 *     "try",
 *     "catch",
 *     "void",
 *     "while",
 *     "with",
 *     "return",
 *     "typeof",
 *     "function"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x) {
 *     x++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if(x) {
 *     x++;
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
        return 'requireSpaceAfterKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var nextToken = file.getNextToken(token, {includeComments: true});

            if (nextToken.type === 'Punctuator' && nextToken.value === ';') {
                return;
            }

            errors.assert.spacesBetween({
                token: token,
                nextToken: nextToken,
                exactly: 1,
                message: 'One space required after "' + token.value + '" keyword'
            });
        });
    }

};
