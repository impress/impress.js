/**
 * Disallows a specified set of identifier names.
 *
 * Type: `Array`
 *
 * Values: Array of strings, which should be disallowed as identifier names
 *
 * #### Example
 *
 * ```js
 * "disallowIdentifierNames": ['temp', 'foo']
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var good = 1;
 * object['fine'] = 2;
 * object.fine = 3;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var temp = 1;
 * object['foo'] = 2;
 * object.foo = 3;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(identifiers) {
        assert(
            Array.isArray(identifiers),
            'disallowIdentifierNames option requires an array'
        );

        this._identifierIndex = {};
        for (var i = 0, l = identifiers.length; i < l; i++) {
            this._identifierIndex[identifiers[i]] = true;
        }
    },

    getOptionName: function() {
        return 'disallowIdentifierNames';
    },

    check: function(file, errors) {
        var disallowedIdentifiers = this._identifierIndex;

        file.iterateNodesByType('Identifier', function(node) {
            if (Object.prototype.hasOwnProperty.call(disallowedIdentifiers, node.name)) {
                errors.add('Illegal Identifier name: ' + node.name, node.loc.start);
            }
        });

        file.iterateNodesByType('MemberExpression', function(node) {
            if (node.property.type === 'Literal') {
                if (Object.prototype.hasOwnProperty.call(disallowedIdentifiers, node.property.value)) {
                    errors.add('Illegal Identifier name: ' + node.property.value, node.property.loc.start);
                }
            }
        });

    }

};
