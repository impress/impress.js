/**
 * Disallows identical destructuring names for the key and value in favor of using shorthand destructuring.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowIdenticalDestructuringNames": true
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var {left, top} = obj; // shorthand
 * var {left, top: topper} = obj; // different identifier
 * let { [key]: key } = obj; // computed property
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * var {left: left, top: top} = obj;
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
    },

    getOptionName: function() {
        return 'disallowIdenticalDestructuringNames';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['ObjectPattern'], function(node) {
            var props = node.properties;
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (prop.type === 'Property' && !prop.shorthand && !prop.computed &&
                    prop.key.name === prop.value.name) {
                    errors.add('Use the shorthand form of destructuring instead', prop.loc.start);
                }
            }
        });
    }
};
