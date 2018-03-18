
/**
 * Validates the order in object keys.
 *
 * Types: `Boolean` or `String`
 *
 * Values:
 *  - `true` (alias to `asc`)
 *  - `"asc"`: requires sorting in ascending order
 *  - `"asc-insensitive"`: requires sorting in ascending order (case-insensitive)
 *  - `"asc-natural"`: requires sorting in ascending natural order
 *  - `"desc"`: requires sorting in descending order
 *  - `"desc-insensitive"`: requires sorting in descending order (case-insensitive)
 *  - `"desc-natural"`: requires sorting in descending natural order
 *
 * #### Example
 *
 * ```js
 * "validateOrderInObjectKeys": "asc"
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = {
 *  x: 'foo',
 *  y: 'bar'
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = {
 *  y: 'foo',
 *  x: 'bar'
 * }
 * ```
 */

var assert = require('assert');
var naturalSort = require('natural-compare');

/**
 * Sort in ascending order.
 */
function asc(a, b) {
    return String(a) < String(b) ? -1 : 1;
}

/**
 * Sort in ascending order (case-insensitive).
 */
function ascInsensitive(a, b) {
    var lowercaseA = String(a).toLowerCase();
    var lowercaseB = String(b).toLowerCase();

    if (lowercaseA < lowercaseB) {
        return -1;
    }

    if (lowercaseA > lowercaseB) {
        return 1;
    }

    return asc(a, b);
}

/**
 * Natural sort in ascending order.
 */
function ascNatural(a, b) {
    return naturalSort(a, b);
}

/**
 * Native sort in descending order.
 */
function desc(a, b) {
    return asc(a, b) * -1;
}

/**
 * Sort in descending order (case-insensitive).
 */
function descInsensitive(a, b) {
    return ascInsensitive(a, b) * -1;
}

/**
 * Native sort in descending order.
 */
function descNatural(a, b) {
    return naturalSort(a, b) * -1;
}

/**
 * Available sort methods.
 */
var methods = {
    asc: asc,
    'asc-insensitive': ascInsensitive,
    'asc-natural': ascNatural,
    desc: desc,
    'desc-insensitive': descInsensitive,
    'desc-natural': descNatural
};

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true || Object.keys(methods).indexOf(options) !== -1,
            this.getOptionName() + ' option requires a true value or should be removed'
        );

        this._sort = methods[options] || methods.asc;
    },

    getOptionName: function() {
        return 'validateOrderInObjectKeys';
    },

    check: function(file, errors) {
        var sort = this._sort;

        file.iterateNodesByType('ObjectExpression', function(node) {
            var keys = node.properties.map(function(property) {
                return (property.key.name || property.key.value);
            });

            var sorted = keys.slice(0).sort(sort);
            var unsorted;

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] !== sorted[i]) {
                    unsorted = i;

                    break;
                }
            }

            if (undefined !== unsorted) {
                errors.add(
                    'Object keys must be in ' + (/asc/.test(sort.name) ? 'ascending' : 'descending') + ' order',
                    node.properties[unsorted].loc.start
                );
            }
        });
    }
};
