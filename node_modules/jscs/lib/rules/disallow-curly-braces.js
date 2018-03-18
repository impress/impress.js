/**
 * Disallows curly braces after statements.
 *
 * Types: `Array` or `Boolean`
 *
 * Values: Array of quoted keywords or `true` to disallow curly braces after the following keywords:
 *
 * #### Example
 *
 * ```js
 * "disallowCurlyBraces": [
 *     "if",
 *     "else",
 *     "while",
 *     "for",
 *     "do",
 *     "with"
 * ]
 * ```
 *
 * ##### Valid
 *
 * ```js
 * if (x) x++;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * if (x) {
 *     x++;
 * }
 * ```
 */

var assert = require('assert');
var defaultKeywords = require('../utils').curlyBracedKeywords;

module.exports = function() {};

module.exports.prototype = {

    configure: function(statementTypes) {
        assert(
            Array.isArray(statementTypes) || statementTypes === true,
            this.getOptionName() + ' option requires array or true value'
        );

        if (statementTypes === true) {
            statementTypes = defaultKeywords;
        }

        this._typeIndex = {};
        statementTypes.forEach(function(type) {
            this._typeIndex[type] = true;
        }.bind(this));
    },

    getOptionName: function() {
        return 'disallowCurlyBraces';
    },

    check: function(file, errors) {

        function isSingleBlockStatement(node) {
            return node && node.type === 'BlockStatement' &&
            node.body.length === 1;
        }

        function addError(typeString, entity) {
            errors.add(
                typeString + ' statement with extra curly braces',
                entity.loc.start.line,
                entity.loc.start.column
            );
        }

        function checkBody(type, typeString) {
            file.iterateNodesByType(type, function(node) {
                if (isSingleBlockStatement(node.body)) {
                    addError(typeString, node);
                }
            });
        }

        var typeIndex = this._typeIndex;

        if (typeIndex.if || typeIndex.else) {
            file.iterateNodesByType('IfStatement', function(node) {
                if (typeIndex.if && isSingleBlockStatement(node.consequent)) {
                    addError('If', node);
                }
                if (typeIndex.else && isSingleBlockStatement(node.alternate)) {
                    addError('Else', file.getPrevToken(file.getFirstNodeToken(node.alternate)));
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
