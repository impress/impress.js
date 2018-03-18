/**
 * Requires parentheses around immediately invoked function expressions.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * JSHint: [`immed`](http://www.jshint.com/docs/options/#immed)
 *
 * #### Example
 *
 * ```js
 * "requireParenthesesAroundIIFE": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = (function(){ return 1; })();
 * var b = (function(){ return 2; }());
 * var c = (function(){ return 3; }).call(this, arg1);
 * var d = (function(){ return 3; }.call(this, arg1));
 * var e = (function(){ return d; }).apply(this, args);
 * var f = (function(){ return d; }.apply(this, args));
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = function(){ return 1; }();
 * var c = function(){ return 3; }.call(this, arg1);
 * var d = function(){ return d; }.apply(this, args);
 * ```
 */

var assert = require('assert');
var utils = require('../utils');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireParenthesesAroundIIFE';
    },

    check: function(file, errors) {

        function isWrapped(node) {
            var openParensToken = file.getPrevToken(file.getFirstNodeToken(node));

            var closingParensToken = file.getNextToken(file.getLastNodeToken(node));
            var closingTokenValue = closingParensToken ? closingParensToken.value : '';

            return openParensToken.value + closingTokenValue === '()';
        }

        file.iterateNodesByType('CallExpression', function(node) {
            var inner = utils.getFunctionNodeFromIIFE(node);

            if (inner && !isWrapped(inner) && !isWrapped(node)) {
                errors.add(
                    'Wrap immediately invoked function expressions in parentheses',
                    node.loc.start.line,
                    node.loc.start.column
                );

            }
        });
    }

};
