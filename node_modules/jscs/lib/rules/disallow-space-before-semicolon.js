/**
 * Disallows spaces before semicolons.
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true` to disallow any spaces before any semicolon.
 *  - `Object`:
 *      - `"allExcept"`: `[ "(" ]` list of tokens that can occur after semicolon
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceBeforeSemicolon": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = 1;
 * ```
 *
 * * ##### Valid for mode `{ "allExcept": [ "(" ] }`
 *
 * ```js
 * for ( ; nodeIndex < nodesCount; ++nodeIndex ) {}
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = 1 ;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        var isObject = typeof value === 'object';

        var error = this.getOptionName() + ' rule requires string value true or object';

        if (isObject) {
            assert('allExcept' in value, error);
        } else {
            assert(value === true, error);
        }

        this._exceptions = {};

        if (isObject) {
            (value.allExcept || []).forEach(function(value) {
                this._exceptions[value] = true;
            }, this);
        }
    },

    getOptionName: function() {
        return 'disallowSpaceBeforeSemicolon';
    },

    check: function(file, errors) {
        var exceptions = this._exceptions;

        file.iterateTokensByTypeAndValue('Punctuator', ';', function(token) {
            var prevToken = file.getPrevToken(token);

            if (!prevToken || prevToken.value in exceptions) {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: prevToken,
                nextToken: token,
                message: 'Illegal space before semicolon'
            });
        });
    }

};
