/**
 * Disallows space after opening round bracket and before closing.
 *
 * Types: `Boolean` or `Object`
 *
 * Values: Either `true` or Object with `"only"` property as an array of tokens
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInsideParentheses": true
 * ```
 *
 * ##### Valid for `true` value
 *
 * ```js
 * var x = (1 + 2) * 3;
 * ```
 *
 * ##### Valid for `only` value
 *
 * ```js
 * "disallowSpacesInsideParentheses": { "only": [ "{", "}", "\"" ] }
 * ```
 * ```js
 * var x = ( 1 + 2 );
 * var x = foo({});
 * var x = foo("1");
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = foo( {} );
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(option) {
        var isObject = typeof option === 'object';

        var error = this.getOptionName() + ' option requires' +
            ' true or object value with "only" properties ';

        // backcompat for 1.10: {all: true} #1027
        if (isObject && option.all === true) {
            option = true;
        }

        if (typeof option === 'boolean') {
            assert(option === true, error);
        } else if (isObject) {
            assert('only' in option, error);
        } else {
            assert(false, error);
        }

        this._onlySingleQuote = false;
        this._onlyDoubleQuote = false;
        this._only = null;

        if (option.only) {
            this._only = {};

            (option.only).forEach(function(value) {
                if (value === '\'') {
                    this._onlySingleQuote = true;
                }

                if (value === '"') {
                    this._onlyDoubleQuote = true;
                }

                this._only[value] = true;
            }, this);
        }
    },

    getOptionName: function() {
        return 'disallowSpacesInsideParentheses';
    },

    check: function(file, errors) {
        var only = this._only;
        var singleQuote = this._onlySingleQuote;
        var doubleQuote = this._onlyDoubleQuote;

        file.iterateTokenByValue('(', function(token) {
            var nextToken = file.getNextToken(token, {includeComments: true});
            var value = nextToken.value;
            var shouldReturn = true;

            if (doubleQuote && nextToken.type === 'String' && value[0] === '"') {
                shouldReturn = false;
            }

            if (singleQuote && nextToken.type === 'String' && value[0] === '\'') {
                shouldReturn = false;
            }

            if (only && value in only) {
                shouldReturn = false;
            }

            if (!only) {
                shouldReturn = false;
            }

            if (shouldReturn) {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: token,
                nextToken: nextToken,
                message: 'Illegal space after opening round bracket'
            });
        });

        file.iterateTokenByValue(')', function(token) {
            var prevToken = file.getPrevToken(token, {includeComments: true});
            var value = prevToken.value;
            var shouldReturn = true;

            if (doubleQuote && prevToken.type === 'String' && value[value.length - 1] === '"') {
                shouldReturn = false;
            }

            if (singleQuote && prevToken.type === 'String' && value[value.length - 1] === '\'') {
                shouldReturn = false;
            }

            if (only) {
                if (value in only) {
                    shouldReturn = false;
                }

                if (
                    value === ']' &&
                    file.getNodeByRange(prevToken.range[0]).type === 'MemberExpression'
                ) {
                    shouldReturn = true;
                }
            } else {
                shouldReturn = false;
            }

            if (shouldReturn) {
                return;
            }

            errors.assert.noWhitespaceBetween({
                token: prevToken,
                nextToken: token,
                message: 'Illegal space before closing round bracket'
            });
        });
    }

};
