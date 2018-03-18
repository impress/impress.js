/**
 * Requires `var` declaration to be on the top of an enclosing scope
 *
 * Types: `Boolean`
 *
 * Values:
 *
 * - `true` specifies that `var` declarations must occur the top of a function scope.
 *
 * #### Example
 *
 * ```js
 * "requireVarDeclFirst": true
 * ```
 *
 * ##### Valid for mode `true`
 *
 * ```js
 * var x = 1,
 *     y = 2;
 * ```
 * ```js
 * 'use strict;'
 * var x = 1,
 *     y = 2;
 * ```
 * ```js
 * var x = 1;
 * var y = 2;
 * ```
 * ```js
 * var x = 1;
 * // comments
 * var y = 2;
 * ```
 * ```js
 * var x = 1;
 * // comments
 * // comments 2
 * var y = 2;
 * ```
 * ```js
 * const a = 1;
 * const b = 2;
 * ```
 * ```js
 * var x = 1;
 * function y() {var z;};
 * ```
 * ```js
 * var x = 1;
 * var y = function () {var z;};
 * ```
 * ```js
 * var w = 1;
 * function x() {
 *  var y;
 * // comments
 * // comments 2
 *  var z;
 * };
 * ```
 * ```js
 * var w = 1;
 * function x() {
 *  "use strict";
 *  var y;
 * };
 * ```
 * ```js
 * var x = 1;
 * var y;
 * for (y = 0; y < 10; y++) {};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x;
 * x = 1;
 * var y = 2;
 * ```
 * ```js
 * var w = 1;
 * function x() {var y;};
 * var z = 2;
 * ```
 * ```js
 * var w = 1;
 * function x() {
 *  var y;
 *  y = 2;
 *  var z;
 * };
 * ```
 * ```js
 * var a;
 * for(var count=0;count < 10;count++){}
 * ```
 * ```js
 * var x;
 * for(var count=0;count < 10;count++){
 *  var y;
 * }
 * ```
 *
 */

var assert = require('assert');

function getVariableScope(node) {
    while (node.type !== 'Program' &&
        node.type !== 'FunctionDeclaration' &&
        node.type !== 'FunctionExpression') {
        node = node.parentNode;
    }

    return node;
}

function getOffsetForBlockStatement(enclosingScope, varDecl, commentTokens, file) {
    var offset = 0;
    var parentNode = varDecl.parentNode;
    if (enclosingScope.type !== 'Program' && parentNode.type === 'BlockStatement') {
        offset += 1;
        offset += getCommentOffsetBetweenNodes(parentNode, varDecl, commentTokens, file);
    }
    return offset;
}

function getUseStrictDeclFirst(enclosingScope) {
    var firstNode;
    if (enclosingScope.type === 'Program') {
        firstNode = enclosingScope.body[0];
    } else {
        firstNode = enclosingScope.body.body[0];
    }

    if (firstNode.type === 'ExpressionStatement' &&
        firstNode.hasOwnProperty('expression') === true &&
        firstNode.expression.hasOwnProperty('value') === true &&
        firstNode.expression.value === 'use strict') {
        return firstNode;
    }

    return null;
}

function isFirstVarDeclInScope(enclosingScope, varDecl, whitespaceOffsetBeforeVarDecl, commentTokens, file) {
    var adjustedVarDeclStart = varDecl.range[0];
    var adjustedScopeStart = enclosingScope.range[0];

    if (enclosingScope.type !== 'Program') {
        // For function declaration and function expression scope use the top block statement as start
        // This removes the requirement to offset the function declaration or expression related tokens
        adjustedScopeStart = enclosingScope.body.range[0];
        // If enclosing scope node type is Program the range start ignores all comments and whitespace before the
        // variable declaration
        adjustedVarDeclStart -= whitespaceOffsetBeforeVarDecl;
    }

    adjustedVarDeclStart -= getOffsetForBlockStatement(enclosingScope, varDecl, commentTokens, file);

    if (adjustedVarDeclStart === adjustedScopeStart) {
        return true;
    }

    return false;
}

function getCommentOffsetBetweenNodes(previousNode, currentNode, commentTokens, file) {
    var count;
    var comment;
    var commentLength = 0;

    for (count = 0; count < commentTokens.length; count++) {
        comment = commentTokens[count];
        if (comment.range[0] >= currentNode.range[1]) {
            // Stop processing comments that are occurred after current node
            break;
        }

        if (previousNode.range[1] < currentNode.range[0] &&
            comment.range[0] > previousNode.range[0] &&
            comment.range[1] < previousNode.range[1]) {
            // Stop processing comments that are within multiple declarators in a single variable declaration
            // of the previous node and the previousNode is not the parent of currentNode
            break;
        }

        if (comment.range[0] > currentNode.range[0] &&
            comment.range[1] < currentNode.range[1]) {
            // Stop processing comments that are within multiple declarators in a single variable declaration
            break;
        }

        if (previousNode.range[0] >= comment.range[1]) {
            // Skip comments that occurred before the previous node
            continue;
        }

        commentLength += comment.range[1] - comment.range[0] + file.getWhitespaceBefore(comment).length;
    }

    return commentLength;
}

function isPreviousNodeAVarDecl(previousNode, varDecl, whitespaceOffsetBeforeVarDecl, commentTokens, file) {
    var offsetForComments;
    if (varDecl.range[0] === previousNode.range[1]) {
        return true;
    }

    offsetForComments = getCommentOffsetBetweenNodes(previousNode, varDecl, commentTokens, file);
    if (varDecl.range[0] - whitespaceOffsetBeforeVarDecl - offsetForComments === previousNode.range[1]) {
        return true;
    }

    return false;
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value'
        );
    },

    getOptionName: function() {
        return 'requireVarDeclFirst';
    },

    check: function(file, errors) {
        var scopesFoundInFile = {};
        var commentTokens = [];

        file.iterateTokensByType(['Line', 'Block'], function(commentToken) {
            commentTokens.push(commentToken);
        });

        file.iterateNodesByType(['VariableDeclaration'], function(varDecl) {
            // Ignore let and const for now #1783
            if (varDecl.kind !== 'var') {
                return;
            }

            var enclosingScope;
            var scopeContents;
            var previousNode;
            var useStrictDirective;
            var isVarDeclFirst = false;

            var whitespaceOffsetBeforeVarDecl = file.getWhitespaceBefore(file.getFirstNodeToken(varDecl)).length;

            enclosingScope = getVariableScope(varDecl.parentNode);
            if (!scopesFoundInFile.hasOwnProperty(enclosingScope.range[0])) {
                scopesFoundInFile[enclosingScope.range[0]] = { hasNonVarDecl: false, varDecl: [] };
                // placing the handling 'use strict' declared as the first statement of scope here to improve
                // performance to run once per scope discovered in file
                useStrictDirective = getUseStrictDeclFirst(enclosingScope);
                if (useStrictDirective !== null) {
                    // Special case to make varDecl stack contain the use strict as first node
                    // this reduces the complexity of the isFirstVarDecInScope and reuses
                    // isPreviousNodeAVarDecl to handle this special scenario
                    scopesFoundInFile[enclosingScope.range[0]].varDecl.push(useStrictDirective);
                }
            }

            scopeContents = scopesFoundInFile[enclosingScope.range[0]];

            if (scopeContents.varDecl.length === 0) {
                isVarDeclFirst = isFirstVarDeclInScope(
                    enclosingScope, varDecl, whitespaceOffsetBeforeVarDecl, commentTokens, file
                );
            } else {
                previousNode = scopeContents.varDecl[scopeContents.varDecl.length - 1];
                if (!scopeContents.hasNonVarDecl) {
                    isVarDeclFirst = isPreviousNodeAVarDecl(
                        previousNode, varDecl, whitespaceOffsetBeforeVarDecl, commentTokens, file
                    );
                }
            }

            scopeContents.varDecl.push(varDecl);
            if (!isVarDeclFirst) {
                scopeContents.hasNonVarDecl = true;
                errors.add('Variable declarations must be the first statements of a function scope.',
                    varDecl.loc.start.line, varDecl.loc.start.column);
            }
        });
    }
};
