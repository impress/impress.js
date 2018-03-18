/**
 * Disallows spaces before commas
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *   - `Boolean`: `true` to disallow any spaces before any comma
 *   - `Object`: `"allExcept"` array of exceptions
 *     - `"sparseArrays"` to allow spaces in place of absent values in sparse arrays
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBeforeComma": true
 * ```
 * ```js
 * "disallowSpaceBeforeComma": {"allExcept": ["sparseArrays"]}
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var a, b;
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * var a ,b;
 * ```
 * ```js
 * [a, b, , , c]
 * ```
 * ##### Valid for mode `{"allExcept": ["sparseArrays"]}`
 *
 * ```js
 * [a, b, , , c]
 * ```
 *
 * ##### Invalid for mode  `{"allExcept": ["sparseArrays"]}`
 *
 * ```js
 * [a , b , , , c]
 * ```
 *
 */

var assert = require('assert');

module.exports = function() {
};

module.exports.prototype = {

    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
                options === true,
                this.getOptionName() + ' option requires true value or an object'
            );
            var _options = {allExcept: []};
            return this.configure(_options);
        }

        assert(
            Array.isArray(options.allExcept),
            ' property `allExcept` in ' + this.getOptionName() + ' should be an array of strings'
        );
        this._exceptSparseArrays = options.allExcept.indexOf('sparseArrays') >= 0;
    },

    getOptionName: function() {
        return 'disallowSpaceBeforeComma';
    },

    check: function(file, errors) {
        var exceptSparseArrays = this._exceptSparseArrays;
        file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
            var prevToken = file.getPrevToken(token);

            if (exceptSparseArrays && prevToken.value === ',') {
                return;
            }
            errors.assert.noWhitespaceBetween({
                token: prevToken,
                nextToken: token,
                message: 'Illegal space before comma'
            });
        });
    }

};
