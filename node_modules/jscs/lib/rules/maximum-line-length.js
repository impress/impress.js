/**
 * Requires all lines to be at most the number of characters specified
 *
 * Types: `Integer` or `Object`
 *
 * Values:
 *  - `Integer`: lines should be at most the number of characters specified
 *  - `Object`:
 *     - `value`: (required) lines should be at most the number of characters specified
 *     - `tabSize`: (default: `1`) considered the tab character as number of specified spaces
 *     - `allExcept`: (default: `[]`) an array of conditions that will exempt a line
 *        - `regex`: allows regular expression literals to break the rule
 *        - `comments`: allows comments to break the rule
 *        - `urlComments`: allows comments with long urls to break the rule
 *        - `functionSignature`: allows function definitions to break the rule
 *        - `require`: allows require expressions to break the rule
 *     - `allowRegex`: *deprecated* use `allExcept: ["regex"]` instead
 *     - `allowComments`: *deprecated* use `allExcept: ["comments"]` instead
 *     - `allowUrlComments`: *deprecated* use `allExcept: ["urlComments"]` instead
 *
 * JSHint: [`maxlen`](http://jshint.com/docs/options/#maxlen)
 *
 * #### Example
 *
 * ```js
 * "maximumLineLength": 40
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var aLineOf40Chars = 123456789012345678;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var aLineOf41Chars = 1234567890123456789;
 * ```
 *
 * #### Example for allExcept functionSignature
 *
 * ```js
 * "maximumLineLength": { "value": 40, "allExcept": [ "functionSignature" ] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var f = function(with, many, _many_, arguments) { .... };
 * let f = x => x * x * x * x * x * x * x * x;
 * (function(foo, bar, baz, quux, cuttlefish) {
 *     function namesNaamesNaaamesNaaaames() {
 *         ...
 *     }
 * })();
 * const longNameIgnoredAsWell = (a, b) => a * b;
 * class X { myLongMethodName(withPossiblyManyArgs) { ... } };
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * function x() { // valid
 *     return "function_bodies_are_not_protected";
 * }
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(maximumLineLength) {
        this._tabSize = '';
        this._allowRegex = false;
        this._allowComments = false;
        this._allowUrlComments = false;
        this._allowRequire = false;

        if (typeof maximumLineLength === 'object') {
            assert(
                typeof maximumLineLength.value === 'number',
                this.getOptionName() + ' option requires the "value" property to be defined'
            );

            this._maximumLineLength = maximumLineLength.value;
            var tabSize = maximumLineLength.tabSize || 0;

            while (tabSize--) {
                this._tabSize += ' ';
            }

            var exceptions = maximumLineLength.allExcept || [];
            this._allowRegex = (exceptions.indexOf('regex') !== -1);
            this._allowComments = (exceptions.indexOf('comments') !== -1);
            this._allowUrlComments = (exceptions.indexOf('urlComments') !== -1);
            this._allowFunctionSignature = (exceptions.indexOf('functionSignature') !== -1);
            this._allowRequire = (exceptions.indexOf('require') !== -1);

            if (maximumLineLength.hasOwnProperty('allowRegex')) {
                this._allowRegex = (maximumLineLength.allowRegex === true);
            }
            if (maximumLineLength.hasOwnProperty('allowComments')) {
                this._allowComments = (maximumLineLength.allowComments === true);
            }
            if (maximumLineLength.hasOwnProperty('allowUrlComments')) {
                this._allowUrlComments = (maximumLineLength.allowUrlComments === true);
            }

        } else {
            assert(
                typeof maximumLineLength === 'number',
                this.getOptionName() + ' option requires number value or options object'
            );

            this._maximumLineLength = maximumLineLength;
        }
    },

    getOptionName: function() {
        return 'maximumLineLength';
    },

    check: function(file, errors) {
        var maximumLineLength = this._maximumLineLength;

        var line;
        var lines = this._allowComments ?
            file.getLinesWithCommentsRemoved() : file.getLines();

        // This check should not be destructive
        lines = lines.slice();

        var removeLoc = function(tokenOrNode) {

            // Just in case (See #2107 for example)
            if (!tokenOrNode) {
                return;
            }

            for (var i = tokenOrNode.loc.start.line; i <= tokenOrNode.loc.end.line; i++) {
                lines[i - 1] = '';
            }
        };

        if (this._allowRegex) {
            file.iterateTokensByType('RegularExpression', function(token) {
                removeLoc(token);
            });
        }

        if (this._allowUrlComments) {
            file.iterateTokensByType(['Line', 'Block'], function(comment) {
                for (var i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
                    lines[i - 1] = lines[i - 1].replace(/(http|https|ftp):\/\/[^\s$]+/, '');
                }
            });
        }

        if (this._allowFunctionSignature) {
            file.iterateNodesByType('FunctionDeclaration', function(node) {

                // Need to remove the first line, because we can't be sure there's any id or params
                lines[node.loc.start.line - 1] = '';
                removeLoc(node.id);
                node.params.forEach(removeLoc);
            });

            file.iterateNodesByType('MethodDefinition', function(node) {
                removeLoc(node.key);
            });

            file.iterateNodesByType(['ArrowFunctionExpression', 'FunctionExpression'], function(node) {

                // Need to remove the first line, because we can't be sure there's any id or params
                lines[node.loc.start.line - 1] = '';
                removeLoc(node.id);
                node.params.forEach(removeLoc);
            });
        }

        if (this._allowRequire) {
            file.iterateNodesByType('CallExpression', function(node) {
                if (node.callee.name === 'require') {
                    removeLoc(node);
                }
            });
        }

        for (var i = 0, l = lines.length; i < l; i++) {
            line = this._tabSize ? lines[i].replace(/\t/g, this._tabSize) : lines[i];

            if (line.length > maximumLineLength) {
                errors.add(
                    'Line must be at most ' + maximumLineLength + ' characters',
                    i + 1,
                    lines[i].length
                );
            }
        }
    }

};
