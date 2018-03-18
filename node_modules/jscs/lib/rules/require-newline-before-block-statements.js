/**
 * Requires newline before opening curly brace of all block statements.
 *
 * Type: `Boolean` or `Array`
 *
 * Values:
 *
 * - `true` always requires newline before curly brace of block statements
 * - `Array` specifies block-type keywords after which newlines are required before curly brace
 *     - Valid types include: `['if', 'else', 'try', 'catch', 'finally', 'do', 'while', 'for', 'function', 'switch']`
 *
 * #### Example
 *
 * ```js
 * "requireNewlineBeforeBlockStatements": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function good()
 * {
 *     var obj =
 *     {
 *         val: true
 *     };
 *
 *     return {
 *         data: obj
 *     };
 * }
 *
 * if (cond)
 * {
 *     foo();
 * }
 *
 * for (var e in elements)
 * {
 *     bar(e);
 * }
 *
 * while (cond)
 * {
 *     foo();
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function bad(){
 *     var obj = {
 *         val: true
 *     };
 *
 *     return {
 *         data: obj
 *     };
 * }
 *
 * if (cond){
 *     foo();
 * }
 *
 * for (var e in elements){
 *     bar(e);
 * }
 *
 * while (cond){
 *     foo();
 * }
 * ```
 *
 * #### Example
 *
 * ```js
 * "requireNewlineBeforeBlockStatements": ["if", "else", "for"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (i > 0)
 * {
 *     positive = true;
 * }
 *
 * if (i < 0)
 * {
 *     negative = true;
 * }
 * else
 * {
 *     negative = false;
 * }
 *
 * for (var i = 0, len = myList.length; i < len; ++i)
 * {
 *     newList.push(myList[i]);
 * }
 *
 * // this is fine, since "function" wasn't configured
 * function myFunc(x) {
 *     return x + 1;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (i < 0) {
 *     negative = true;
 * }
 *
 * if (i < 0) {
 *     negative = true;
 * } else {
 *     negative = false;
 * }
 *
 * for (var i = 0, len = myList.length; i < len; ++i) {
 *     newList.push(myList[i]);
 * }
 * ```
 *
 * #### Example
 *
 * ```js
 * "requireNewlineBeforeBlockStatements": ["function", "while"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function myFunc(x)
 * {
 *     return x + 1;
 * }
 *
 * var z = function(x)
 * {
 *     return x - 1;
 * }
 *
 * // this is fine, since "for" wasn't configured
 * for (var i = 0, len = myList.length; i < len; ++i) {
 *     newList.push(myList[i]);
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function myFunc(x) {
 *     return x + 1;
 * }
 *
 * var z = function(x) {
 *     return x - 1;
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(settingValue) {
        assert(
            Array.isArray(settingValue) && settingValue.length || settingValue === true,
            'requireNewlineBeforeBlockStatements option requires non-empty array value or true value'
        );

        this._setting = settingValue;
    },

    getOptionName: function() {
        return 'requireNewlineBeforeBlockStatements';
    },

    check: function(file, errors) {
        var setting = this._setting;

        function assertDifferentLine(token, nextToken) {
            errors.assert.differentLine({
                token: token,
                nextToken: nextToken,
                message: 'Newline before curly brace for block statement is required'
            });
        }

        file.iterateNodesByType('BlockStatement', function(node) {
            if (setting === true || setting.indexOf(getBlockType(node)) !== -1) {
                var openingBrace = file.getFirstNodeToken(node);
                var prevToken = file.getPrevToken(openingBrace);

                assertDifferentLine(prevToken, openingBrace);
            }
        });
        if (setting === true || setting.indexOf('switch') !== -1) {
            file.iterateNodesByType(['SwitchStatement'], function(node) {
                var openingBrace = file.findNextToken(file.getLastNodeToken(node.discriminant), 'Punctuator', '{');
                var prevToken = file.getPrevToken(openingBrace);

                assertDifferentLine(prevToken, openingBrace);
            });
        }
    }
};

function getBlockType(node) {
    var parentNode = node.parentNode;
    switch (parentNode.type) {
        case 'IfStatement':
            return (parentNode.alternate === node) ? 'else' : 'if';
        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
            return 'function';
        case 'ForStatement':
        case 'ForInStatement':
        case 'ForOfStatement':
            return 'for';
        case 'WhileStatement':
            return 'while';
        case 'DoWhileStatement':
            return 'do';
        case 'TryStatement':
            return (parentNode.finalizer === node) ? 'finally' : 'try';
        case 'CatchClause':
            return 'catch';
    }
}
