/**
 * Requires space before `()` or `{}` in anonymous function expressions.
 *
 * Type: `Object`
 *
 * Values:
 *  - `Object` with the following properties. One of `"beforeOpeningRoundBrace"`
 *    and `"beforeOpeningCurlyBrace"` must be provided:
 *      - `"beforeOpeningRoundBrace"` validates that there is a space before
 *        the opening round brace `()`. If provided, it must be set to `true`.
 *      - `"beforeOpeningCurlyBrace"` validates that there is a space before
 *        the opening curly brace `{}`. If provided, it must be set to `true`.
 *      - `"allExcept"` may be an Array containing `"shorthand"`, or
 *        the Boolean `true` to enable all configuration exceptions. If
 *        `"shorthand"` is provided, spaces will not be required for
 *        ES6 method definitions.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInAnonymousFunctionExpression": {
 *     "beforeOpeningRoundBrace": true,
 *     "beforeOpeningCurlyBrace": true
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var foo = function () {};
 * var Foo = {
 *     foo: function () {}
 * }
 * array.map(function () {});
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var foo = function() {};
 * var Foo = {
 *     foo: function (){}
 * }
 * array.map(function(){});
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        this._exceptions = {
            'shorthand': false
        };

        assert(
            typeof options === 'object',
            this.getOptionName() + ' option must be the object'
        );

        if ('beforeOpeningRoundBrace' in options) {
            assert(
                options.beforeOpeningRoundBrace === true,
                this.getOptionName() + '.beforeOpeningRoundBrace ' +
                'property requires true value or should be removed'
            );
        }

        if ('beforeOpeningCurlyBrace' in options) {
            assert(
                options.beforeOpeningCurlyBrace === true,
                this.getOptionName() + '.beforeOpeningCurlyBrace ' +
                'property requires true value or should be removed'
            );
        }

        if ('allExcept' in options) {
            if (typeof options.allExcept === 'object') {
                assert(
                    Array.isArray(options.allExcept),
                    this.getOptionName() + ' option requires "allExcept" to be ' +
                    'an array'
                );
                assert(
                    options.allExcept.length > 0,
                    this.getOptionName() + ' option requires "allExcept" to have ' +
                    'at least one item or be set to `true`'
                );
                options.allExcept.forEach(function(except) {
                    if (except === 'shorthand') {
                        this._exceptions.shorthand = true;
                    } else {
                        assert(false, this.getOptionName() + ' option requires ' +
                        '"allExcept" to be an array containing "shorthand"');
                    }
                }, this);
            } else {
                assert(
                    options.allExcept === true,
                    this.getOptionName() + ' option requires a true value or array'
                );
                this._exceptions.shorthand = true;
            }
        }

        assert(
            options.beforeOpeningCurlyBrace || options.beforeOpeningRoundBrace,
            this.getOptionName() + ' must have beforeOpeningCurlyBrace ' +
            ' or beforeOpeningRoundBrace property'
        );

        this._beforeOpeningRoundBrace = Boolean(options.beforeOpeningRoundBrace);
        this._beforeOpeningCurlyBrace = Boolean(options.beforeOpeningCurlyBrace);
    },

    getOptionName: function() {
        return 'requireSpacesInAnonymousFunctionExpression';
    },

    check: function(file, errors) {
        var beforeOpeningRoundBrace = this._beforeOpeningRoundBrace;
        var beforeOpeningCurlyBrace = this._beforeOpeningCurlyBrace;
        var exceptions = this._exceptions;

        file.iterateNodesByType(['FunctionExpression'], function(node) {
            var functionNode = node;
            var parent = node.parentNode;

            // Ignore syntactic sugar for getters and setters.
            if (parent.type === 'Property' && (parent.kind === 'get' || parent.kind === 'set')) {
                return;
            }

            // shorthand or constructor methods
            if (parent.method || parent.type === 'MethodDefinition') {
                functionNode = parent.key;
                if (exceptions.shorthand) {
                    return;
                }
            }

            // anonymous function expressions only
            if (node.id) {
                return;
            }

            if (beforeOpeningRoundBrace) {
                var functionToken = file.getFirstNodeToken(functionNode);
                if (node.async && functionToken.value === 'async') {
                    functionToken = file.getNextToken(functionToken);
                }
                // if generator, set token to be * instead
                if (node.generator && functionToken.value === 'function') {
                    functionToken = file.getNextToken(functionToken);
                }
                errors.assert.whitespaceBetween({
                    token: functionToken,
                    nextToken: file.getNextToken(functionToken),
                    message: 'Missing space before opening round brace'
                });
            }

            if (beforeOpeningCurlyBrace) {
                var bodyToken = file.getFirstNodeToken(node.body);
                errors.assert.whitespaceBetween({
                    token: file.getPrevToken(bodyToken),
                    nextToken: bodyToken,
                    message: 'Missing space before opening curly brace'
                });
            }
        });
    }

};
