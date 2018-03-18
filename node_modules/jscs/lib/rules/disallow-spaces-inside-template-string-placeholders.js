/**
 * Disallows spaces before and after curly brace inside template string placeholders.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInsideTemplateStringPlaceholders": true
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * `Hello ${name}!`
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * `Hello ${ name}!`
 * `Hello ${name }!`
 * `Hello ${ name }!`
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
        return 'disallowSpacesInsideTemplateStringPlaceholders';
    },

    check: function(file, errors) {
        file.iterateNodesByType('TemplateLiteral', function(node) {
            var first = file.getFirstNodeToken(node);
            var last = file.getLastNodeToken(node);

            // Iterate over tokens inside TemplateLiteral node.
            for (var token = first; ; token = file.getNextToken(token)) {
                if (containsPlaceholderStart(token)) {
                    var nextFist = file.getNextToken(token, {includeWhitespace: true});
                    if (nextFist.isWhitespace) {
                        errors.assert.noWhitespaceBetween({
                            token: token,
                            nextToken: file.getNextToken(token),
                            message: 'Illegal space after "${"'
                        });
                    }
                }

                if (containsPlaceholderEnd(token)) {
                    var prevLast = file.getPrevToken(token, {includeWhitespace: true});
                    if (prevLast.isWhitespace) {
                        errors.assert.noWhitespaceBetween({
                            token: file.getPrevToken(token),
                            nextToken: token,
                            message: 'Illegal space before "}"'
                        });
                    }
                }

                if (token === last) {
                    return;
                }
            }
        });
    }
};

/**
 * @param {Object} token
 * @returns {Boolean}
 */
function containsPlaceholderStart(token) {
    return token.type === 'Template' && /\${$/.test(token.value);
}

/**
 * @param {Object} token
 * @returns {Boolean}
 */
function containsPlaceholderEnd(token) {
    return token.type === 'Template' && /^}/.test(token.value);
}
