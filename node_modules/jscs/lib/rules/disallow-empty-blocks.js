/**
 * Disallows empty blocks (except for catch blocks).
 *
 * Type: `Boolean` or `Object`
 *
 * Values:
 *  - `true` for default behavior (strict mode, no empty blocks allowed)
 *  - `Object`:
 *    - `'allExcept'` array of exceptions:
 *       - `'comments'` blocks containing only comments are not considered empty
 *
 * JSHint: [`noempty`](http://jshint.com/docs/options/#noempty)
 *
 * #### Example
 *
 * ```js
 * "disallowEmptyBlocks": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if ( a == b ) { c = d; }
 * try { a = b; } catch( e ){}
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if ( a == b ) { } else { c = d; }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        var optionName = this.getOptionName();

        if (typeof options !== 'object') {
            assert(
                options === true,
                optionName + ' option requires a true value or an object like: { allExcept: [\'comments\'] }'
            );

            var _options = {
                allExcept: []
            };
            return this.configure(_options);
        }

        assert(
            Array.isArray(options.allExcept),
            'Property `allExcept` in ' + optionName + ' should be an array of strings'
        );

        this._exceptComments = options.allExcept.indexOf('comments') > -1;
    },

    getOptionName: function() {
        return 'disallowEmptyBlocks';
    },

    check: function(file, errors) {
        var exceptComments = this._exceptComments;

        function canSkip(token) {
            if (!exceptComments) {
                return false;
            }
            var canSkipToken = false;
            file.getComments().forEach(function(comment) {
                if (comment.loc.start.line >= token.loc.start.line &&
                    comment.loc.end.line <= token.loc.end.line) {
                    canSkipToken = true;
                }
            });
            return canSkipToken;
        }

        file.iterateNodesByType('BlockStatement', function(node) {
            if (node.body.length) {
                return true;
            }

            if (canSkip(node)) {
                return true;
            }

            if (node.parentNode.type !== 'CatchClause' &&
                node.parentNode.type !== 'FunctionDeclaration' &&
                node.parentNode.type !== 'FunctionExpression' &&
                node.parentNode.type !== 'ArrowFunctionExpression') {
                errors.add('Empty block found', node.loc.end);
            }
        });
    }
};
