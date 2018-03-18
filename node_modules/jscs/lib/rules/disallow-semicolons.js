/**
 * Disallows lines from ending in a semicolon.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowSemicolons": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = 1
 * ;[b].forEach(c)
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = 1;
 * [b].forEach(c);
 * ```
 */

var assert = require('assert');

var nodeExceptions = {
    ForStatement: true
};

var tokenExceptions = {
    '[': true,
    '(': true
};

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowSemicolons';
    },

    check: function(file, errors) {
        file.iterateTokensByTypeAndValue('Punctuator', ';', function(token) {
            var nextToken = file.getNextToken(token);

            var node = file.getNodeByRange(token.range[0]);

            // Ignore node exceptions
            if (node.type in nodeExceptions) {
                return;
            }

            // Ignore next token exceptions
            if (nextToken.value in tokenExceptions) {
                return;
            }

            if (nextToken.type === 'EOF' || nextToken.loc.end.line > token.loc.end.line) {
                errors.cast({
                    message: 'semicolons are disallowed at the end of a line.',
                    line: token.loc.end.line,
                    column: token.loc.end.column,
                    additional: token
                });
            }
        });
    },

    _fix: function(file, error) {
        file.removeToken(error.additional);
    }
};
