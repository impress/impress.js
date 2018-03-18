/**
 * Requires the file to be at most the number of lines specified
 *
 * Types: `Integer` or `Object`
 *
 * Values:
 * - `Integer`: file should be at most the number of lines specified
 * - `Object`:
 *     - `value`: (required) lines should be at most the number of characters specified
 *     - `allExcept`: (default: `[]`) an array of conditions that will exempt a line
 *        - `comments`: allows comments to break the rule
*
 * #### Example
 *
 * ```js
 * "maximumNumberOfLines": 100
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        this._allowComments = true;

        if (typeof options === 'number') {
            assert(
                typeof options === 'number',
                this.getOptionName() + ' option requires number value or options object'
            );
            this._maximumNumberOfLines = options;
        } else {
            assert(
                typeof options.value === 'number',
                this.getOptionName() + ' option requires the "value" property to be defined'
            );
            this._maximumNumberOfLines = options.value;

            var exceptions = options.allExcept || [];
            this._allowComments = (exceptions.indexOf('comments') === -1);
        }
    },

    getOptionName: function() {
        return 'maximumNumberOfLines';
    },

    check: function(file, errors) {
        var firstToken = file.getFirstToken({includeComments: true});
        var lines = this._allowComments ?
             file.getLines() : file.getLinesWithCommentsRemoved();

        lines = lines.filter(function(line) {return line !== '';});

        if (lines.length > this._maximumNumberOfLines) {
            errors.add('File must be at most ' + this._maximumNumberOfLines + ' lines long',
                       firstToken.loc.end.line,
                       firstToken.loc.end.column);
        }
    }

};
