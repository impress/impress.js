/**
 * Disallows identifiers that start or end in `_`.
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *     - `allExcept`: array of quoted identifiers
 *
 * JSHint: [`nomen`](http://www.jshint.com/docs/options/#nomen)
 *
 * Some popular identifiers are automatically listed as exceptions:
 *
 *  - `__proto__` (javascript)
 *  - `_` (underscore.js)
 *  - `__filename` (node.js global)
 *  - `__dirname` (node.js global)
 *  - `super_` (node.js, used by
 *    [`util.inherits`](http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor))
 *
 * #### Example
 *
 * ```js
 * "disallowDanglingUnderscores": { "allExcept": ["_exception"] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var x = 1;
 * var o = obj.__proto__;
 * var y = _.extend;
 * var z = __dirname;
 * var w = __filename;
 * var x_y = 1;
 * var v = _exception;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var _x = 1;
 * var x_ = 1;
 * var x_y_ = 1;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(identifiers) {
        assert(
            identifiers === true ||
            typeof identifiers === 'object',
            this.getOptionName() + ' option requires the value `true` ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof identifiers !== 'object' ||
            Array.isArray(identifiers.allExcept) &&
            typeof identifiers.allExcept[0] === 'string',
            'Property `allExcept` in ' + this.getOptionName() + ' should be an array of strings'
        );

        var isTrue = identifiers === true;
        var defaultIdentifiers = [
            '__proto__',
            '_',
            '__dirname',
            '__filename',
            'super_'
        ];

        if (isTrue) {
            identifiers = defaultIdentifiers;
        } else {
            identifiers = (identifiers.allExcept).concat(defaultIdentifiers);
        }

        this._identifierIndex = identifiers;
    },

    getOptionName: function() {
        return 'disallowDanglingUnderscores';
    },

    check: function(file, errors) {
        var allowedIdentifiers = this._identifierIndex;

        file.iterateTokensByType('Identifier', function(token) {
            var value = token.value;

            if ((value[0] === '_' || value.slice(-1) === '_') &&
                allowedIdentifiers.indexOf(value) < 0
            ) {
                errors.add(
                    'Invalid dangling underscore found',
                    token.loc.start.line,
                    token.loc.start.column
                );
            }
        });
    }

};
