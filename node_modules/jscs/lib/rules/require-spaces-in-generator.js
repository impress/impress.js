/**
 * Requires space before and after `*` in generator functions
 *
 * Types: `Object`
 *
 *  - `Object` (at least one of properties must be present and it must be set to true):
 *      - `'beforeStar'`
 *          - `true` validates that there is a space before `*`
 *      - `'afterStar'`
 *          - `true` validates that there is a space after `*`
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInGenerator": {
 *     "beforeStar": true,
 *     "afterStar": true
 * }
 * ```
 * ##### Valid for mode `{ "beforeStar": true, "afterStar": true }`
 *
 * ```js
 * var x = function * () {};
 * function * a() {};
 * var x = async function * () {};
 * var x = async function * a () {};
 * async function * a() {}
 * var x = async function * (){};
 * ```
 *
*/

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            typeof options === 'object',
            this.getOptionName() + ' option must be an object'
        );

        if ('beforeStar' in options) {
            assert(
                options.beforeStar === true,
                this.getOptionName() + '.beforeStar ' +
                'property requires true value or should be removed'
            );
        }
        if ('afterStar' in options) {
            assert(
                options.afterStar === true,
                this.getOptionName() + '.afterStar ' +
                'property requires true value or should be removed'
            );
        }

        assert(
            options.beforeStar || options.afterStar,
            this.getOptionName() + ' must have beforeStar or afterStar property'
        );

        this._beforeStar = options.beforeStar;
        this._afterStar = options.afterStar;
    },

    getOptionName: function() {
        return 'requireSpacesInGenerator';
    },

    check: function(file, errors) {
        var beforeStar = this._beforeStar;
        var afterStar = this._afterStar;

        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {
            if (!node.generator) {
                return;
            }

            var parent = node.parentNode;
            var shorthand = false;

            // shorthand or constructor methods
            if (parent.method || parent.type === 'MethodDefinition') {
                shorthand = true;
                node = parent.key;
            }

            var currentToken = file.getFirstNodeToken(node);

            if (node.async && currentToken.value === 'async') {
                currentToken = file.getNextToken(currentToken);
            }

            if (beforeStar && !shorthand) {
                // currentToken assigned outside of function
                errors.assert.whitespaceBetween({
                    token: currentToken,
                    nextToken: file.getNextToken(currentToken),
                    message: 'Missing space before star'
                });
            }

            if (afterStar) {
                if (shorthand) {
                    currentToken = file.getPrevToken(currentToken);
                } else {
                    // currentToken reassigned for star token
                    currentToken = file.getNextToken(currentToken);
                }

                errors.assert.whitespaceBetween({
                    token: currentToken,
                    nextToken: file.getNextToken(currentToken),
                    message: 'Missing space after star'
                });
            }
        });
    }
};
