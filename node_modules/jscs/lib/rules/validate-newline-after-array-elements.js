/**
 * Requires each element in array on a single line when array length is more than passed maximum
 * number or array fills more than one line.
 *
 * Types: `Boolean`, `Integer`, `Object`
 *
 * Values:
 *  - `true`: setting this is the same as validating the rule using `{maximum: Infinity, ignoreBrackets: false}`
 *  - `Integer`: setting this is the same as validating the rule using `{maximum: Integer, ignoreBrackets: false}`
 *  - `Object`:
 *      - `maximum`
 *          - `Integer` specifies the maximum number of elements that a single line array can contain
 *      - `ignoreBrackets`
 *          - `true` specifies that the `[` and `]` brackets can be placed on the same line as the array elements
 *
 * #### Example
 *
 * ```js
 * "validateNewlineAfterArrayElements": {
 *   "maximum": 3
 * }
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var x = [{a: 1}, [2], '3', 4, 5, 6];
 * var x = [
 *   {a: 1},
 *   [2],
 *   '3',
 *   4
 * ];
 * ```
 *
 * ##### Invalid for mode `true`
 *
 * ```js
 * var x = [1,
 *   2];
 * ```
 *
 * ##### Valid for mode `3`
 *
 * ```js
 * var x = [{a: 1}, [2], '3'];
 * var x = [
 *   1,
 *   2,
 *   3,
 *   4
 * ];
 * ```
 *
 * ##### Invalid for mode `3`
 *
 * ```js
 * var x = [1, 2, 3, 4];
 * var x = [1,
 *   2,
 *   3];
 * var x = [
 *     1, 2
 * ];
 * ```
 *
 * ##### Valid for mode `{maximum: 2, ignoreBrackets: true}`
 *
 * ```js
 * var x = [{a: 1}, [2]];
 * var x = [1,
 *   2,
 *   3];
 * ```
 *
 * ##### Invalid for mode `{maximum: 2, ignoreBrackets: true}`
 *
 * ```js
 * var x = [1, 2, 3];
 * var x = [1, 2,
 *   3];
 * var x = [1,
 *   2, 3];
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(opts) {
        assert(
            opts === true ||
            typeof opts === 'number' && opts >= 1 ||
            typeof opts === 'object',
            this.getOptionName() + ' option requires maximal number of items ' +
                'or true value either should be removed'
        );
        if (typeof opts === 'object') {
            this._options = {
                maximum: Infinity,
                ignoreBrackets: false
            };

            if ('maximum' in opts) {
                assert(typeof opts.maximum === 'number' && opts.maximum >= 1,
                    'maximum property requires a positive number or should be removed');
                this._options.maximum = opts.maximum;
            }

            if ('ignoreBrackets' in opts) {
                assert(opts.ignoreBrackets === true,
                    'ignoreBrackets property requires true value or should be removed');
                this._options.ignoreBrackets = true;
            }
        } else {
            this._options = {
                maximum: opts === true ? Infinity : opts,
                ignoreBrackets: false
            };
        }
    },

    getOptionName: function() {
        return 'validateNewlineAfterArrayElements';
    },

    check: function(file, errors) {
        var maximum = this._options.maximum;
        var ignoreBrackets = this._options.ignoreBrackets;

        file.iterateNodesByType(['ArrayExpression'], function(node) {
            var els = node.elements;
            var firstEl = els[0];
            var lastEl = els[els.length - 1];
            var bracket;
            var elToken;

            if (els.length <= maximum && node.loc.start.line === node.loc.end.line) {
                return;
            }

            if (!ignoreBrackets) {
                if (firstEl && firstEl.loc.start.line === node.loc.start.line) {
                    bracket = file.getFirstNodeToken(node);
                    elToken = file.getNextToken(bracket);

                    errors.assert.differentLine({
                        token: bracket,
                        nextToken: elToken,
                        message: 'First element should be placed on new line'
                    });
                }
                if (lastEl && lastEl.loc.end.line === node.loc.end.line) {
                    bracket = file.getLastNodeToken(node);
                    elToken = file.getPrevToken(bracket);

                    errors.assert.differentLine({
                        token: elToken,
                        nextToken: bracket,
                        message: 'Closing bracket should be placed on new line'
                    });
                }
            }

            els.forEach(function(elem) {
                var elToken;
                var comma;

                if (!elem) {
                    // skip holes
                    return;
                }

                if (firstEl !== elem) {
                    elToken = file.getFirstNodeToken(elem);
                    comma = file.getPrevToken(elToken);

                    errors.assert.differentLine({
                        token: comma,
                        nextToken: elToken,
                        message: 'Multiple elements at a single line in multiline array'
                    });
                }
            });
        });
    }
};
