/**
 * Requires space before `()` or `{}` in named function expressions.
 *
 * Types: `Object`
 *
 *  - `Object` (at least one of properties must be present and it must be set to true):
 *      - `'beforeOpeningRoundBrace'`
 *          - `true` validates that there is a space before `()`
 *      - `'beforeOpeningCurlyBrace'`
 *          - `true` validates that there is a space before `{}`
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInNamedFunctionExpression": {
 *     "beforeOpeningRoundBrace": true,
 *     "beforeOpeningCurlyBrace": true
 * }
 * ```
 * ```js
 * "requireSpacesInNamedFunctionExpression": {
 *     "beforeOpeningRoundBrace": true
 * }
 * ```
 * ```js
 * "requireSpacesInNamedFunctionExpression": {
 *     "beforeOpeningCurlyBrace": true
 * }
 * ```
 *
 * ##### Valid for mode `{ "beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true }`
 *
 * ```js
 * var x = function a () {};
 * ```
 *
 * ##### Valid for mode `{ "beforeOpeningRoundBrace": true }`
 *
 * ```js
 * var x = function a (){};
 * ```
 *
 * ##### Valid for mode `{ "beforeOpeningCurlyBrace": true }`
 *
 * ```js
 * var x = function a() {};
 * ```
 *
 * ##### Invalid for mode `{ "beforeOpeningRoundBrace": true, "beforeOpeningCurlyBrace": true }`
 *
 * ```js
 * var x = function a() {};
 * var x = function a (){};
 * var x = function a(){};
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
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

        assert(
            options.beforeOpeningCurlyBrace || options.beforeOpeningRoundBrace,
            this.getOptionName() + ' must have beforeOpeningCurlyBrace ' +
            'or beforeOpeningRoundBrace property'
        );

        this._beforeOpeningRoundBrace = Boolean(options.beforeOpeningRoundBrace);
        this._beforeOpeningCurlyBrace = Boolean(options.beforeOpeningCurlyBrace);
    },

    getOptionName: function() {
        return 'requireSpacesInNamedFunctionExpression';
    },

    check: function(file, errors) {
        var beforeOpeningRoundBrace = this._beforeOpeningRoundBrace;
        var beforeOpeningCurlyBrace = this._beforeOpeningCurlyBrace;

        file.iterateNodesByType(['FunctionExpression'], function(node) {
            var functionNode = node.id;
            var parent = node.parentNode;

            // Ignore syntactic sugar for getters and setters.
            if (parent.type === 'Property' && (parent.kind === 'get' || parent.kind === 'set')) {
                return;
            }

            // shorthand or constructor methods
            if (parent.method || parent.type === 'MethodDefinition') {
                functionNode = parent.key;
            }

            // named function expressions only
            if (node.id) {
                if (beforeOpeningRoundBrace) {
                    var functionToken = file.getFirstNodeToken(functionNode);
                    if (node.async && functionToken.value === 'async') {
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
            }
        });
    }

};
