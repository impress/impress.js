/**
 * Requires space before and/or after `?` or `:` in conditional expressions.
 *
 * Types: `Object` or `Boolean`
 *
 * Values: `"afterTest"`, `"beforeConsequent"`, `"afterConsequent"`, `"beforeAlternate"` as child properties,
 * or `true` to set all properties to `true`. Child properties must be set to `true`.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInConditionalExpression": {
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
 * var a = b ? c : d;
 * var a= b ? c : d;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = b? c : d;
 * var a = b ?c : d;
 * var a = b ? c: d;
 * var a = b ? c :d;
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
        return 'requireSpacesInConditionalExpression';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['ConditionalExpression'], function(node) {
            var consequent = node.consequent;
            var alternate = node.alternate;
            var consequentToken = file.getFirstNodeToken(consequent);
            var alternateToken = file.getFirstNodeToken(alternate);
            var questionMarkToken = file.findPrevOperatorToken(consequentToken, '?');
            var colonToken = file.findPrevOperatorToken(alternateToken, ':');
            var token;

            if (this._afterTest) {
                token = file.getPrevToken(questionMarkToken);
                errors.assert.whitespaceBetween({
                    token: token,
                    nextToken: questionMarkToken,
                    message: 'Missing space after test'
                });
            }

            if (this._beforeConsequent) {
                token = file.getNextToken(questionMarkToken);
                errors.assert.whitespaceBetween({
                    token: questionMarkToken,
                    nextToken: token,
                    message: 'Missing space before consequent'
                });
            }

            if (this._afterConsequent) {
                token = file.getPrevToken(colonToken);
                errors.assert.whitespaceBetween({
                    token: token,
                    nextToken: colonToken,
                    message: 'Missing space after consequent'
                });
            }

            if (this._beforeAlternate) {
                token = file.getNextToken(colonToken);
                errors.assert.whitespaceBetween({
                    token: colonToken,
                    nextToken: token,
                    message: 'Missing space before alternate'
                });
            }
        }.bind(this));
    }

};
