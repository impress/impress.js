/**
 * Requires capitalized constructors to to use the `new` keyword
 *
 * Types: `Boolean` or `Object`
 *
 * Values: `true` or Object with `allExcept` Array of quoted identifiers which are exempted
 *
 * JSHint: [`newcap`](http://jshint.com/docs/options/#newcap)
 *
 * #### Example
 *
 * ```js
 * "requireCapitalizedConstructorsNew": true
 * "requireCapitalizedConstructorsNew": {
 *     "allExcept": ["SomethingNative"]
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = new B();
 * var c = SomethingNative();
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var d = E();
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true || Array.isArray(options.allExcept),
            this.getOptionName() + ' option requires a true value or an object of exceptions'
        );
        this._allowedConstructors = {};

        var allExcept = options.allExcept;
        if (allExcept) {
            for (var i = 0, l = allExcept.length; i < l; i++) {
                this._allowedConstructors[allExcept[i]] = true;
            }
        }
    },

    getOptionName: function() {
        return 'requireCapitalizedConstructorsNew';
    },

    check: function(file, errors) {
        var allowedConstructors = this._allowedConstructors;

        file.iterateNodesByType('CallExpression', function(node) {
            if (node.callee.type === 'Identifier' &&
                !allowedConstructors[node.callee.name] &&
                node.callee.name[0].toLowerCase() !== node.callee.name[0]
            ) {
                errors.add(
                    'Constructor functions should use the "new" keyword',
                    node.callee.loc.start.line,
                    node.callee.loc.start.column
                );
            }
        });
    }

};
