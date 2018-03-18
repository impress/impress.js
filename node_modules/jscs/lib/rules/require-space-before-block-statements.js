/**
 * Requires space(s) before block statements (for loops, control structures).
 *
 * Type: `Boolean` or `Integer`
 *
 * Values:
 *
 * - `true` require *at least* a single space
 * - `Integer` require *at least* specified number of spaces
 *
 * #### Example
 *
 * ```js
 * "requireSpaceBeforeBlockStatements": 1
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (cond) {
 *     foo();
 * } else {
 *     bar();
 * }
 *
 * for (var e in elements) {
 *     bar(e);
 * }
 *
 * while (cond) {
 *     foo();
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (cond){
 *     foo();
 * } else{
 *     bar();
 * }
 *
 * for (var e in elements){
 *     bar(e);
 * }
 *
 * while (cond){
 *     foo();
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireSpaceBeforeBlockStatements) {
        assert(
            typeof requireSpaceBeforeBlockStatements === 'boolean' ||
            typeof requireSpaceBeforeBlockStatements === 'number',
            this.getOptionName() + ' option requires number or bolean'
        );
        assert(
            requireSpaceBeforeBlockStatements >= 1,
            this.getOptionName() +
              ' option requires true value or a number greater than equal to 1 or should be removed'
        );
        this._count = +requireSpaceBeforeBlockStatements;
    },

    getOptionName: function() {
        return 'requireSpaceBeforeBlockStatements';
    },

    check: function(file, errors) {
        var count = this._count;
        file.iterateNodesByType('BlockStatement', function(node) {
            var first = file.getFirstNodeToken(node);

            errors.assert.spacesBetween({
                token: file.getPrevToken(first),
                nextToken: first,
                atLeast: count,
                disallowNewLine: true,
                message: 'One (or more) spaces required before opening brace for block expressions'
            });
        });
    }

};
