/**
 * Disallows using `.apply` in favor of the spread operator
 *
 * Types: `Boolean`
 *
 * Values:
 * - `true` specifies that apply `.apply` is disallowed
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireSpread": true
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * const wrap = (f, g) => (...args) => g(f, ...args)
 * instance.method(...args)
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * const wrap = (f, g) => (...args) => g.apply(g, [f].concat(args))
 * instance.method.apply(instance, args);
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
        return 'requireSpread';
    },

    check: function(file, errors) {
        file.iterateNodesByType('CallExpression', function(node) {
            var callee = node.callee;
            var firstParameter = node.arguments[0];

            if (node.arguments.length === 2 &&
                callee.property && callee.property.name === 'apply' &&
                callee.object && callee.object.name === firstParameter.name) {
                errors.add(
                    'Illegal use of apply method. Use the spread operator instead',
                    node.callee.property.loc.start
                );
            }
        });
    }
};
