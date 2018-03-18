/**
 * Requires use of binary, hexadecimal, and octal literals instead of parseInt.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireNumericLiterals": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * 0b111110111 === 503;
 * 0o767 === 503;
 * 0x1F7 === 503;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * parseInt("111110111", 2) === 503;
 * parseInt("767", 8) === 503;
 * parseInt("1F7", 16) === 255;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );

        this._radixMap = {
            2: 'binary',
            8: 'octal',
            16: 'hexadecimal'
        };
    },

    getOptionName: function() {
        return 'requireNumericLiterals';
    },

    check: function(file, errors) {
        var radixMap = this._radixMap;
        file.iterateNodesByType(['CallExpression'], function(node) {
            // don't check for parseInt(1)
            if (node.arguments.length !== 2) {
                return;
            }

            // only error if the radix is 2, 8, or 16
            var radixName = radixMap[node.arguments[1].value];

            if (node.callee.type === 'Identifier' &&
                node.callee.name === 'parseInt' &&
                radixName &&
                node.arguments[0].type === 'Literal'
            ) {
                errors.add('Use ' + radixName + ' literals instead of parseInt', node.loc.start);
            }
        });
    }
};
