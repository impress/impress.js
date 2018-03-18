/**
 * Disallows nested ternaries.
 *
 * Types: `Boolean`, `Object`
 *
 * Values: `true` or an Object that contains a `maxLevel` property equal to an integer
 * indicating the maximum levels of nesting to be allowed.
 *
 * #### Examples
 *
 * ```js
 * "disallowNestedTernaries": true
 *
 * // or
 *
 * "disallowNestedTernaries": { "maxLevel": 1 }
 * ```
 *
 * ##### Valid for modes `true` and `"maxLevel": 1`
 *
 * ```js
 * var foo = (a === b) ? 1 : 2;
 * ```
 *
 * ##### Invalid for mode `true`, but valid for `"maxLevel": 1`
 *
 * ```js
 * var foo = (a === b)
 *   ? (a === c)
 *     ? 1
 *     : 2
 *   : (b === c)
 *     ? 3
 *     : 4;
 * ```
 *
 * ##### Invalid for modes `true` and `"maxLevel": 1`
 *
 * ```js
 * var foo = (a === b)
 *   ? (a === c)
 *     ? (c === d)
 *       ? 5
 *       : 6
 *     : 2
 *   : (b === c)
 *     ? 3
 *     : 4;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true || (typeof options.maxLevel === 'number' && options.maxLevel > 0),
            this.getOptionName() + ' option requires a true value or an object with "maxLevel" property'
        );

        this._maxLevel = 0;
        if (options.maxLevel) {
            this._maxLevel = options.maxLevel;
        }
    },

    getOptionName: function() {
        return 'disallowNestedTernaries';
    },

    check: function(file, errors) {
        var maxLevel = this._maxLevel;
        file.iterateNodesByType('ConditionalExpression', function(node) {
            var level = 0;
            var getLevel = function(currentNode) {
                if (currentNode.parentNode && currentNode.parentNode.type === 'ConditionalExpression') {
                    level += 1;
                    if (level > maxLevel) {
                        errors.add('Illegal nested ternary', node.loc.start.line, node.loc.start.column);
                        return;
                    }
                    getLevel(currentNode.parentNode);
                }
            };
            getLevel(node);
        });
    }

};
