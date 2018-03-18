/**
 * Requires the first alphabetical character of a comment to be lowercase.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * `"disallowCapitalizedComments": true`
 *
 * Valid:
 *
 * ```
 * // valid
 * //valid
 *
 * /*
 *   valid
 *  *\/
 *
 * /**
 *  * valid
 *  *\/
 *
 * // 123 or any non-alphabetical starting character
 * ```
 *
 * Invalid:
 * ```
 * // Invalid
 * //Invalid
 * /** Invalid *\/
 * /**
 *  * Invalid
 *  *\/
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
        return 'disallowCapitalizedComments';
    },

    check: function(file, errors) {
        var letterPattern = require('../../patterns/L');
        var lowerCasePattern = require('../../patterns/Ll');

        file.iterateTokensByType(['Line', 'Block'], function(comment) {
            var stripped = comment.value.replace(/[\n\s\*]/g, '');
            var firstChar = stripped[0];

            if (letterPattern.test(firstChar) && !lowerCasePattern.test(firstChar)) {
                errors.add(
                    'Comments must start with a lowercase letter',
                    comment.loc.start
                );
            }
        });
    }
};
