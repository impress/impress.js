/**
 * Validates proper alignment of function parameters.
 *
 * Types: `Boolean`, `Object`
 *
 * Values:
 *  - `true`: setting this is the same as validating the rule using
 *    `{lineBreakAfterOpeningBrace: true, lineBreakBeforeClosingBrace: true}`
 *  - `Object`:
 *      - `lineBreakAfterOpeningBrace`
 *          - `true` specifies that the first function parameter must not be on the same line as the opening brace `(`
 *            of the function parameters list
 *      - `lineBreakBeforeClosingBrace`
 *          - `true` specifies that the last function parameter must not be on the same line as the closing brace `)`
 *            of the function parameters list
 *
 * #### Example
 *
 * ```js
 * "validateAlignedFunctionParameters": {
 *   "lineBreakAfterOpeningBrace": true,
 *   "lineBreakBeforeClosingBrace": true
 * }
 * ```
 *
 * ##### Valid for mode `{ "lineBreakAfterOpeningBrace": true, "lineBreakBeforeClosingBrace": true}`
 * ```js
 * function (
 *   thisIs,
 *   theLongestList,
 *   ofParametersEverWritten
 * ) {}
 * ```
 * ##### Invalid for mode `{ "lineBreakAfterOpeningBrace": true, "lineBreakBeforeClosingBrace": true}`
 * ```js
 * function (thisIs,
 *           theLongestList,
 *           ofParametersEverWritten) {}
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        var validProperties = [
            'lineBreakAfterOpeningBrace',
            'lineBreakBeforeClosingBrace'
        ];
        var optionName = this.getOptionName();

        assert(
            typeof options === 'object' || options === true,
            optionName + ' option must be an object or boolean true'
        );

        if (typeof options === 'object') {
            validProperties.forEach(function(key) {
                var isPresent = key in options;

                if (isPresent) {
                    assert(
                        options[key] === true,
                        optionName + '.' + key + ' property requires true value or should be removed'
                    );
                }
            });

            validProperties.forEach(function(property) {
                this['_' + property] = Boolean(options[property]);
            }.bind(this));
        }
    },

    getOptionName: function() {
        return 'validateAlignedFunctionParameters';
    },

    check: function(file, errors) {
        var lineBreakAfterOpeningBrace = this._lineBreakAfterOpeningBrace;
        var lineBreakBeforeClosingBrace = this._lineBreakBeforeClosingBrace;

        file.iterateNodesByType([
            'FunctionDeclaration',
            'FunctionExpression',
            'ArrowFunctionExpression'
        ], function(node) {

            // ignore this rule if there are no parameters
            if (node.params.length === 0) {
                return;
            }

            // ignore this rule if the parameters are not multi-line
            var firstParameter = file.getFirstNodeToken(node.params[0]);
            var lastParameter = node.params[node.params.length - 1];
            if (firstParameter.loc.start.line === lastParameter.loc.end.line) {
                return;
            }

            // look for the furthest parameter start position
            var maxParamStartPos = 0;
            node.params.forEach(function(parameter) {
                maxParamStartPos = Math.max(maxParamStartPos, parameter.loc.start.column);
            });

            // make sure all parameters are lined up
            node.params.forEach(function(parameter) {
                if (parameter.loc.start.column !== maxParamStartPos) {
                    errors.add('Multi-line parameters are not aligned.', parameter.loc.start);
                }
            });

            // make sure the first parameter is on a new line
            if (lineBreakAfterOpeningBrace) {
                var openingBrace = file.getPrevToken(firstParameter);
                errors.assert.differentLine({
                    token: openingBrace,
                    nextToken: firstParameter,
                    message: 'There is no line break after the opening brace'
                });
            }

            // make sure the closing brace is on a new line
            if (lineBreakBeforeClosingBrace) {
                var bodyToken = file.getFirstNodeToken(node.body);
                var closingBrace = file.getPrevToken(bodyToken);
                errors.assert.differentLine({
                    token: lastParameter,
                    nextToken: closingBrace,
                    message: 'There is no line break before the closing brace'
                });
            }

        });
    }

};
