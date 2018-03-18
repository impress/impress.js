/**
 * Requires placing line feed at file end.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireLineFeedAtFileEnd": true
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
        return 'requireLineFeedAtFileEnd';
    },

    check: function(file, errors) {
        var lastToken = file.getLastToken({includeComments: true});
        var prevToken = file.getPrevToken(lastToken, {includeComments: true});
        errors.assert.differentLine({
            token: prevToken,
            nextToken: lastToken,
            message: 'Missing line feed at file end'
        });
    }

};
