/**
 * Requires newline before line comments
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 * - `true`: always require a newline before line comments
 * - `Object`:
 *      - `"allExcept"`: `"firstAfterCurly"` Comments may be first line of block without extra padding
 *
 * #### Examples
 * ```js
 * "requirePaddingNewLinesBeforeLineComments": true
 * "requirePaddingNewLinesBeforeLineComments": { "allExcept": "firstAfterCurly" }
 * ```
 *
 * ##### Valid for `true`
 *
 * ```js
 * var a = 2;
 * var b = 3; // comment
 *
 * // comment
 * return a;
 *
 * function() {
 *
 *   // comment
 * }
 * ```
 *
 * ##### Valid for `{ "allExcept": "firstAfterCurly" }`
 *
 * ```js
 * var a = 2;
 *
 * // comment
 * return a;
 *
 * function() {
 *   // comment
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = 2;
 * //comment
 * return a;
 *
 * function() {
 *   // comment
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(value) {
        this._allowFirstAfterCurly = false;

        if (typeof value === 'object') {
            assert(typeof value.allExcept === 'string' && value.allExcept === 'firstAfterCurly',
                this.getOptionName() + ' option requires the "allExcept" ' +
                 'property to equal "firstAfterCurly"');
            this._allowFirstAfterCurly = true;
        } else {
            assert(value === true,
                this.getOptionName() + ' option requires true value or object'
            );
        }
    },

    getOptionName: function() {
        return 'requirePaddingNewLinesBeforeLineComments';
    },

    check: function(file, errors) {
        var allowFirstAfterCurly = this._allowFirstAfterCurly;

        file.iterateTokensByType('Line', function(comment) {
            if (comment.loc.start.line === 1) {
                return;
            }

            var firstToken = file.getFirstTokenOnLine(comment.loc.start.line);

            // Should not consider code and comment on the same line (#1194)
            if (firstToken !== null && firstToken.type !== 'EOF') {
                return;
            }

            var prevToken = file.getPrevToken(comment, {includeComments: true});

            if (!prevToken || prevToken.type === 'Line') {
                return;
            }

            if (allowFirstAfterCurly && prevToken.type === 'Punctuator' && prevToken.value === '{') {
                return;
            }

            errors.assert.linesBetween({
                token: prevToken,
                nextToken: comment,
                atLeast: 2,
                message: 'Line comments must be preceded with a blank line'
            });
        });
    }
};
