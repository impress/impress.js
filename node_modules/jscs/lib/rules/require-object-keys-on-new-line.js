/**
 * Requires placing object keys on new line
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *     - `'allExcept'` array of exceptions:
 *       - `'sameLine'` ignores the rule if all the keys and values are on the same line
 *
 * #### Example
 *
 * ```js
 * "requireObjectKeysOnNewLine": true
 * "requireObjectKeysOnNewLine": {
 *     "allExcept": ["sameLine"]
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = {
 *     b: 'b',
 *     c: 'c'
 * };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = {
 *     b: 'b', c: 'c'
 * };
 * ```
 *
 * ##### Valid for `{ "allExcept": ["sameLine"] }`
 *
 * ```js
 * var a = {
 *     b: 'b', c: 'c'
 * };
 * ```
 *
 * ##### Invalid for `{ "allExcept": ["sameLine"] }`
 *
 * ```js
 * var a = {
 *     b: 'b', c: 'c',
 *     d: 'd'
 * };
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true || Array.isArray(options.allExcept),
            this.getOptionName() + ' option requires a true value or an object of exceptions'
        );

        this._isSameLine = false;
        if (Array.isArray(options.allExcept)) {
            this._isSameLine = options.allExcept[0] === 'sameLine';
        }
    },

    getOptionName: function() {
        return 'requireObjectKeysOnNewLine';
    },

    check: function(file, errors) {
        var message = 'Object keys must go on a new line';
        var isSameLine = this._isSameLine;

        if (isSameLine) {
            message = 'Object keys must go on a new line if they aren\'t all on the same line';
        }

        file.iterateNodesByType('ObjectExpression', function(node) {
            var firstKeyToken;
            var lastValueToken;

            if (isSameLine) {
                if (node.properties.length > 1) {
                    firstKeyToken = file.getFirstNodeToken(node.properties[0].key);
                    lastValueToken = file.getLastNodeToken(node.properties[node.properties.length - 1].value);

                    if (firstKeyToken.loc.end.line === lastValueToken.loc.start.line) {
                        // It's ok, all keys and values are on the same line.
                        return;
                    }
                }
            }

            for (var i = 1; i < node.properties.length; i++) {
                lastValueToken = file.getLastNodeToken(node.properties[i - 1].value);
                var comma = file.findNextToken(lastValueToken, 'Punctuator', ',');

                firstKeyToken = file.getFirstNodeToken(node.properties[i].key);

                errors.assert.differentLine({
                    token: comma,
                    nextToken: firstKeyToken,
                    message: message
                });
            }
        });
    }
};
