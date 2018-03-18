/**
 * Disallows usage of specified keywords.
 *
 * Type: `Array`
 *
 * Values: Array of quoted keywords
 *
 * #### Example
 *
 * ```js
 * "disallowKeywords": ["with"]
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * with (x) {
 *     prop++;
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
        return 'disallowKeywords';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Keyword', this._keywords, function(token) {
            errors.add(
                'Illegal keyword: ' + token.value,
                token.loc.start
            );
        });
    }

};
