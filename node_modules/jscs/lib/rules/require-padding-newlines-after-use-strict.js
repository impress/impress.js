/**
 * Requires a blank line after `'use strict';` statements
 *
 * Values:
 *  - `true` for default behavior (require blank line after 'use strict' statements)
 *  - `Object`:
 *    - `'allExcept'` array of exceptions:
 *       - `'require'` allows 'require' statements to occur immediately after 'use strict'
 *
 * #### Example
 *
 * ```js
 * "requirePaddingNewLinesAfterUseStrict": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * 'use strict';
 *
 * // code
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * 'use strict';
 * // code
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        if (typeof options !== 'object') {
            assert(
                options === true,
                this.getOptionName() + ' option requires either a true value or an object'
            );

            var _options = {allExcept: []};
            return this.configure(_options);
        }

        if (Array.isArray(options.allExcept)) {
            this._exceptRequire = options.allExcept.indexOf('require') > -1;
        }
    },

    getOptionName: function() {
        return 'requirePaddingNewLinesAfterUseStrict';
    },

    check: function(file, errors) {
        var exceptRequire = this._exceptRequire;
        file.iterateNodesByType('ExpressionStatement', function(node) {
            var expression = node.expression;

            if (expression.type !== 'Literal' || expression.value !== 'use strict') {
                return;
            }

            var endOfNode = file.getLastNodeToken(node);
            if (exceptRequire) {
                var requireToken = file.findNextToken(endOfNode, 'Identifier', 'require');
                if (requireToken && node.loc.start.line + 1 === requireToken.loc.start.line) {

                    // Ensure the detected require is the first declaration of this line
                    var keywordToken = file.getNextToken(endOfNode, {
                        includeComments: true
                    });
                    var identifierToken = file.getNextToken(file.getLastNodeToken(keywordToken), {
                        includeComments: true
                    });
                    var punctuatorToken = file.getNextToken(file.getLastNodeToken(identifierToken), {
                        includeComments: true
                    });
                    requireToken = file.getNextToken(file.getLastNodeToken(punctuatorToken), {
                        includeComments: true
                    });

                    if (
                        keywordToken.type === 'Keyword' &&
                        identifierToken.type === 'Identifier' &&
                        punctuatorToken.type === 'Punctuator' &&
                        requireToken.type === 'Identifier' &&
                        requireToken.value === 'require'
                    ) {
                        return;
                    }
                }
            }

            var nextToken = file.getNextToken(endOfNode, {
                includeComments: true
            });

            errors.assert.linesBetween({
                atLeast: 2,
                token: endOfNode,
                nextToken: nextToken
            });
        });
    }
};
