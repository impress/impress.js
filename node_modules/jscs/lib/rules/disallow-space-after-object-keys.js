/**
 * Disallows space after object keys.
 *
 * Types: `Boolean`, `String`, or `Object`
 *
 * Values:
 *  - `true`
 *  - `"ignoreSingleLine"` ignores objects if the object only takes up a single line
 *    (*deprecated* use `"allExcept": [ "singleline" ]`)
 *  - `"ignoreMultiLine"` ignores objects if the object takes up multiple lines
 *    (*deprecated* use `"allExcept": [ "multiline" ]`)
 *  - `Object`:
 *     - `"allExcept"`: array of exceptions:
 *        - `"singleline"` ignores objects if the object only takes up a single line
 *        - `"multiline"` ignores objects if the object takes up multiple lines
 *        - `"aligned"` ignores aligned object properties
 *        - `"method"` ignores method declarations
 *
 * #### Example
 *
 * ```js
 * "disallowSpaceAfterObjectKeys": true
 * ```
 *
 * ##### Valid for `true`
 * ```js
 * var x = {a: 1};
 * var y = {
 *     a: 1,
 *     b: 2
 * }
 * ```
 *
 * ##### Valid for `{ allExcept: ['singleline'] }`
 * ```js
 * var x = {a : 1};
 * var y = {
 *     a: 1,
 *     b: 2
 * }
 * ```
 *
 * ##### Valid for `{ allExcept: ['multiline'] }`
 * ```js
 * var x = {a: 1};
 * var y = {
 *     a  : 1,
 *     b   : 2
 * }
 * ```
 *
 * ##### Valid for `{ allExcept: ['aligned'] }`
 * ```js
 * var y = {
 *     abc: 1,
 *     d  : 2
 * }
 * ```
 *
 * ##### Valid for `{ allExcept: ['method'] }`
 * ```js
 * var y = {
 *     fn () {
 *        return 42;
 *     }
 * }
 * ```
 *
 * ##### Invalid
 * ```js
 * var x = {a : 1};
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
                options === true ||
                options === 'ignoreSingleLine' ||
                options === 'ignoreMultiLine',
                this.getOptionName() +
                ' option requires a true value, "ignoreSingleLine", "ignoreMultiLine", or an object'
            );

            var _options = {
                allExcept: []
            };

            if (options === 'ignoreSingleLine') {
                _options.allExcept.push('singleline');
            }
            if (options === 'ignoreMultiLine') {
                _options.allExcept.push('multiline');
            }

            return this.configure(_options);
        } else {
            assert(
                Array.isArray(options.allExcept),
                this.getOptionName() +
                ' option object requires allExcept array property'
            );
        }

        this._exceptSingleline = options.allExcept.indexOf('singleline') > -1;
        this._exceptMultiline = options.allExcept.indexOf('multiline') > -1;
        this._exceptAligned = options.allExcept.indexOf('aligned') > -1;
        this._exceptMethod = options.allExcept.indexOf('method') > -1;
        assert(
            !this._exceptMultiline || !this._exceptAligned,
            this.getOptionName() +
            ' option allExcept property cannot contain `aligned` and `multiline` at the same time'
        );
        assert(
            !this._exceptMultiline || !this._exceptSingleline,
            this.getOptionName() +
            ' option allExcept property cannot contain `singleline` and `multiline` at the same time'
        );
    },

    getOptionName: function() {
        return 'disallowSpaceAfterObjectKeys';
    },

    check: function(file, errors) {
        var exceptSingleline = this._exceptSingleline;
        var exceptMultiline = this._exceptMultiline;
        var exceptAligned = this._exceptAligned;
        var exceptMethod = this._exceptMethod;

        file.iterateNodesByType('ObjectExpression', function(node) {
            var multiline = node.loc.start.line !== node.loc.end.line;
            if (exceptSingleline && !multiline) {
                return;
            }
            if (exceptMultiline && multiline) {
                return;
            }

            var maxKeyEndPos = 0;
            var tokens = [];
            node.properties.forEach(function(property) {
                if (property.shorthand || property.kind !== 'init' ||
                    (exceptMethod && property.method) ||
                    node.type === 'SpreadProperty') {
                    return;
                }

                var keyToken = file.getLastNodeToken(property.key);
                if (property.computed === true) {
                    keyToken = file.getNextToken(keyToken);
                }

                if (exceptAligned) {
                    maxKeyEndPos = Math.max(maxKeyEndPos, keyToken.loc.end.column);
                }
                tokens.push(keyToken);
            });

            var noSpace = true;
            if (exceptAligned) {
                var withoutSpace = 0;
                var alignedOnColon = 0;
                tokens.forEach(function(key) {
                    var colon = file.getNextToken(key);
                    var spaces = Math.abs(colon.range[0] - key.range[1]);
                    if (spaces === 0) {
                        withoutSpace++;
                    } else if (spaces === maxKeyEndPos - key.loc.end.column) {
                        alignedOnColon++;
                    }
                });

                noSpace = withoutSpace > alignedOnColon;
            }

            tokens.forEach(function(key) {
                var colon = file.getNextToken(key);
                var spaces = (exceptAligned && !noSpace) ? maxKeyEndPos - key.loc.end.column : 0;
                errors.assert.spacesBetween({
                    token: key,
                    nextToken: colon,
                    exactly: spaces,
                    message: 'Illegal space after key',
                    disallowNewLine: true
                });
            });
        });
    }

};
