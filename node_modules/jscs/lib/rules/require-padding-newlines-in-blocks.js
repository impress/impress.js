/**
 * Requires blocks to begin and end with 2 newlines
 *
 * Types: `Boolean`, `Integer`, `Object`
 *
 * Values:
 *  - `true` validates all non-empty blocks
 *  - `Integer` specifies a minimum number of lines containing elements in the block before validating
 *  - `Object` (at least one of properties must be true):
 *      - `'open'`
 *          - `true` validates that there is a newline after the opening brace in a block
 *          - `false` ignores the newline validation after the opening brace in a block
 *      - `'close'`
 *          - `true` validates that there is a newline before the closing brace in a block
 *          - `false` ignores the newline validation before the closing brace in a block
 *      - `'allExcept'` array of exceptions:
 *          - `'conditionals'` ignores conditional (if, else if, else) blocks
 *          - `'functions'` ignores function blocks
 *
 * #### Example
 *
 * ```js
 * "requirePaddingNewlinesInBlocks": true
 * "requirePaddingNewlinesInBlocks": 1
 * "requirePaddingNewlinesInBlocks": { "open": true, "close": false }
 * "requirePaddingNewlinesInBlocks": { "allExcept": [ "conditionals" ] }
 * "requirePaddingNewlinesInBlocks": { "open": true, "close": false, allExcept: ['conditionals'] }
 * ```
 *
 * ##### Valid for mode `true` or `{ "open": true, "close": true }`
 *
 * ```js
 * if (true) {
 *
 *     doSomething();
 *
 * }
 * var abc = function() {};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (true) {doSomething();}
 * if (true) {
 *     doSomething();
 * }
 * ```
 *
 * ##### Valid for mode `1`
 *
 * ```js
 * if (true) {
 *
 *     doSomething();
 *     doSomethingElse();
 *
 * }
 * if (true) {
 *     doSomething();
 * }
 * if (true) { doSomething(); }
 * var abc = function() {};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (true) { doSomething(); doSomethingElse(); }
 * if (true) {
 *     doSomething();
 *     doSomethingElse();
 * }
 *  ```
 *
 * ##### Valid for mode `{ "open": true, "close": false }`
 *
 * ```js
 * if (true) {
 *
 *     doSomething();
 * }
 * var abc = function() {};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (true) {doSomething();}
 * if (true) {
 *     doSomething();
 * }
 * if (true) {
 *     doSomething();
 *
 * }
 * ```
 *
 * ##### Valid for `{ allExcept: ['conditionals'] }`
 *
 * ```js
 * if (true) {
 *     doSomething();
 * }
 *
 * function (foo) {
 *
 *     return bar;
 *
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function (foo) {
 *     return bar;
 * }
 * ```
 *
 * ##### Valid for `{  "open": true, "close": false, allExcept: ['conditionals'] }`
 *
 * ```js
 * function (foo) {
 *
 *     return bar;
 * }
 *
 * if (true) {
 *     doSomething();
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function (foo) {
 *     return bar;
 *
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        var optionName = this.getOptionName();

        assert(
            options === true || typeof options === 'number' || typeof options === 'object',
            optionName + ' option requires the value true, an Integer or an object'
        );

        this._checkOpen = true;
        this._checkClose = true;
        this._minLines = 0;

        if (typeof options === 'object') {
            assert(options.allExcept || options.open || options.close,
            optionName + 'option requires either "open", "close", "allExcept"');

            if (options.allExcept) {
                assert(Array.isArray(options.allExcept), optionName + ' option requires "allExcept" to be an array');
                assert(options.allExcept.length > 0, optionName + ' option requires "allExcept" to have at least one ' +
                'item or be set to `true`');
                this._exceptConditionals = options.allExcept.indexOf('conditionals') > -1;
                this._exceptFunctions = options.allExcept.indexOf('functions') > -1;
            }

            if (options.open || options.close) {
                assert(typeof options.open === 'boolean' && typeof options.close === 'boolean',
                  this.getOptionName() + ' option requires the "open" and "close" ' +
                  'properties to be booleans');

                this._checkOpen = options.open;
                this._checkClose = options.close;
            }
        } else if (typeof options === 'number') {
            this._minLines = options;
        } else {
            assert(options === true, this.getOptionName() + ' option requires either a true value, or an object');
        }
    },

    getOptionName: function() {
        return 'requirePaddingNewlinesInBlocks';
    },

    check: function(file, errors) {
        var minLines = this._minLines;
        var exceptConditionals = this._exceptConditionals;
        var exceptFunctions = this._exceptFunctions;
        var checkOpen = this._checkOpen;
        var checkClose = this._checkClose;

        file.iterateNodesByType('BlockStatement', function(node) {
            var openingBracket;
            var closingBracket;

            if (node.body.length <= minLines) {
                return;
            }

            if (exceptConditionals && node.parentNode.type === 'IfStatement' ||
                exceptFunctions && (node.parentNode.type === 'FunctionExpression' ||
                node.parentNode.type === 'FunctionDeclaration')) {
                return;
            }

            if (checkOpen === true) {
                openingBracket = file.getFirstNodeToken(node);

                errors.assert.linesBetween({
                    token: openingBracket,
                    nextToken: file.getNextToken(openingBracket, {includeComments: true}),
                    atLeast: 2,
                    message: 'Expected a padding newline after opening curly brace'
                });
            }

            if (checkClose === true) {
                closingBracket = file.getLastNodeToken(node);

                errors.assert.linesBetween({
                    token: file.getPrevToken(closingBracket, {includeComments: true}),
                    nextToken: closingBracket,
                    atLeast: 2,
                    message: 'Expected a padding newline before closing curly brace'
                });
            }
        });
    }
};
