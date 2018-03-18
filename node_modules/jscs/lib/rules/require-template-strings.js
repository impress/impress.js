/**
 * Requires the use of template strings instead of string concatenation.
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 * - true
 * - `Object`:
 *      - `"allExcept"`: array of quoted exceptions:
 *          - `"stringConcatenation"` ignores strings concatenated with other strings
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireTemplateStrings": true
 * "requireTemplateStrings": { "allExcept": ["stringConcatenation"] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function sayHi(name) {
 *     return `How are you, ${name}?`;
 * }
 * `a ${b + c}`
 * `a ${a()}`
 * ```
 *
 * ##### Valid for `{ "allExcept": ["stringConcatenation"] }`
 *
 * ```js
 * function sayBye(name) {
 *     return `It was good seeing you, ${name}! Let's hang out again sometime and` +
 *         ' grab some chicken and waffles.';
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function sayHi(name) {
 *     return 'How are you, ' + name + '?';
 * }
 * "a" + (b + c)
 * "a" + a()
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        this._allowStringConcatenation = false;
        var optionName = this.getOptionName();

        if (typeof options === 'object') {
            assert(Array.isArray(options.allExcept), optionName + ' option requires "allExcept" ' +
                'to be an array');
            assert(options.allExcept.length > 0, optionName + ' option requires "allExcept" ' +
                'to have at least one item or be set to `true`');
            options.allExcept.forEach(function(except) {
                if (except === 'stringConcatenation') {
                    this._allowStringConcatenation = true;
                } else {
                    assert(false, optionName + ' option requires "allExcept" to only have ' +
                        '"stringConcatenation"');
                }
            }, this);
        } else {
            assert(
                options === true,
                optionName + ' option requires true value or object'
            );
        }
    },

    getOptionName: function() {
        return 'requireTemplateStrings';
    },

    check: function(file, errors) {
        var allowStringConcatenation = this._allowStringConcatenation;

        function add(node) {
            errors.add(
                'Illegal use of string concatenation. Use template strings instead.',
                node.left.loc.end
            );
        }

        file.iterateNodesByType('BinaryExpression', function(node) {
            if (node.operator !== '+') {
                return;
            }

            var leftIsString = node.left;
            var rightIsString = node.right;

            // Left side could also be binary expression (See gh-2050),
            // but not the right one
            while (leftIsString.type === 'BinaryExpression') {
                leftIsString = leftIsString.left;
            }

            leftIsString = typeof leftIsString.value === 'string' ||
                leftIsString.type === 'TemplateLiteral';

            rightIsString = typeof rightIsString.value === 'string' ||
                rightIsString.type === 'TemplateLiteral';

            if (allowStringConcatenation && leftIsString && rightIsString) {
                return;
            }

            // At least one of the operands should be a string or template string,
            // otherwise this is not a concatenation
            if (leftIsString || rightIsString) {
                add(node);
            }
        });
    }
};
