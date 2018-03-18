/**
 * Validates indentation for switch statements and block statements
 *
 * Types: `Integer`, `String` or `Object`
 *
 * Values:
 *  - `Integer`: A positive number of spaces
 *  - `String`: `"\t"` for tab indentation
 *  - `Object`:
 *     - `value`: (required) the same effect as the non-object values
 *     - `includeEmptyLines` (*deprecated*): (default: `false`) require empty lines to be indented
 *     - `'allExcept'` array of exceptions:
 *       - `'comments'` ignores comments
 *       - `'emptyLines'` ignore empty lines, included by default
 *
 * JSHint: [`indent`](http://jshint.com/docs/options/#indent)
 *
 * #### Example
 *
 * ```js
 * "validateIndentation": "\t"
 * ```
 *
 * ##### Valid example for mode `2`
 *
 * ```js
 * if (a) {
 *   b=c;
 *   function(d) {
 *     e=f;
 *   }
 * }
 * ```
 *
 * ##### Invalid example for mode `2`
 *
 * ```js
 * if (a) {
 *    b=c;
 * function(d) {
 *        e=f;
 * }
 * }
 * ```
 *
 * ##### Valid example for mode `"\t"`
 *
 * ```js
 * if (a) {
 *     b=c;
 *     function(d) {
 *         e=f;
 *     }
 * }
 * ```
 *
 * ##### Invalid example for mode `"\t"`
 *
 * ```js
 * if (a) {
 *      b=c;
 * function(d) {
 *            e=f;
 *  }
 * }
 * ```
 *
 * ##### Valid example for mode `{ "value": "\t", "includeEmptyLines": true }`
 * ```js
 * if (a) {
 *     b=c;
 *     function(d) {
 *         e=f;
 *     }
 *
 * } // single tab character on previous line
 * ```
 *
 * ##### Invalid example for mode `{ "value": "\t", "includeEmptyLines": true }`
 * ```js
 * if (a) {
 *     b=c;
 *     function(d) {
 *         e=f;
 *     }
 *
 * } // no tab character on previous line
 * ```
 *
 * ##### Valid example for mode `{ "value": "\t", "allExcept": ["comments"] }`
 * ```js
 * if (a) {
 *     b=c;
 * //    e=f
 * }
 * ```
 */

var assert = require('assert');
var utils = require('../utils');

var blockParents = [
    'IfStatement',
    'WhileStatement',
    'DoWhileStatement',
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowExpression',
    'CatchClause'
];

var indentableNodes = {
    BlockStatement: 'body',
    Program: 'body',
    ObjectExpression: 'properties',
    ArrayExpression: 'elements',
    SwitchStatement: 'cases',
    SwitchCase: 'consequent'
};

module.exports = function() {};

module.exports.prototype = {

    configure: function(options) {
        this._includeEmptyLines = false;
        this._exceptComments = false;

        if (typeof options === 'object') {
            this._includeEmptyLines = (options.includeEmptyLines === true);
            if (Array.isArray(options.allExcept)) {
                this._exceptComments = options.allExcept.indexOf('comments') > -1;
                this._includeEmptyLines = options.allExcept.indexOf('emptyLines') > -1;
            }

            options = options.value;
        }

        assert(
            options === '\t' ||
                (typeof options === 'number' && options > 0),
            this.getOptionName() + ' option requires a positive number of spaces or "\\t"' +
            ' or options object with "value" property'
        );

        if (typeof options === 'number') {
            this._indentChar = ' ';
            this._indentSize = options;
        } else {
            this._indentChar = '\t';
            this._indentSize = 1;
        }

        this._breakIndents = null;
        this._moduleIndents = null;
    },

    getOptionName: function() {
        return 'validateIndentation';
    },

    check: function(file, errors) {
        function markCheckLine(line) {
            linesToCheck[line].check = true;
        }

        function markCheck(node) {
            markCheckLine(node.loc.start.line - 1);
        }

        function markEndCheck(node) {
            markCheckLine(node.loc.end.line - 1);
        }

        function markPush(node, indents) {
            linesToCheck[node.loc.start.line - 1].push.push(indents);
        }

        function markPop(node, outdents) {
            linesToCheck[node.loc.end.line - 1].pop.push(outdents);
        }

        function markPushAlt(node) {
            linesToCheck[node.loc.start.line - 1].pushAltLine.push(node.loc.end.line - 1);
        }

        function markCase(caseNode, children) {
            var outdentNode = getCaseOutdent(children);

            if (outdentNode) {
                // If a case statement has a `break` as a direct child and it is the
                // first one encountered, use it as the example for all future case indentation
                if (_this._breakIndents === null) {
                    _this._breakIndents = (caseNode.loc.start.column === outdentNode.loc.start.column) ? 1 : 0;
                }
                markPop(outdentNode, _this._breakIndents);
            } else {
                markPop(caseNode, 0);
            }
        }

        function markChildren(node) {
            getChildren(node).forEach(function(childNode) {
                if (childNode.loc.start.line !== node.loc.start.line) {
                    markCheck(childNode);
                }
            });
        }

        function markKeyword(node) {
            if (node) {
                markCheck(file.getPrevToken(file.getFirstNodeToken(node)));
            }
        }

        function isMultiline(node) {
            return node.loc.start.line !== node.loc.end.line;
        }

        function getCaseOutdent(caseChildren) {
            var outdentNode;
            caseChildren.some(function(node) {
                if (node.type === 'BreakStatement') {
                    outdentNode = node;
                    return true;
                }
            });

            return outdentNode;
        }

        function getBlockNodeToPush(node) {
            var parent = node.parentNode;

            // The parent of an else is the entire if/else block. To avoid over indenting
            // in the case of a non-block if with a block else, mark push where the else starts,
            // not where the if starts!
            if (parent.type === 'IfStatement' && parent.alternate === node) {
                return node;
            }

            // The end line to check of a do while statement needs to be the location of the
            // closing curly brace, not the while statement, to avoid marking the last line of
            // a multiline while as a line to check.
            if (parent.type === 'DoWhileStatement') {
                return node;
            }

            // Detect bare blocks: a block whose parent doesn't expect blocks in its syntax specifically.
            if (blockParents.indexOf(parent.type) === -1) {
                return node;
            }

            return parent;
        }

        function getChildren(node) {
            var childrenProperty = indentableNodes[node.type];
            return node[childrenProperty];
        }

        function getIndentationFromLine(line) {
            var firstContent = line.search(rNotIndentChar);
            if (firstContent === -1) {
                firstContent = line.length;
            }
            return firstContent;
        }

        function checkIndentations() {
            var lineAugment = 0;

            linesToCheck.forEach(function(line, i) {
                var lineNumber = i + 1;
                var actualIndentation = line.indentation;
                var expectedIndentation = getExpectedIndentation(line, actualIndentation);

                // do not augment this line considering this line changes indentation
                if (line.pop.length || line.push.length) {
                    lineAugment = 0;
                }

                if (line.check) {
                    errors.assert.indentation({
                        lineNumber: lineNumber,
                        actual: actualIndentation,
                        expected: expectedIndentation,
                        indentChar: indentChar
                    });

                    // for multiline statements, we need move subsequent lines over the correct
                    // number of spaces to match the change made to the first line of the statement.
                    lineAugment = expectedIndentation - actualIndentation;

                    // correct the indentation so that future lines can be validated appropriately
                    actualIndentation = expectedIndentation;
                } else if (!line.empty) {
                    // in the case that we moved a previous line over a certain number spaces,
                    // we need to move this line over as well, but technically, it's not an error
                    errors.assert.indentation({
                        lineNumber: lineNumber,
                        actual: actualIndentation,
                        // Avoid going negative in the case that a previous line was overindented,
                        // and now outdenting a line that is already at column zero.
                        expected: Math.max(actualIndentation + lineAugment, 0),
                        indentChar: indentChar,
                        silent: true
                    });
                }

                if (line.push.length) {
                    pushExpectedIndentations(line, actualIndentation);
                }
            });
        }

        function getExpectedIndentation(line, actual) {
            var outdent = indentSize * Math.max.apply(null, line.pop);

            var idx = indentStack.length - 1;
            var expected = indentStack[idx];

            if (!Array.isArray(expected)) {
                expected = [expected];
            }

            expected = expected.map(function(value) {
                if (line.pop.length) {
                    value -= outdent;
                }

                return value;
            }).reduce(function(previous, current) {
                // when the expected is an array, resolve the value
                // back into a Number by checking both values are the actual indentation
                return actual === current ? current : previous;
            });

            indentStack[idx] = expected;

            line.pop.forEach(function() {
                indentStack.pop();
            });

            return expected;
        }

        function pushExpectedIndentations(line, actualIndentation) {
            var indents = Math.max.apply(null, line.push);

            var expected = actualIndentation + (indentSize * indents);

            // when a line has alternate indentations, push an array of possible values
            // on the stack, to be resolved when checked against an actual indentation
            if (line.pushAltLine.length) {
                expected = [expected];
                line.pushAltLine.forEach(function(altLine) {
                    expected.push(linesToCheck[altLine].indentation + (indentSize * indents));
                });
            }

            line.push.forEach(function() {
                indentStack.push(expected);
            });
        }

        function setModuleBody(node) {
            if (node.body.length !== 1 || node.body[0].type !== 'ExpressionStatement' ||
                node.body[0].expression.type !== 'CallExpression') {
                return;
            }

            var callExpression = node.body[0].expression;
            var callee = callExpression.callee;
            var callArgs = callExpression.arguments;
            var iffeFunction = utils.getFunctionNodeFromIIFE(callExpression);

            if (iffeFunction) {
                if (callArgs.length === 1 && callArgs[0].type === 'FunctionExpression') {
                    // detect UMD Shim, where the file body is the body of the factory,
                    // which is the sole argument to the IIFE
                    moduleBody = callArgs[0].body;
                } else {
                    // full file IIFE
                    moduleBody = iffeFunction.body;
                }
            }

            // detect require/define
            if (callee.type === 'Identifier' && callee.name.match(/^(require|define)$/)) {
                // the define callback is the *first* functionExpression encountered,
                // as it can be the first, second, or third argument.
                callArgs.some(function(argument) {
                    if (argument.type === 'FunctionExpression') {
                        moduleBody = argument.body;
                        return true;
                    }
                });
            }

            // set number of indents for modules by detecting
            // whether the first statement is indented or not
            if (moduleBody && moduleBody.body.length) {
                _this._moduleIndents = moduleBody.body[0].loc.start.column > 0 ? 1 : 0;
            }
        }

        function generateIndentations() {
            file.iterateNodesByType('Program', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                setModuleBody(node);
                markChildren(node);
            });

            file.iterateNodesByType('BlockStatement', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                var indents = node === moduleBody ? _this._moduleIndents : 1;

                markChildren(node);
                markPop(node, indents);
                markPush(getBlockNodeToPush(node), indents);
                markEndCheck(node);
            });

            file.iterateNodesByType('ObjectExpression', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                var children = getChildren(node);

                // only check objects that have children and that look like they are trying to adhere
                // to an indentation strategy, i.e. objects that have curly braces on their own lines.
                if (!children.length || node.loc.start.line === children[0].loc.start.line ||
                    node.loc.end.line === children[children.length - 1].loc.end.line) {
                    return;
                }

                markChildren(node);
                markPop(node, 1);
                markPush(node, 1);
                markEndCheck(node);
                markPushAlt(node);
            });

            file.iterateNodesByType('IfStatement', function(node) {
                markKeyword(node.alternate);
            });

            file.iterateNodesByType('TryStatement', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                var handler = node.handlers && node.handlers.length ? node.handlers[0] : node.handler;
                if (handler) {
                    markCheck(handler);
                }
                markKeyword(node.finalizer);
            });

            file.iterateNodesByType('SwitchStatement', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                var indents = 1;
                var children = getChildren(node);

                if (children.length < 1) {
                    return;
                }

                if (node.loc.start.column === children[0].loc.start.column) {
                    indents = 0;
                }

                markChildren(node);
                markPop(node, indents);
                markPush(node, indents);
                markEndCheck(node);
            });

            file.iterateNodesByType('SwitchCase', function(node) {
                if (!isMultiline(node)) {
                    return;
                }

                var children = getChildren(node);

                if (children.length === 1 && children[0].type === 'BlockStatement') {
                    return;
                }

                markPush(node, 1);
                markCheck(node);
                markChildren(node);

                markCase(node, children);
            });

            // indentations inside of function expressions can be offset from
            // either the start of the function or the end of the function, therefore
            // mark all starting lines of functions as potential indentations
            file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {
                markPushAlt(node);
            });

            if (_this._includeEmptyLines) {
                linesToCheck.forEach(function(line) {
                    if (line.empty) {
                        line.check = true;
                    }
                });
            }

            if (!_this._exceptComments) {
                // starting from the bottom, which allows back to back comments to be checked, mark comments
                file.getComments().concat().reverse().forEach(function(node) {
                    var startLine = node.loc.start.line;
                    var firstToken = file.getFirstTokenOnLine(startLine, { includeComments: true });

                    var nextToken = file.getNextToken(firstToken, { includeComments: true });
                    var nextStartLine = nextToken.loc.start.line;

                    var nextLine = linesToCheck[nextStartLine - 1];

                    // ignore if not the only token on the line, or not right above another checked line
                    if (firstToken !== node || startLine === nextStartLine || !nextLine.check) {
                        return;
                    }

                    // ignore if next line is a case statement, which is kind of hacky, but avoids
                    // additional complexity for what qualifies as an outdent
                    if (nextToken && nextToken.type === 'Keyword' &&
                      (nextToken.value === 'case' || nextToken.value === 'default')) {
                        return;
                    }

                    // ignore if above a line that both introduces and ends an ident,
                    // which catches cases like a comment above an `else if`, but not nested ifs.
                    if (nextLine.push.length && nextLine.pop.length) {
                        return;
                    }

                    markCheck(node);
                });
            }
        }

        var _this = this;

        var moduleBody;

        var indentChar = this._indentChar;
        var indentSize = this._indentSize;
        var rNotIndentChar = new RegExp('[^' + indentChar + ']');

        var indentStack = [0];
        var linesToCheck = file.getLines().map(function(line) {
            return {
                push: [],
                pushAltLine: [],
                pop: [],
                check: false,
                indentation: getIndentationFromLine(line),
                empty: line.match(/^\s*$/)
            };
        });

        generateIndentations();
        checkIndentations();
    }

};
