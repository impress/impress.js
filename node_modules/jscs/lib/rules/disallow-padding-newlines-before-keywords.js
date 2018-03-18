/**
 * Disallow an empty line above the specified keywords.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted types or `true` to disallow padding new lines after all of the keywords below.
 *
 * #### Example
 *
 * ```js
 * "disallowPaddingNewlinesBeforeKeywords": [
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
 * function(a) {
 *     if (!a) {
 *         return false;
 *     }
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *             return false;
 *         }
 *     }
 *     return true;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function(a) {
 *     if (!a) {
 *
 *         return false;
 *     }
 *
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *
 *             return false;
 *         }
 *     }
 *
 *     return true;
 * }
 * ```
 */

var assert = require('assert');
var defaultKeywords = require('../utils').spacedKeywords;

module.exports = function() { };

module.exports.prototype = {

    configure: function(keywords) {
        assert(Array.isArray(keywords) || keywords === true,
            this.getOptionName() + ' option requires array or true value');

        if (keywords === true) {
            keywords = defaultKeywords;
        }

        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'disallowPaddingNewlinesBeforeKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            errors.assert.linesBetween({
                token: file.getPrevToken(token),
                nextToken: token,
                atMost: 1,
                message: 'Keyword `' + token.value + '` should not have an empty line above it'
            });
        });
    }
};
