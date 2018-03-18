/**
 * Enable validation of separators between function parameters. Will ignore newlines.
 *
 * Type: `String`
 *
 * Values:
 *
 *  - `","`: function parameters are immediately followed by a comma
 *  - `", "`: function parameters are immediately followed by a comma and then a space
 *  - `" ,"`: function parameters are immediately followed by a space and then a comma
 *  - `" , "`: function parameters are immediately followed by a space, a comma, and then a space
 *
 * #### Example
 *
 * ```js
 * "validateParameterSeparator": ", "
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function a(b, c) {}
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function a(b , c) {}
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            typeof options === 'string' && /^[ ]?,[ ]?$/.test(options),
            this.getOptionName() + ' option requires string value containing only a comma and optional spaces'
        );

        this._separator = options;
    },

    getOptionName: function() {
        return 'validateParameterSeparator';
    },

    check: function(file, errors) {

        var separators = this._separator.split(',');
        var whitespaceBeforeComma = Boolean(separators.shift());
        var whitespaceAfterComma = Boolean(separators.pop());

        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {

            node.params.forEach(function(paramNode) {

                var prevParamToken = file.getFirstNodeToken(paramNode);
                var punctuatorToken = file.getNextToken(prevParamToken);

                if (punctuatorToken.value === ',') {

                    if (whitespaceBeforeComma) {
                        errors.assert.spacesBetween({
                            token: prevParamToken,
                            nextToken: punctuatorToken,
                            exactly: 1,
                            message: 'One space required after function parameter \'' + prevParamToken.value + '\''
                        });
                    } else {
                        errors.assert.noWhitespaceBetween({
                            token: prevParamToken,
                            nextToken: punctuatorToken,
                            message: 'Unexpected space after function parameter \'' + prevParamToken.value + '\''
                        });
                    }

                    var nextParamToken = file.getNextToken(punctuatorToken);

                    if (whitespaceAfterComma) {
                        errors.assert.spacesBetween({
                            token: punctuatorToken,
                            nextToken: nextParamToken,
                            exactly: 1,
                            message: 'One space required before function parameter \'' + nextParamToken.value + '\''
                        });
                    } else {
                        errors.assert.noWhitespaceBetween({
                            token: punctuatorToken,
                            nextToken: nextParamToken,
                            message: 'Unexpected space before function parameter \'' + nextParamToken.value + '\''
                        });
                    }
                }
            });
        });
    }

};
