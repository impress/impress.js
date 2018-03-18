/**
 * Requires proper alignment in object literals.
 *
 * Type: `String`
 *
 * Values:
 *  - `"all"` for strict mode,
 *  - `"ignoreFunction"` ignores objects if one of the property values is a function expression,
 *  - `"ignoreLineBreak"` ignores objects if there are line breaks between properties
 *
 * #### Example
 *
 * ```js
 * "requireAlignedObjectValues": "all"
 * ```
 *
 * ##### Valid
 * ```js
 * var x = {
 *     a   : 1,
 *     bcd : 2,
 *     ef  : 'str'
 * };
 * ```
 * ##### Invalid
 * ```js
 * var x = {
 *     a : 1,
 *     bcd : 2,
 *     ef : 'str'
 * };
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(mode) {
        var modes = {
            'all': 'all',
            'ignoreFunction': 'ignoreFunction',
            'ignoreLineBreak': 'ignoreLineBreak',
            'skipWithFunction': 'ignoreFunction',
            'skipWithLineBreak': 'ignoreLineBreak'
        };
        assert(
            typeof mode === 'string' && modes[mode],
            this.getOptionName() + ' requires one of the following values: ' + Object.keys(modes).join(', ')
        );
        this._mode = modes[mode];
    },

    getOptionName: function() {
        return 'requireAlignedObjectValues';
    },

    check: function(file, errors) {
        var mode = this._mode;

        file.iterateNodesByType('ObjectExpression', function(node) {
            if (node.loc.start.line === node.loc.end.line || node.properties < 2) {
                return;
            }

            var maxKeyEndPos = 0;
            var prevKeyEndPos = 0;
            var minColonPos = 0;
            var tokens = [];
            var skip = node.properties.some(function(property, index) {
                if (property.shorthand || property.method || property.kind !== 'init' ||
                    node.type === 'SpreadProperty') {
                    return true;
                }

                if (mode === 'ignoreFunction' && property.value.type === 'FunctionExpression') {
                    return true;
                }

                if (mode === 'ignoreLineBreak' && index > 0 &&
                     node.properties[index - 1].loc.end.line !== property.loc.start.line - 1) {
                    return true;
                }

                prevKeyEndPos = maxKeyEndPos;
                maxKeyEndPos = Math.max(maxKeyEndPos, property.key.loc.end.column);
                var keyToken = file.getFirstNodeToken(property.key);
                if (property.computed === true) {
                    while (keyToken.value !== ']') {
                        keyToken = file.getNextToken(keyToken);
                    }
                }
                var colon = file.getNextToken(keyToken);
                if (prevKeyEndPos < maxKeyEndPos) {
                    minColonPos = colon.loc.start.column;
                }
                tokens.push({key: keyToken, colon: colon});
            });

            if (skip) {
                return;
            }

            var space = minColonPos - maxKeyEndPos;
            tokens.forEach(function(pair) {
                errors.assert.spacesBetween({
                    token: pair.key,
                    nextToken: pair.colon,
                    exactly: maxKeyEndPos - pair.key.loc.end.column + space,
                    message: 'Alignment required'
                });
            });
        });
    }

};
