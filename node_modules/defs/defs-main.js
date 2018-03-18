"use strict";

const assert = require("assert");
const is = require("simple-is");
const fmt = require("simple-fmt");
const stringmap = require("stringmap");
const stringset = require("stringset");
const alter = require("alter");
const traverse = require("ast-traverse");
const breakable = require("breakable");
const Scope = require("./scope");
const error = require("./error");
const getline = error.getline;
const options = require("./options");
const Stats = require("./stats");
const jshint_vars = require("./jshint_globals/vars.js");


function isConstLet(kind) {
    return is.someof(kind, ["const", "let"]);
}

function isVarConstLet(kind) {
    return is.someof(kind, ["var", "const", "let"]);
}

function isNonFunctionBlock(node) {
    return node.type === "BlockStatement" && is.noneof(node.$parent.type, ["FunctionDeclaration", "FunctionExpression"]);
}

function isForWithConstLet(node) {
    return node.type === "ForStatement" && node.init && node.init.type === "VariableDeclaration" && isConstLet(node.init.kind);
}

function isForInOfWithConstLet(node) {
    return isForInOf(node) && node.left.type === "VariableDeclaration" && isConstLet(node.left.kind);
}

function isForInOf(node) {
    return is.someof(node.type, ["ForInStatement", "ForOfStatement"]);
}

function isFunction(node) {
    return is.someof(node.type, ["FunctionDeclaration", "FunctionExpression"]);
}

function isLoop(node) {
    return is.someof(node.type, ["ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement"]);
}

function isReference(node) {
    const parent = node.$parent;
    return node.$refToScope ||
        node.type === "Identifier" &&
        !(parent.type === "VariableDeclarator" && parent.id === node) && // var|let|const $
        !(parent.type === "MemberExpression" && parent.computed === false && parent.property === node) && // obj.$
        !(parent.type === "Property" && parent.key === node) && // {$: ...}
        !(parent.type === "LabeledStatement" && parent.label === node) && // $: ...
        !(parent.type === "CatchClause" && parent.param === node) && // catch($)
        !(isFunction(parent) && parent.id === node) && // function $(..
        !(isFunction(parent) && is.someof(node, parent.params)) && // function f($)..
        true;
}

function isLvalue(node) {
    return isReference(node) &&
        ((node.$parent.type === "AssignmentExpression" && node.$parent.left === node) ||
            (node.$parent.type === "UpdateExpression" && node.$parent.argument === node));
}

function createScopes(node, parent) {
    assert(!node.$scope);

    node.$parent = parent;
    node.$scope = node.$parent ? node.$parent.$scope : null; // may be overridden

    if (node.type === "Program") {
        // Top-level program is a scope
        // There's no block-scope under it
        node.$scope = new Scope({
            kind: "hoist",
            node: node,
            parent: null,
        });

    } else if (isFunction(node)) {
        // Function is a scope, with params in it
        // There's no block-scope under it

        node.$scope = new Scope({
            kind: "hoist",
            node: node,
            parent: node.$parent.$scope,
        });

        // function has a name
        if (node.id) {
            assert(node.id.type === "Identifier");

            if (node.type === "FunctionDeclaration") {
                // Function name goes in parent scope for declared functions
                node.$parent.$scope.add(node.id.name, "fun", node.id, null);
            } else if (node.type === "FunctionExpression") {
                // Function name goes in function's scope for named function expressions
                node.$scope.add(node.id.name, "fun", node.id, null);
            } else {
                assert(false);
            }
        }

        node.params.forEach(function(param) {
            node.$scope.add(param.name, "param", param, null);
        });

    } else if (node.type === "VariableDeclaration") {
        // Variable declarations names goes in current scope
        assert(isVarConstLet(node.kind));
        node.declarations.forEach(function(declarator) {
            assert(declarator.type === "VariableDeclarator");
            const name = declarator.id.name;
            if (options.disallowVars && node.kind === "var") {
                error(getline(declarator), "var {0} is not allowed (use let or const)", name);
            }
            node.$scope.add(name, node.kind, declarator.id, declarator.range[1]);
        });

    } else if (isForWithConstLet(node) || isForInOfWithConstLet(node)) {
        // For(In/Of) loop with const|let declaration is a scope, with declaration in it
        // There may be a block-scope under it
        node.$scope = new Scope({
            kind: "block",
            node: node,
            parent: node.$parent.$scope,
        });

    } else if (isNonFunctionBlock(node)) {
        // A block node is a scope unless parent is a function
        node.$scope = new Scope({
            kind: "block",
            node: node,
            parent: node.$parent.$scope,
        });

    } else if (node.type === "CatchClause") {
        const identifier = node.param;

        node.$scope = new Scope({
            kind: "catch-block",
            node: node,
            parent: node.$parent.$scope,
        });
        node.$scope.add(identifier.name, "caught", identifier, null);

        // All hoist-scope keeps track of which variables that are propagated through,
        // i.e. an reference inside the scope points to a declaration outside the scope.
        // This is used to mark "taint" the name since adding a new variable in the scope,
        // with a propagated name, would change the meaning of the existing references.
        //
        // catch(e) is special because even though e is a variable in its own scope,
        // we want to make sure that catch(e){let e} is never transformed to
        // catch(e){var e} (but rather var e$0). For that reason we taint the use of e
        // in the closest hoist-scope, i.e. where var e$0 belongs.
        node.$scope.closestHoistScope().markPropagates(identifier.name);
    }
}

function createTopScope(programScope, environments, globals) {
    function inject(obj) {
        for (let name in obj) {
            const writeable = obj[name];
            const kind = (writeable ? "var" : "const");
            if (topScope.hasOwn(name)) {
                topScope.remove(name);
            }
            topScope.add(name, kind, {loc: {start: {line: -1}}}, -1);
        }
    }

    const topScope = new Scope({
        kind: "hoist",
        node: {},
        parent: null,
    });

    const complementary = {
        undefined: false,
        Infinity: false,
        console: false,
    };

    inject(complementary);
    inject(jshint_vars.reservedVars);
    inject(jshint_vars.ecmaIdentifiers);
    if (environments) {
        environments.forEach(function(env) {
            if (!jshint_vars[env]) {
                error(-1, 'environment "{0}" not found', env);
            } else {
                inject(jshint_vars[env]);
            }
        });
    }
    if (globals) {
        inject(globals);
    }

    // link it in
    programScope.parent = topScope;
    topScope.children.push(programScope);

    return topScope;
}

function setupReferences(ast, allIdentifiers, opts) {
    const analyze = (is.own(opts, "analyze") ? opts.analyze : true);

    function visit(node) {
        if (!isReference(node)) {
            return;
        }
        allIdentifiers.add(node.name);

        const scope = node.$scope.lookup(node.name);
        if (analyze && !scope && options.disallowUnknownReferences) {
            error(getline(node), "reference to unknown global variable {0}", node.name);
        }
        // check const and let for referenced-before-declaration
        if (analyze && scope && is.someof(scope.getKind(node.name), ["const", "let"])) {
            const allowedFromPos = scope.getFromPos(node.name);
            const referencedAtPos = node.range[0];
            assert(is.finitenumber(allowedFromPos));
            assert(is.finitenumber(referencedAtPos));
            if (referencedAtPos < allowedFromPos) {
                if (!node.$scope.hasFunctionScopeBetween(scope)) {
                    error(getline(node), "{0} is referenced before its declaration", node.name);
                }
            }
        }
        node.$refToScope = scope;
    }

    traverse(ast, {pre: visit});
}

// TODO for loops init and body props are parallel to each other but init scope is outer that of body
// TODO is this a problem?

function varify(ast, stats, allIdentifiers, changes) {
    function unique(name) {
        assert(allIdentifiers.has(name));
        for (let cnt = 0; ; cnt++) {
            const genName = name + "$" + String(cnt);
            if (!allIdentifiers.has(genName)) {
                return genName;
            }
        }
    }

    function renameDeclarations(node) {
        if (node.type === "VariableDeclaration" && isConstLet(node.kind)) {
            const hoistScope = node.$scope.closestHoistScope();
            const origScope = node.$scope;

            // text change const|let => var
            changes.push({
                start: node.range[0],
                end: node.range[0] + node.kind.length,
                str: "var",
            });

            node.declarations.forEach(function(declarator) {
                assert(declarator.type === "VariableDeclarator");
                const name = declarator.id.name;

                stats.declarator(node.kind);

                // rename if
                // 1) name already exists in hoistScope, or
                // 2) name is already propagated (passed) through hoistScope or manually tainted
                const rename = (origScope !== hoistScope &&
                    (hoistScope.hasOwn(name) || hoistScope.doesPropagate(name)));

                const newName = (rename ? unique(name) : name);

                origScope.remove(name);
                hoistScope.add(newName, "var", declarator.id, declarator.range[1]);

                origScope.moves = origScope.moves || stringmap();
                origScope.moves.set(name, {
                    name: newName,
                    scope: hoistScope,
                });

                allIdentifiers.add(newName);

                if (newName !== name) {
                    stats.rename(name, newName, getline(declarator));

                    declarator.id.originalName = name;
                    declarator.id.name = newName;

                    // textchange var x => var x$1
                    changes.push({
                        start: declarator.id.range[0],
                        end: declarator.id.range[1],
                        str: newName,
                    });
                }
            });

            // ast change const|let => var
            node.kind = "var";
        }
    }

    function renameReferences(node) {
        if (!node.$refToScope) {
            return;
        }
        const move = node.$refToScope.moves && node.$refToScope.moves.get(node.name);
        if (!move) {
            return;
        }
        node.$refToScope = move.scope;

        if (node.name !== move.name) {
            node.originalName = node.name;
            node.name = move.name;

            if (node.alterop) {
                // node has no range because it is the result of another alter operation
                let existingOp = null;
                for (let i = 0; i < changes.length; i++) {
                    const op = changes[i];
                    if (op.node === node) {
                        existingOp = op;
                        break;
                    }
                }
                assert(existingOp);

                // modify op
                existingOp.str = move.name;
            } else {
                changes.push({
                    start: node.range[0],
                    end: node.range[1],
                    str: move.name,
                });
            }
        }
    }

    traverse(ast, {pre: renameDeclarations});
    traverse(ast, {pre: renameReferences});
    ast.$scope.traverse({pre: function(scope) {
        delete scope.moves;
    }});
}


function detectLoopClosures(ast) {
    traverse(ast, {pre: visit});

    function detectIifyBodyBlockers(body, node) {
        return breakable(function(brk) {
            traverse(body, {pre: function(n) {
                // if we hit an inner function of the loop body, don't traverse further
                if (isFunction(n)) {
                    return false;
                }

                let err = true; // reset to false in else-statement below
                const msg = "loop-variable {0} is captured by a loop-closure that can't be transformed due to use of {1} at line {2}";
                if (n.type === "BreakStatement") {
                    error(getline(node), msg, node.name, "break", getline(n));
                } else if (n.type === "ContinueStatement") {
                    error(getline(node), msg, node.name, "continue", getline(n));
                } else if (n.type === "ReturnStatement") {
                    error(getline(node), msg, node.name, "return", getline(n));
                } else if (n.type === "YieldExpression") {
                    error(getline(node), msg, node.name, "yield", getline(n));
                } else if (n.type === "Identifier" && n.name === "arguments") {
                    error(getline(node), msg, node.name, "arguments", getline(n));
                } else if (n.type === "VariableDeclaration" && n.kind === "var") {
                    error(getline(node), msg, node.name, "var", getline(n));
                } else {
                    err = false;
                }
                if (err) {
                    brk(true); // break traversal
                }
            }});
            return false;
        });
    }

    function visit(node) {
        // forbidden pattern:
        // <any>* <loop> <non-fn>* <constlet-def> <any>* <fn> <any>* <constlet-ref>
        var loopNode = null;
        if (isReference(node) && node.$refToScope && isConstLet(node.$refToScope.getKind(node.name))) {
            // traverse nodes up towards root from constlet-def
            // if we hit a function (before a loop) - ok!
            // if we hit a loop - maybe-ouch
            // if we reach root - ok!
            for (let n = node.$refToScope.node; ; ) {
                if (isFunction(n)) {
                    // we're ok (function-local)
                    return;
                } else if (isLoop(n)) {
                    loopNode = n;
                    // maybe not ok (between loop and function)
                    break;
                }
                n = n.$parent;
                if (!n) {
                    // ok (reached root)
                    return;
                }
            }

            assert(isLoop(loopNode));

            // traverse scopes from reference-scope up towards definition-scope
            // if we hit a function, ouch!
            const defScope = node.$refToScope;
            const generateIIFE = (options.loopClosures === "iife");

            for (let s = node.$scope; s; s = s.parent) {
                if (s === defScope) {
                    // we're ok
                    return;
                } else if (isFunction(s.node)) {
                    // not ok (there's a function between the reference and definition)
                    // may be transformable via IIFE

                    if (!generateIIFE) {
                        const msg = "loop-variable {0} is captured by a loop-closure. Tried \"loopClosures\": \"iife\" in defs-config.json?";
                        return error(getline(node), msg, node.name);
                    }

                    // here be dragons
                    // for (let x = ..; .. ; ..) { (function(){x})() } is forbidden because of current
                    // spec and VM status
                    if (loopNode.type === "ForStatement" && defScope.node === loopNode) {
                        const declarationNode = defScope.getNode(node.name);
                        return error(getline(declarationNode), "Not yet specced ES6 feature. {0} is declared in for-loop header and then captured in loop closure", declarationNode.name);
                    }

                    // speak now or forever hold your peace
                    if (detectIifyBodyBlockers(loopNode.body, node)) {
                        // error already generated
                        return;
                    }

                    // mark loop for IIFE-insertion
                    loopNode.$iify = true;
                }
            }
        }
    }
}

function transformLoopClosures(root, ops, options) {
    function insertOp(pos, str, node) {
        const op = {
            start: pos,
            end: pos,
            str: str,
        }
        if (node) {
            op.node = node;
        }
        ops.push(op);
    }

    traverse(root, {pre: function(node) {
        if (!node.$iify) {
            return;
        }

        const hasBlock = (node.body.type === "BlockStatement");

        const insertHead = (hasBlock ?
            node.body.range[0] + 1 : // just after body {
            node.body.range[0]); // just before existing expression
        const insertFoot = (hasBlock ?
            node.body.range[1] - 1 : // just before body }
            node.body.range[1]);  // just after existing expression

        const forInName = (isForInOf(node) && node.left.declarations[0].id.name);;
        const iifeHead = fmt("(function({0}){", forInName ? forInName : "");
        const iifeTail = fmt("}).call(this{0});", forInName ? ", " + forInName : "");

        // modify AST
        const iifeFragment = options.parse(iifeHead + iifeTail);
        const iifeExpressionStatement = iifeFragment.body[0];
        const iifeBlockStatement = iifeExpressionStatement.expression.callee.object.body;

        if (hasBlock) {
            const forBlockStatement = node.body;
            const tmp = forBlockStatement.body;
            forBlockStatement.body = [iifeExpressionStatement];
            iifeBlockStatement.body = tmp;
        } else {
            const tmp = node.body;
            node.body = iifeExpressionStatement;
            iifeBlockStatement.body[0] = tmp;
        }

        // create ops
        insertOp(insertHead, iifeHead);

        if (forInName) {
            insertOp(insertFoot, "}).call(this, ");

            const args = iifeExpressionStatement.expression.arguments;
            const iifeArgumentIdentifier = args[1];
            iifeArgumentIdentifier.alterop = true;
            insertOp(insertFoot, forInName, iifeArgumentIdentifier);

            insertOp(insertFoot, ");");
        } else {
            insertOp(insertFoot, iifeTail);
        }
    }});
}

function detectConstAssignment(ast) {
    traverse(ast, {pre: function(node) {
        if (isLvalue(node)) {
            const scope = node.$scope.lookup(node.name);
            if (scope && scope.getKind(node.name) === "const") {
                error(getline(node), "can't assign to const variable {0}", node.name);
            }
        }
    }});
}

function detectConstantLets(ast) {
    traverse(ast, {pre: function(node) {
        if (isLvalue(node)) {
            const scope = node.$scope.lookup(node.name);
            if (scope) {
                scope.markWrite(node.name);
            }
        }
    }});

    ast.$scope.detectUnmodifiedLets();
}

function setupScopeAndReferences(root, opts) {
    // setup scopes
    traverse(root, {pre: createScopes});
    const topScope = createTopScope(root.$scope, options.environments, options.globals);

    // allIdentifiers contains all declared and referenced vars
    // collect all declaration names (including those in topScope)
    const allIdentifiers = stringset();
    topScope.traverse({pre: function(scope) {
        allIdentifiers.addMany(scope.decls.keys());
    }});

    // setup node.$refToScope, check for errors.
    // also collects all referenced names to allIdentifiers
    setupReferences(root, allIdentifiers, opts);
    return allIdentifiers;
}

function cleanupTree(root) {
    traverse(root, {pre: function(node) {
        for (let prop in node) {
            if (prop[0] === "$") {
                delete node[prop];
            }
        }
    }});
}

function run(src, config) {
    // alter the options singleton with user configuration
    for (let key in config) {
        options[key] = config[key];
    }

    let parsed;

    if (is.object(src)) {
        if (!options.ast) {
            return {
                errors: [
                    "Can't produce string output when input is an AST. " +
                    "Did you forget to set options.ast = true?"
                ],
            };
        }

        // Received an AST object as src, so no need to parse it.
        parsed = src;

    } else if (is.string(src)) {
        try {
            parsed = options.parse(src, {
                loc: true,
                range: true,
            });
        } catch (e) {
            return {
                errors: [
                    fmt("line {0} column {1}: Error during input file parsing\n{2}\n{3}",
                        e.lineNumber,
                        e.column,
                        src.split("\n")[e.lineNumber - 1],
                        fmt.repeat(" ", e.column - 1) + "^")
                ],
            };
        }

    } else {
        return {
            errors: ["Input was neither an AST object nor a string."],
        };
    }

    const ast = parsed;

    // TODO detect unused variables (never read)
    error.reset();

    let allIdentifiers = setupScopeAndReferences(ast, {});

    // static analysis passes
    detectLoopClosures(ast);
    detectConstAssignment(ast);
    //detectConstantLets(ast);

    const changes = [];
    transformLoopClosures(ast, changes, options);

    //ast.$scope.print(); process.exit(-1);

    if (error.errors.length >= 1) {
        return {
            errors: error.errors,
        };
    }

    if (changes.length > 0) {
        cleanupTree(ast);
        allIdentifiers = setupScopeAndReferences(ast, {analyze: false});
    }
    assert(error.errors.length === 0);

    // change constlet declarations to var, renamed if needed
    // varify modifies the scopes and AST accordingly and
    // returns a list of change fragments (to use with alter)
    const stats = new Stats();
    varify(ast, stats, allIdentifiers, changes);

    if (options.ast) {
        // return the modified AST instead of src code
        // get rid of all added $ properties first, such as $parent and $scope
        cleanupTree(ast);
        return {
            stats: stats,
            ast: ast,
        };
    } else {
        // apply changes produced by varify and return the transformed src
        const transformedSrc = alter(src, changes);
        return {
            stats: stats,
            src: transformedSrc,
        };
    }
}

module.exports = run;
