/**
 * Requires an empty line above the specified keywords unless the keyword is the first expression in a block.
 *
 * Types: `Boolean` or `Array`
 *
 * Values:
 *
 * - `true` specifies that the spacedKeywords found in the utils module require an empty line above it
 * - `Array` specifies quoted keywords which require an empty line above it
 *
 * #### Example
 *
 * ```js
 * "requirePaddingNewlinesBeforeKeywords": [
 *     "do",
 *     "for",
 *     "if",
 *     "else"
 *     // etc
 * ]
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * function(a) {
 *     if (!a) {
 *         return false;
 *     }
 *
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *             return false;
 *         }
 *     }
 *
 *     while (a) {
 *         a = false;
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
 *         return false;
 *     }
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *             return false;
 *         }
 *     }
 *     while (a) {
 *         a = false;
 *     }
 *     return true;
 * }
 * ```
 *
 * ##### Valid for mode `['if', for']`
 *
 * ```js
 * function(a) {
 *     if (!a) {
 *         return false;
 *     }
 *
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *             return false;
 *         }
 *     }
 *     while (a) {
 *         a = false;
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
 *         return false;
 *     }
 *     for (var i = 0; i < b; i++) {
 *         if (!a[i]) {
 *             return false;
 *         }
 *     }
 *     while (a) {
 *         a = false;
 *     }
 *     return true;
 * }
 * ```
 *
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
        return 'requirePaddingNewlinesBeforeKeywords';
    },

    check: function(file, errors) {
        var excludedTokens = [':', ',', '(', '='];
        var specialCases = { 'if': 'else' };
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var prevToken = file.getPrevToken(token);
            // Handle special cases listed in specialCasesToken array
            if (prevToken && prevToken.value === specialCases[token.value]) {
                return;
            // Allow returning a function
            } else if (prevToken && prevToken.value === 'return' && token.value === 'function') {
                return;
            } else if (prevToken && token.value === 'while' &&
                file.getNodesByFirstToken(token).length === 0) {
                return;
            // Handle excludedTokens
            } else if (prevToken && excludedTokens.indexOf(prevToken.value) > -1) {
                return;
            }

            // Handle all other cases
            // The { character is there to handle the case of a matching token which happens to be the first
            //   statement in a block
            // The ) character is there to handle the case of `if (...) matchingKeyword` in which case
            //   requiring padding would break the statement
            if (prevToken && prevToken.value !== '{' && prevToken.value !== ')') {

                errors.assert.linesBetween({
                    token: prevToken,
                    nextToken: token,
                    atLeast: 2,
                    message: 'Keyword `' + token.value + '` should have an empty line above it'
                });
            }
        });
    }
};
