/**
 * Requires constructors to be capitalized (except for `this`)
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
 * "requireCapitalizedConstructors": true
 * "requireCapitalizedConstructors": {
 *     "allExcept": ["somethingNative"]
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = new B();
 * var c = new this();
 * var d = new somethingNative();
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var d = new e();
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
        return 'requireCapitalizedConstructors';
    },

    check: function(file, errors) {
        var allowedConstructors = this._allowedConstructors;

        file.iterateNodesByType('NewExpression', function(node) {
            if (node.callee.type === 'Identifier' &&
                !allowedConstructors[node.callee.name] &&
                node.callee.name[0].toUpperCase() !== node.callee.name[0]
            ) {
                errors.add(
                    'Constructor functions should be capitalized',
                    node.callee.loc.start.line,
                    node.callee.loc.start.column
                );
            }
        });
    }

};
