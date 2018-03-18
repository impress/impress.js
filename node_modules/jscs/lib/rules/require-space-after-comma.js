/**
 * Requires space after comma
 *
 * Types: `Boolean`, or `Object`
 *
 * Values:
 *  - `Boolean`: `true` to require a space after any comma
 *  - `Object`:
 *    - `"allExcept"` array of exceptions:
 *      - `"trailing"` ignore trailing commas
 *
 * #### Example
 *
 * ```js
 * "requireSpaceAfterComma": true
 * ```
 * ```
 * "requireSpaceAfterComma": {"allExcept": ["trailing"]}
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
 * var a,b;
 * ```
 *
 *##### Valid for mode `{"allExcept": ["trailing"]}`
 *
 * ```js
 * var a = [1, 2,];
 * ```
 *
 * ##### Invalid for mode `{"allExcept": ["trailing"]}`
 *
 * ```js
 * var a = [a,b,];
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
        this._exceptTrailingCommas = options.allExcept.indexOf('trailing') >= 0;
    },

    getOptionName: function() {
        return 'requireSpaceAfterComma';
    },

    check: function(file, errors) {
        var exceptTrailingCommas = this._exceptTrailingCommas;
        file.iterateTokensByTypeAndValue('Punctuator', ',', function(token) {
            if (exceptTrailingCommas && [']', '}'].indexOf(file.getNextToken(token).value) >= 0) {
                return;
            }
            errors.assert.whitespaceBetween({
                token: token,
                nextToken: file.getNextToken(token),
                message: 'Space required after comma'
            });
        });
    }

};
