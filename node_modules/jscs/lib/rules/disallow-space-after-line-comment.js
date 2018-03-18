/**
 * Requires that a line comment (`//`) not be followed by a space.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceAfterLineComment": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * //A comment
 * /* A comment*\/
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * // A comment
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
        return 'disallowSpaceAfterLineComment';
    },

    check: function(file, errors) {
        file.iterateTokensByType('Line', function(comment) {
            var value = comment.value;
            if (value.length > 0 && value[0] === ' ') {
                errors.add('Illegal space after line comment', comment.loc.start);
            }
        });
    }
};
