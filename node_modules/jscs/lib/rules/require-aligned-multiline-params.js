/**
 * Enforces indentation of parameters in multiline functions
 *
 * Types: `Boolean`, `String`, `Number`
 *
 * Values:
 *  - `true` to require parameters are aligned with the body of the function
 *  - `'firstParam'` to require parameters to be aligned with the first parameter
 *  - `Number` for the number of columns the parameters should be indented past the function body
 *
 * #### Example
 *
 * ```js
 * "requireAlignedMultilineParams": true
 * ```
 *
 * ##### Valid for `true`
 *
 * ```js
 * var test = function(one, two,
 *   three, four, five,
 *   six, seven, eight) {
 *   console.log(a);
 * };
 * ```
 *
 * ##### Valid for `2`
 *
 * ```js
 * var test = function(one, two,
 *     three, four, five,
 *     six, seven, eight) {
 *   console.log(a);
 * };
 * ```
 *
 * ##### Valid for `'firstParam'`
 *
 * ```js
 * var test = function(one, two,
 *                     three, four, five,
 *                     six, seven, eight) {
 *   console.log(a);
 * };
 * ```
 *
 * ##### Invalid for `0`
 *
 * ```js
 * var test = function(one, two,
 *     three, four, five,
 *     six, seven, eight) {
 *   console.log(a);
 * };
 * ```
 *
 */

var assert = require('assert');

module.exports = function() {
};

module.exports.prototype = {

    configure: function(option) {
        if (typeof option === 'number') {
            this._indentationLevel = option;
        } else if (typeof option === 'string') {
            assert(
                option === 'firstParam',
                this.getOptionName() + ' option requires string value to be "firstParam"'
            );

            this._alignWithFirstParam = true;
        } else if (option === true) {
            this._indentationLevel = 0;
        } else {
            assert(
                false,
                this.getOptionName() + ' option requires a valid option'
            );
        }
    },

    getOptionName: function() {
        return 'requireAlignedMultilineParams';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {
            var params = node.params;

            // We can pass the check if there's no params
            if (params.length === 0) {
                return;
            }

            var currentLine = params[0].loc.start.line;
            var referenceColumn;
            var body;

            if (_this._alignWithFirstParam) {
                referenceColumn = params[0].loc.start.column;
            } else {

                body = node.body.body[0];

                // If function doesn't have a body just bail out (#1988)
                if (!body) {
                    return;
                }

                referenceColumn = body.loc.start.column + _this._indentationLevel;
            }

            params.forEach(function(param) {
                if (param.loc.start.line !== currentLine) {
                    if (param.loc.start.column !== referenceColumn) {
                        errors.assert.indentation({
                            lineNumber: param.loc.start.line,
                            actual: param.loc.start.column,
                            expected: referenceColumn,
                            indentChar: ' ',
                            silent: false
                        });
                    }

                    currentLine = param.loc.start.line;
                }
            });

        });
    }

};
