/**
 * Disallows space before and/or after `?` or `:` in conditional expressions.
 *
 * Types: `Object` or `Boolean`
 *
 * Values: `"afterTest"`, `"beforeConsequent"`, `"afterConsequent"`, `"beforeAlternate"` as child properties,
 * or `true` to set all properties to true. Child properties must be set to `true`. These token names correspond to:
 *
 * ```
 * var a = b ? c : d;
 *          ^ ^ ^ ^
 *          | | | |
 *          | | | └- beforeAlternate
 *          | | └--- afterConsequent
 *          | └-------- beforeConsequent
 *          └---------- afterTest
 * ```
 *
 * #### Example
 *
 * ```js
 * "disallowSpacesInConditionalExpression": {
 *     "afterTest": true,
 *     "beforeConsequent": true,
 *     "afterConsequent": true,
 *     "beforeAlternate": true
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = b?c:d;
 * var a= b?c:d;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = b ?c:d;
 * var a = b? c:d;
 * var a = b?c :d;
 * var a = b?c: d;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        var validProperties = [
            'afterTest',
            'beforeConsequent',
            'afterConsequent',
            'beforeAlternate'
        ];
        var optionName = this.getOptionName();

        if (options === true) {
            options = {
                'afterTest': true,
                'beforeConsequent': true,
                'afterConsequent': true,
                'beforeAlternate': true
            };
        }

        assert(
            typeof options === 'object',
            optionName + ' option requires a true value or an object'
        );

        var isProperlyConfigured = validProperties.some(function(key) {
            var isPresent = key in options;

            if (isPresent) {
                assert(
                    options[key] === true,
                    optionName + '.' + key + ' property requires true value or should be removed'
                );
            }

            return isPresent;
        });

        assert(
            isProperlyConfigured,
            optionName + ' must have at least 1 of the following properties: ' + validProperties.join(', ')
        );

        validProperties.forEach(function(property) {
            this['_' + property] = Boolean(options[property]);
        }.bind(this));
    },

    getOptionName: function() {
        return 'disallowSpacesInConditionalExpression';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['ConditionalExpression'], function(node) {

            var test = node.test;
            var consequent = node.consequent;
            var consequentToken = file.getFirstNodeToken(consequent);
            var alternate = node.alternate;
            var alternateToken = file.getFirstNodeToken(alternate);
            var questionMarkToken = file.findPrevOperatorToken(consequentToken, '?');
            var colonToken = file.findPrevOperatorToken(alternateToken, ':');
            var token;

            if (this._afterTest && test.loc.end.line === questionMarkToken.loc.start.line) {
                token = file.getPrevToken(questionMarkToken);

                errors.assert.noWhitespaceBetween({
                    token: token,
                    nextToken: questionMarkToken,
                    message: 'Illegal space after test'
                });
            }

            if (this._beforeConsequent && consequent.loc.end.line === questionMarkToken.loc.start.line) {
                token = file.getNextToken(questionMarkToken);

                errors.assert.noWhitespaceBetween({
                    token: questionMarkToken,
                    nextToken: token,
                    message: 'Illegal space before consequent'
                });
            }

            if (this._afterConsequent && consequent.loc.end.line === colonToken.loc.start.line) {
                token = file.getPrevToken(colonToken);

                errors.assert.noWhitespaceBetween({
                    token: token,
                    nextToken: colonToken,
                    message: 'Illegal space after consequent'
                });
            }

            if (this._beforeAlternate && alternate.loc.end.line === colonToken.loc.start.line) {
                token = file.getNextToken(colonToken);
                errors.assert.noWhitespaceBetween({
                    token: colonToken,
                    nextToken: token,
                    message: 'Illegal space before alternate'
                });
            }
        }.bind(this));
    }

};
