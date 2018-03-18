/**
 * Disallows placing keywords on a new line.
 *
 * Types: `Array`
 *
 * Values:
 *
 * - `Array` specifies quoted keywords which are disallowed from being placed on a new line
 *
 * #### Example
 *
 * ```js
 * "disallowKeywordsOnNewLine": ["else"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x < 0) {
 *     x++;
 * } else {
 *     x--;
 * }
 * ```
 * ```js
 * if (x < 0)
 *     x++;
 * else
 *     x--;
 * ```
 * ```js
 * if (x < 0) {
 *     x++;
 * }
 * // comments
 * else {
 *     x--;
 * }
 * ```
 * ```js
 * do {
 *     x++;
 * } while(x < 0);
 * ```
 * ```js
 * do
 *     x++;
 * while(x < 0);
 * ```
 * ```js
 * do {
 *     x++;
 * }
 * // comments
 * while(x < 0);
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x < 0) {
 *     x++;
 * }
 * else {
 *     x--;
 * }
 * ```
 */

var assert = require('assert');

function isPreviousTokenAComment(token, file) {
    var prevToken = file.getPrevToken(token, {includeComments: true});
    return (prevToken.type === 'Line' || prevToken.type === 'Block');
}

module.exports = function() {};

module.exports.prototype = {

    configure: function(keywords) {
        assert(Array.isArray(keywords), this.getOptionName() + ' option requires array value');
        this._keywords = keywords;
    },

    getOptionName: function() {
        return 'disallowKeywordsOnNewLine';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            var prevToken = file.getPrevToken(token);

            if (token.value === 'else') {
                if (prevToken.value !== '}') {
                    // Special case for #905, even though it contradicts rule meaning,
                    // it makes more sense that way.
                    return;
                }

                if (isPreviousTokenAComment(token, file)) {
                    // Special case for #1421, to handle comments before the else
                    return;
                }
            }

            // Special cases for #885, using while as the keyword contradicts rule meaning
            // but it is more efficient and reduces complexity of the code in this rule
            if (token.value === 'while') {
                var nodes = file.getNodesByFirstToken(token);

                if (nodes.length === 0) {
                    // "while" that is part of a do will not return nodes as it is not a start token
                    if (prevToken.value !== '}') {
                        // allow "while" that is part of a "do while" with no braces to succeed
                        return;
                    }

                    if (isPreviousTokenAComment(token, file)) {
                        // Special case for #1421, to handle comments before the "while" of a "do while"
                        return;
                    }
                } else {
                    // it is a "while" statement that is not part of a "do while"
                    // , allow it to succeed even though it contradicts rule meaning
                    return;
                }
            }

            errors.assert.sameLine({
                token: prevToken,
                nextToken: token
            });
        });
    }

};
