/**
 * Requires semicolon after:
 *
 * * var declaration
 * * expression statement
 * * return
 * * throw
 * * break
 * * continue
 * * do-while
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "requireSemicolons": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = 1;
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = 1
 * ```
*/

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'requireSemicolons';
    },

    check: function(file, errors) {
        file.iterateNodesByType([
            'VariableDeclaration',
            'ImportDeclaration',
            'ExportDeclaration',
            'ExportDefaultDeclaration',
            'ExportNamedDeclaration',
            'ExpressionStatement',
            'DoWhileStatement',
            'ReturnStatement',
            'ThrowStatement',
            'BreakStatement',
            'ContinueStatement',
            'DebuggerStatement',
            'ClassProperty'
        ], function(node) {
            // ignore variable declaration inside for and for-in
            if (node.type === 'VariableDeclaration') {
                if ((node.parentNode.type === 'ForInStatement' && node.parentNode.left === node) ||
                    (node.parentNode.type === 'ForOfStatement' && node.parentNode.left === node) ||
                    (node.parentNode.type === 'ForStatement' && node.parentNode.init === node)) {
                    return;
                }
            }

            // don't require semicolon for class and function exports
            if (node.type === 'ExportDefaultDeclaration' ||
                node.type === 'ExportNamedDeclaration') {
                if (node.declaration) {
                    if (node.declaration.type === 'ClassDeclaration' ||
                        node.declaration.type === 'FunctionDeclaration') {
                        return;
                    }
                }
            }

            // get last token inside node
            var lastToken = file.getLastNodeToken(node);
            var checkToken = lastToken;

            // if last token is not a semicolon punctuator, try to get next token in file
            if (checkToken && (checkToken.type !== 'Punctuator' || checkToken.value !== ';')) {
                checkToken = file.getNextToken(checkToken);
            }

            // check token is semicolon
            if (!checkToken || checkToken.type !== 'Punctuator' || checkToken.value !== ';') {
                var entity = lastToken || node;

                errors.cast({
                    message: 'Missing semicolon after statement',
                    line: entity.loc.end.line,
                    column: entity.loc.end.column,
                    additional: entity
                });
            }
        });
    },

    _fix: function(file, error) {
        var token;
        var entity = error.additional;
        var isNode = !!entity.parentNode;

        if (isNode) {
            token = file.getLastNodeToken(entity.parentNode);

        } else {
            token = file.getNextToken(entity, { includeComments: true });
        }

        file.setWhitespaceBefore(token, ';' + file.getWhitespaceBefore(token));
    }
};
