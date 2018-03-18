/**
 * This rule is for validating the positioning of line comments. Block comments are ignored.
 *
 * Comments that start with the following keywords are also ignored:
 * `eslint`, `jshint`, `jslint`, `istanbul`, `global`, `exported`, `jscs`, `falls through`
 * eg. // jshint strict: true
 *
 * Type: `Object`
 *
 * Value:
 *
 * - `Object`:
 *    - `position`: `above` or `beside`
 *    - `allExcept`: array of quoted exceptions (comments that start with these values will be excepted)
 *
 * #### Example
 *
 * ```js
 * "validateCommentPosition": { position: `above`, allExcept: [`pragma`] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * // This is a valid comment
 * 1 + 1;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * 1 + 1; // This is an invalid comment
 * 2 + 2; // pragma (this comment is fine)
 * ```
 *
 * ```js
 * "validateCommentPosition": { position: `beside` }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * 1 + 1; // This is a valid comment
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * // This is an invalid comment
 * 1 + 1;
 * ```
*/

var assert = require('assert');

var isPragma = require('../utils').isPragma;

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        var validPositions = {
            'above': 'above',
            'beside': 'beside'
        };
        var allExcept = options.allExcept;
        assert(
            typeof options === 'object' && validPositions[options.position],
            this.getOptionName() + ' requires one of the following values: ' + Object.keys(validPositions).join(', ')
        );
        if (Array.isArray(allExcept)) {
            assert(
                allExcept.every(function(el) { return typeof el === 'string'; }),
                'Property `allExcept` in ' + allExcept + ' should be an array of strings'
            );
            this._isExcepted = isPragma(allExcept);
        } else {
            this._isExcepted  = isPragma();
        }
        this._position = options.position;
    },

    getOptionName: function() {
        return 'validateCommentPosition';
    },

    check: function(file, errors) {
        var position = this._position;
        var isExcepted = this._isExcepted;
        file.iterateTokensByType('Line', function(comment) {
            if (isExcepted(comment.value)) {
                return;
            }
            var firstToken = file.getFirstTokenOnLine(comment.loc.start.line, { includeComments: true });
            if (position === 'above' && !firstToken.isComment) {
                errors.add('Expected comments to be above the code not beside', comment.loc.start);
            }
            if (position === 'beside' && firstToken.isComment) {
                errors.add('Expected comments to be beside the code not above', comment.loc.start);
            }
        });
    }
};
