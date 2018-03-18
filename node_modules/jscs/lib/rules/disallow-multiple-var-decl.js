/**
 * Disallows multiple `var` declaration (except for-loop).
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *
 * - `true` disallows multiple variable declarations except within a for loop
 * - `Object`:
 *    - `'strict'` disallows all multiple variable declarations
 *    - `'allExcept'` array of exceptions:
 *       - `'undefined'` allows declarations where all variables are not defined
 *       - `'require'` allows declarations where all variables are importing external modules with require
 *
 * #### Example
 *
 * ```js
 * "disallowMultipleVarDecl": true
 * ```
 *
 * ##### Valid for `true`
 *
 * ```js
 * var x = 1;
 * var y = 2;
 *
 * for (var i = 0, j = arr.length; i < j; i++) {}
 * ```
 *
 * ##### Valid for `{ strict: true }`
 *
 * ```js
 * var x = 1;
 * var y = 2;
 * ```
 *
 * ##### Valid for `{ allExcept: ['undefined'] }`
 *
 * ```js
 * var a, b;
 * var x = 1;
 * var y = 2;
 *
 * for (var i = 0, j = arr.length; i < j; i++) {}
 * ```
 * ##### Valid for `{ allExcept: ['require'] }`
 *
 * ```js
 * var a = require('a'),
 *     b = require('b');
 *
 * var x = 1;
 * var y = 2;
 *
 * for (var i = 0, j = arr.length; i < j; i++) {}
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = 1,
 *     y = 2;
 *
 * var x, y = 2, z;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        // support for legacy options
        if (typeof options !== 'object') {
            assert(
                options === true ||
                options === 'strict' ||
                options === 'exceptUndefined',
                this.getOptionName() +
                    ' option requires a true value, "strict", "exceptUndefined", or an object'
            );

            var _options = {
                strict: options === 'strict',
                allExcept: []
            };

            if (options === 'exceptUndefined') {
                _options.allExcept.push('undefined');
            }

            return this.configure(_options);
        }

        if (Array.isArray(options.allExcept)) {
            this._exceptUndefined = options.allExcept.indexOf('undefined') > -1;
            this._exceptRequire = options.allExcept.indexOf('require') > -1;
        }

        this._strictMode = options.strict === true;
    },

    getOptionName: function() {
        return 'disallowMultipleVarDecl';
    },

    check: function(file, errors) {

        function isSourcedFromRequire(node) {
            // If this node is a CallExpression it has a callee,
            // check if this is the `require` function
            if (node.callee && node.callee.name === 'require') {
                return true;
            }

            // If this CallExpression is not a `require` we keep looking for
            // the `require` method up in the tree
            if (node.callee && node.callee.object) {
                return isSourcedFromRequire(node.callee.object);
            }

            // If there is no `callee` this might be a MemberExpression, keep
            // look for the `require` method up in the tree.
            if (node.object) {
                return isSourcedFromRequire(node.object);
            }

            return false;
        }

        var inStrictMode = this._strictMode;
        var exceptUndefined = this._exceptUndefined;
        var exceptRequire = this._exceptRequire;

        file.iterateNodesByType('VariableDeclaration', function(node) {
            var definedVariables = node.declarations.filter(function(declaration) {
                return !!declaration.init;
            });
            var hasDefinedVariables = definedVariables.length > 0;

            var requireStatements = node.declarations.filter(function(declaration) {
                var init = declaration.init;
                return init && isSourcedFromRequire(init);
            });
            var allRequireStatements = requireStatements.length === node.declarations.length;

            var isForStatement = node.parentNode.type === 'ForStatement';

            // allow single var declarations
            if (node.declarations.length === 1) {
                return;
            }

            // allow multiple var declarations in for statement unless we're in strict mode
            // for (var i = 0, j = myArray.length; i < j; i++) {}
            if (!inStrictMode && isForStatement) {
                return;
            }

            // allow multiple var declarations with all undefined variables in exceptUndefined mode
            // var a, b, c
            if (exceptUndefined && !hasDefinedVariables) {
                return;
            }

            // allow multiple var declaration with all require
            // var a = require("a"), b = require("b")
            if (exceptRequire && allRequireStatements) {
                return;
            }

            // allow multiple var declarations only with require && undefined
            // var a = require("a"), b = require("b"), x, y
            if (exceptUndefined && exceptRequire && definedVariables.length === requireStatements.length) {
                return;
            }

            errors.add('Multiple var declaration', node.loc.start);
        });
    }
};
