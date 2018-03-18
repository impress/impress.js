/**
 * Requires all quote marks to be either the supplied value, or consistent if `true`
 *
 * Types: `Boolean`, `String` or `Object`
 *
 * Values:
 *  - `"\""`: all strings require double quotes
 *  - `"'"`: all strings require single quotes
 *  - `true`: all strings require the quote mark first encountered in the source code
 *  - `Object`:
 *     - `escape`: allow the "other" quote mark to be used, but only to avoid having to escape
 *     - `mark`: the same effect as the non-object values
 *     - `ignoreJSX`: ignore JSX nodes
 *
 * JSHint: [`quotmark`](http://jshint.com/docs/options/#quotmark)
 *
 * #### Example
 *
 * ```js
 * "validateQuoteMarks": "\""
 * ```
 * ```js
 * "validateQuoteMarks": { "mark": "\"", "escape": true }
 * ```
 *
 * ##### Valid example for mode `{ "mark": "\"", "escape": true }`
 *
 * ```js
 * var x = "x";
 * var y = '"x"';
 * ```
 *
 * ##### Invalid example for mode `{ "mark": "\"", "escape": true }`
 *
 * ```js
 * var x = "x";
 * var y = 'x';
 * ```
 *
 * ##### Valid example for mode `{ "mark": "'", "escape": true, "ignoreJSX": true }`
 *
 * ```js
 * <div className="flex-card__header">{this.props.children}</div>;
 * ```
 *
 * ##### Valid example for mode `"\""` or mode `true`
 *
 * ```js
 * var x = "x";
 * ```
 *
 * ##### Valid example for mode `"'"` or mode `true`
 *
 * ```js
 * var x = 'x';
 * ```
 *
 * ##### Invalid example for mode `true`
 *
 * ```js
 * var x = "x", y = 'y';
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(quoteMark) {
        this._allowEscape = false;
        this._ignoreJSX = false;

        if (typeof quoteMark === 'object') {
            assert(
                typeof quoteMark.escape === 'boolean' && quoteMark.mark !== undefined,
                this.getOptionName() + ' option requires the "escape" and "mark" property to be defined'
            );
            this._allowEscape = quoteMark.escape;

            if (quoteMark.ignoreJSX) {
                this._ignoreJSX = quoteMark.ignoreJSX;
            }

            quoteMark = quoteMark.mark;
        }

        assert(
            quoteMark === '"' || quoteMark === '\'' || quoteMark === true,
            this.getOptionName() + ' option requires \'"\', "\'", or boolean true'
        );

        assert(
            quoteMark === '"' || quoteMark === '\'' || quoteMark === true,
            this.getOptionName() + ' option requires \'"\', "\'", or boolean true'
        );

        this._quoteMark = quoteMark;
    },

    getOptionName: function() {
        return 'validateQuoteMarks';
    },

    check: function(file, errors) {
        var quoteMark = this._quoteMark;
        var allowEscape = this._allowEscape;
        var ignoreJSX = this._ignoreJSX;

        var opposite = {
            '"': '\'',
            '\'': '"'
        };
        file.iterateTokensByType('String', function(token) {
            var node;

            if (ignoreJSX) {
                node = file.getNodeByRange(token.range[0]).parentNode;

                if (node && node.type === 'JSXAttribute') {
                    return;
                }
            }

            var str = token.value;
            var mark = str[0];
            var stripped = str.substring(1, str.length - 1);

            if (quoteMark === true) {
                quoteMark = mark;
            }

            if (mark !== quoteMark) {
                if (allowEscape && stripped.indexOf(opposite[mark]) > -1) {
                    return;
                }

                errors.cast({
                    message: 'Invalid quote mark found',
                    line: token.loc.start.line,
                    column: token.loc.start.column,
                    additional: token
                });
            }
        });
    },

    _fix: function(file, error) {
        var token = error.additional;
        var fixer = require(this._quoteMark === '"' ? 'to-double-quotes' : 'to-single-quotes');

        token.value = fixer(token.value);
    }
};
