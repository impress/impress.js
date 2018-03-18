/**
 * Requires curly braces after statements.
 *
 * Types: `Array` or `Boolean` or `Object`
 *
 * Values:
 *     - Array of quoted keywords
 *     - `true` to require curly braces after the following keywords
 *     - `Object`
 *         - `'keywords'`
 *             - Array of quoted keywords
 *         - `'allExcept'`
 *             - Array of keywords inside of the block that would allow curly braces
 *             - Ex: ["return" , "continue", "break"]
 *
 * JSHint: [`curly`](http://jshint.com/docs/options/#curly)
 *
 * #### Example
 *
 * ```js
 * "requireCurlyBraces": [
 *     "if",
 *     "else",
 *     "for",
 *     "while",
 *     "do",
 *     "try",
 *     "catch",
 *     "case",
 *     "default"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x) {
 *     x++;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x) x++;
 * ```
 */

var assert = require('assert');
var defaultKeywords = require('../utils').curlyBracedKeywords;

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            Array.isArray(options) || options === true || typeof options === 'object',
            this.getOptionName() + ' option requires array, true value, or object'
        );

        var keywordMap = {
            'return': 'ReturnStatement',
            'break': 'BreakStatement',
            'continue': 'ContinueStatement'
        };

        if (options === true) {
            options = defaultKeywords;
        }

        if (!Array.isArray(options)) {
            assert(
                Array.isArray(options.allExcept),
                this.getOptionName() + '.allExcept ' +
                'property requires an array value'
            );
            assert(
                Array.isArray(options.keywords) || options.keywords === true,
                this.getOptionName() + '.keywords ' +
                'property requires an array value or a value of true'
            );

            if (options.keywords === true) {
                options.keywords = defaultKeywords;
            }

            this._exceptions = options.allExcept.map(function(statementType) {
                return keywordMap[statementType];
            });
            options = options.keywords;
        }

        this._typeIndex = {};
        for (var i = 0, l = options.length; i < l; i++) {
            this._typeIndex[options[i]] = true;
        }
    },

    getOptionName: function() {
        return 'requireCurlyBraces';
    },

    check: function(file, errors) {
        var typeIndex = this._typeIndex;
        var exceptions = this._exceptions;

        function isNotABlockStatement(node) {
            return node && node.type !== 'BlockStatement';
        }

        function addError(typeString, entity) {
            errors.add(
                typeString + ' statement without curly braces',
                entity.loc.start.line,
                entity.loc.start.column
            );
        }

        function checkBody(type, typeString) {
            file.iterateNodesByType(type, function(node) {
                if (isNotABlockStatement(node.body)) {
                    addError(typeString, node);
                }
            });
        }

        if (typeIndex.if || typeIndex.else) {
            file.iterateNodesByType('IfStatement', function(node) {
                if (typeIndex.if && isNotABlockStatement(node.consequent) &&
                    // check exceptions for if and else
                    !(exceptions && exceptions.indexOf(node.consequent.type) !== -1)) {
                    addError('If', node);
                }
                if (typeIndex.else && isNotABlockStatement(node.alternate) &&
                    node.alternate.type !== 'IfStatement' &&
                    // check exceptions for if and else
                    !(exceptions && exceptions.indexOf(node.consequent.type) !== -1)) {
                    addError('Else', file.getPrevToken(file.getFirstNodeToken(node.alternate)));
                }
            });
        }

        if (typeIndex.case || typeIndex.default) {
            file.iterateNodesByType('SwitchCase', function(node) {
                // empty case statement
                if (node.consequent.length === 0) {
                    return;
                }

                if (node.consequent.length === 1 && node.consequent[0].type === 'BlockStatement') {
                    return;
                }

                if (node.test === null && typeIndex.default) {
                    addError('Default', node);
                }

                if (node.test !== null && typeIndex.case) {
                    addError('Case', node);
                }
            });
        }

        if (typeIndex.while) {
            checkBody('WhileStatement', 'While');
        }

        if (typeIndex.for) {
            checkBody('ForStatement', 'For');
            checkBody('ForInStatement', 'For in');
            checkBody('ForOfStatement', 'For of');
        }

        if (typeIndex.do) {
            checkBody('DoWhileStatement', 'Do while');
        }

        if (typeIndex.with) {
            checkBody('WithStatement', 'With');
        }
    }

};
