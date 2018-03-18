/**
 * Option to check line break characters
 *
 * Types: `String`, `Object`
 *
 * Values:
 *  - `String`: setting this is the same as validating the rule using `{character: String, reportOncePerFile: false}`
 *  - `Object`:
 *      - `character`
 *          - `String` specifies the line break character that is allowed. (Values allowed: `"CR"`, `"LF"` or `"CRLF"`)
 *      - `reportOncePerFile`
 *          - `true` specifies that validation for the file should stop running upon encountering the first rule
 *            violation and return the details of that violation in the report
 *          - `false` specifies that all lines in the file should be validated with all rule violations captured in
 *            the final report
 *
 * #### Example
 *
 * ```js
 * "validateLineBreaks": "LF"
 * ```
 *
 * ##### Valid for mode `"LF"`
 * ```js
 * var x = 1;<LF>
 * x++;
 * ```
 *
 * ##### Invalid for mode `"LF"`
 * ```js
 * var x = 1;<CRLF>
 * x++;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            typeof options === 'string' || typeof options === 'object',
            this.getOptionName() + ' option requires string or object value'
        );

        if (typeof options === 'string') {
            options = { character: options };
        }

        var lineBreaks = {
            CR: '\r',
            LF: '\n',
            CRLF: '\r\n'
        };
        this._allowedLineBreak = lineBreaks[options.character];

        this._reportOncePerFile = options.reportOncePerFile !== false;
    },

    getOptionName: function() {
        return 'validateLineBreaks';
    },

    check: function(file, errors) {
        var lines = file.getLines();
        if (lines.length < 2) {
            return;
        }

        file.getLineBreaks().some(function(lineBreak, i) {
            if (lineBreak !== this._allowedLineBreak) {
                errors.add('Invalid line break', i + 1, lines[i].length);
                return this._reportOncePerFile;
            }
        }, this);
    }

};
