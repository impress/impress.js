/**
 * Requires space before keyword.
 *
 * Types: `Array`, `Boolean` or `Object`
 *
 * Values: `true` to require all possible keywords to have a preceding space (except `function`),
 * Array of quoted keywords
 * or an Object with the `allExcept` property set with an Array of quoted keywords.
 *
 * #### Example
 *
 * ```js
 * "requireSpaceBeforeKeywords": [
 *     "else",
 *     "while",
 *     "catch"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * } else {
 *     x++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * }else {
 *     x++;
 * }
 * ```
 */

var assert = require('assert');

var defaultKeywords = require('../utils').spacedKeywords;
var ignoredKeywords = ['function'];

module.exports = function() {};

module.exports.prototype = {

    configure: function(keywords) {
        var isValidObject = (keywords === Object(keywords) && keywords.hasOwnProperty('allExcept'));

        assert(
            Array.isArray(keywords) || keywords === true || isValidObject,
            this.getOptionName() + ' option requires array, object with "allExcept" property or true value');

        var excludedKeywords = ignoredKeywords;
        if (isValidObject) {
            excludedKeywords = keywords.allExcept;
        }

        if (!Array.isArray(keywords)) {
            keywords = defaultKeywords.filter(function(keyword) {
                return (excludedKeywords.indexOf(keyword) === -1);
            });
        }

        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'requireSpaceBeforeKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var prevToken = file.getPrevToken(token, {includeComments: true});
            if (!prevToken || prevToken.isComment) {
                return;
            }

            if (prevToken.type !== 'Punctuator' || prevToken.value !== ';') {
                errors.assert.whitespaceBetween({
                    token: prevToken,
                    nextToken: token,
                    message: 'Missing space before "' + token.value + '" keyword'
                });
            }
        });
    }

};
