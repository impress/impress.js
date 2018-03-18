/**
 * Disallows space before `()` or `{}` in function expressions (both [named](#disallowspacesinnamedfunctionexpression)
 * and [anonymous](#disallowspacesinanonymousfunctionexpression)) and function declarations.
 *
 * Type: `Object`
 *
 * Values: `"beforeOpeningRoundBrace"` and `"beforeOpeningCurlyBrace"` as child properties.
 * Child properties must be set to `true`.
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInFunction": {
 *     "beforeOpeningRoundBrace": true,
 *     "beforeOpeningCurlyBrace": true
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = function(){};
 * var x = function a(){};
 * function a(){}
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = function() {};
 * var x = function (){};
 * var x = function () {};
 * var x = function a() {};
 * var x = function a (){};
 * var x = function a () {};
 * function a() {}
 * function a (){}
 * function a () {}
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
            this.getOptionName() + ' must have beforeOpeningCurlyBrace or beforeOpeningRoundBrace property'
        );

        this._beforeOpeningRoundBrace = Boolean(options.beforeOpeningRoundBrace);
        this._beforeOpeningCurlyBrace = Boolean(options.beforeOpeningCurlyBrace);
    },

    getOptionName: function() {
        return 'disallowSpacesInFunction';
    },

    check: function(file, errors) {
        var beforeOpeningRoundBrace = this._beforeOpeningRoundBrace;
        var beforeOpeningCurlyBrace = this._beforeOpeningCurlyBrace;

        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {
            // for a named function, use node.id
            var functionNode = node.id || node;
            var parent = node.parentNode;

            // Ignore syntactic sugar for getters and setters.
            if (parent.type === 'Property' && (parent.kind === 'get' || parent.kind === 'set')) {
                return;
            }

            // shorthand or constructor methods
            if (parent.method || parent.type === 'MethodDefinition') {
                functionNode = parent.key;
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
                errors.assert.noWhitespaceBetween({
                    token: functionToken,
                    nextToken: file.getNextToken(functionToken),
                    message: 'Illegal space before opening round brace'
                });
            }

            if (beforeOpeningCurlyBrace) {
                var bodyToken = file.getFirstNodeToken(node.body);
                errors.assert.noWhitespaceBetween({
                    token: file.getPrevToken(bodyToken),
                    nextToken: bodyToken,
                    message: 'Illegal space before opening curly brace'
                });
            }
        });
    }

};
