/**
 * Disallows strings that span multiple lines without using concatenation.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * JSHint: [`multistr`](http://www.jshint.com/docs/options/#multistr)
 *
 * #### Example
 *
 * ```js
 * "disallowMultipleLineStrings": true
 * ```
 *
 * ##### Valid
 * ```js
 * var x = "multi" +
 *         "line";
 * var y = "single line";
 * ```
 *
 * ##### Invalid
 * ```js
 * var x = "multi \
 *         line";
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
        return 'disallowMultipleLineStrings';
    },

    check: function(file, errors) {
        file.iterateTokensByType('String', function(token) {
            if (token.loc.start.line !== token.loc.end.line) {
                errors.add(
                    'Multiline strings are disallowed.',
                    token.loc.start.line,
                    token.loc.start.column
                );
            }
        });
    }

};
