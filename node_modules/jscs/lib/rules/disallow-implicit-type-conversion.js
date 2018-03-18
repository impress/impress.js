/**
 * Disallows implicit type conversion.
 *
 * Type: `Array`
 *
 * Values: Array of quoted types
 *
 * #### Example
 *
 * ```js
 * "disallowImplicitTypeConversion": ["numeric", "boolean", "binary", "string"]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * x = Boolean(y);
 * x = Number(y);
 * x = String(y);
 * x = s.indexOf('.') !== -1;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * x = !!y;
 * x = +y;
 * x = '' + y;
 * x = ~s.indexOf('.');
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(types) {
        assert(Array.isArray(types), this.getOptionName() + ' option requires array value');
        this._typeIndex = {};
        for (var i = 0, l = types.length; i < l; i++) {
            this._typeIndex[types[i]] = true;
        }
    },

    getOptionName: function() {
        return 'disallowImplicitTypeConversion';
    },

    check: function(file, errors) {
        var types = this._typeIndex;
        if (types.numeric || types.boolean || types.binary) {
            file.iterateNodesByType('UnaryExpression', function(node) {
                if (types.numeric && node.operator === '+') {
                    errors.add('Implicit numeric conversion', node.loc.start);
                }
                if (types.binary && node.operator === '~') {
                    errors.add('Implicit binary conversion', node.loc.start);
                }
                if (types.boolean &&
                    node.operator === '!' &&
                    node.argument.type === 'UnaryExpression' &&
                    node.argument.operator === '!'
                ) {
                    errors.add('Implicit boolean conversion', node.loc.start);
                }
            });
        }
        if (types.string) {
            file.iterateNodesByType('BinaryExpression', function(node) {

                if (node.operator !== '+') {
                    return;
                }

                // Do not report concatination for same string literals (#1538)
                if (node.left.type === node.right.type) {
                    return;
                }

                if (
                    (node.left.type === 'Literal' && node.left.value === '') ||
                    (node.right.type === 'Literal' && node.right.value === '')
                ) {
                    errors.add('Implicit string conversion', node.loc.start);
                }
            });
        }
    }

};
