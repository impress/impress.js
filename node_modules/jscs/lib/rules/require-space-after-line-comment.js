/**
 * Requires that a line comment (`//`) be followed by a space.
 *
 * Types: `Boolean`, `Object` or `String`
 *
 * Values:
 *  - `true`
 *  - `"allowSlash"` (*deprecated* use `"allExcept": ["/"]`) allows `/// ` format
 *  - `Object`:
 *     - `allExcept`: array of allowed strings before space `//(here) `
 *
 * #### Example
 *
 * ```js
 * "requireSpaceAfterLineComment": { "allExcept": ["#", "="] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // A comment
 * /*A comment*\/
 * //# sourceURL=filename.js
 * //= require something
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * //A comment
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true ||
            options === 'allowSlash' ||
            typeof options === 'object',
            this.getOptionName() + ' option requires a true value ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof options !== 'object' ||
            Array.isArray(options.allExcept) &&
            typeof options.allExcept[0] === 'string',
            'Property `allExcept` in ' + this.getOptionName() + ' should be an array of strings'
        );

        // don't check triple slashed comments, microsoft js doc convention. see #593
        // exceptions. see #592
        // need to drop allowSlash support in 2.0. Fixes #697
        this._allExcept = options === 'allowSlash' ? ['/'] :
            options.allExcept || [];
    },

    getOptionName: function() {
        return 'requireSpaceAfterLineComment';
    },

    check: function(file, errors) {
        var allExcept = this._allExcept;

        file.iterateTokensByType('Line', function(comment) {
            var value = comment.value;

            // cutout exceptions
            allExcept.forEach(function(el) {
                if (value.indexOf(el) === 0) {
                    value = value.substr(el.length);
                }
            });

            if (value.length === 0) {
                return;
            }

            if (value[0] !== ' ') {
                errors.add('Missing space after line comment', comment.loc.start);
            }
        });
    }
};
