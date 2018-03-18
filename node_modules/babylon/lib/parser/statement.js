"use strict";

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tokenizerTypes = require("../tokenizer/types");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _utilWhitespace = require("../util/whitespace");

var pp = _index2["default"].prototype;

// ### Statement parsing

// Parse a program. Initializes the parser, reads any number of
// statements, and wraps them in a Program node.  Optionally takes a
// `program` argument.  If present, the statements will be appended
// to its body instead of creating a new node.

pp.parseTopLevel = function (file, program) {
  program.sourceType = this.options.sourceType;
  program.body = [];

  var first = true;
  while (!this.match(_tokenizerTypes.types.eof)) {
    var stmt = this.parseStatement(true, true);
    program.body.push(stmt);
    if (first) {
      if (this.isUseStrict(stmt)) this.setStrict(true);
      first = false;
    }
  }
  this.next();

  file.program = this.finishNode(program, "Program");
  file.comments = this.state.comments;
  file.tokens = this.state.tokens;

  return this.finishNode(file, "File");
};

var loopLabel = { kind: "loop" },
    switchLabel = { kind: "switch" };

// Parse a single statement.
//
// If expecting a statement and finding a slash operator, parse a
// regular expression literal. This is to handle cases like
// `if (foo) /blah/.exec(foo)`, where looking at the previous token
// does not help.

pp.parseStatement = function (declaration, topLevel) {
  if (this.match(_tokenizerTypes.types.at)) {
    this.parseDecorators(true);
  }

  var starttype = this.state.type,
      node = this.startNode();

  // Most types of statements are recognized by the keyword they
  // start with. Many are trivial to parse, some require a bit of
  // complexity.

  switch (starttype) {
    case _tokenizerTypes.types._break:case _tokenizerTypes.types._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case _tokenizerTypes.types._debugger:
      return this.parseDebuggerStatement(node);
    case _tokenizerTypes.types._do:
      return this.parseDoStatement(node);
    case _tokenizerTypes.types._for:
      return this.parseForStatement(node);
    case _tokenizerTypes.types._function:
      if (!declaration) this.unexpected();
      return this.parseFunctionStatement(node);

    case _tokenizerTypes.types._class:
      if (!declaration) this.unexpected();
      this.takeDecorators(node);
      return this.parseClass(node, true);

    case _tokenizerTypes.types._if:
      return this.parseIfStatement(node);
    case _tokenizerTypes.types._return:
      return this.parseReturnStatement(node);
    case _tokenizerTypes.types._switch:
      return this.parseSwitchStatement(node);
    case _tokenizerTypes.types._throw:
      return this.parseThrowStatement(node);
    case _tokenizerTypes.types._try:
      return this.parseTryStatement(node);
    case _tokenizerTypes.types._let:case _tokenizerTypes.types._const:
      if (!declaration) this.unexpected(); // NOTE: falls through to _var
    case _tokenizerTypes.types._var:
      return this.parseVarStatement(node, starttype);
    case _tokenizerTypes.types._while:
      return this.parseWhileStatement(node);
    case _tokenizerTypes.types._with:
      return this.parseWithStatement(node);
    case _tokenizerTypes.types.braceL:
      return this.parseBlock();
    case _tokenizerTypes.types.semi:
      return this.parseEmptyStatement(node);
    case _tokenizerTypes.types._export:
    case _tokenizerTypes.types._import:
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) this.raise(this.state.start, "'import' and 'export' may only appear at the top level");

        if (!this.inModule) this.raise(this.state.start, "'import' and 'export' may appear only with 'sourceType: module'");
      }
      return starttype === _tokenizerTypes.types._import ? this.parseImport(node) : this.parseExport(node);

    case _tokenizerTypes.types.name:
      if (this.options.features["es7.asyncFunctions"] && this.state.value === "async") {
        // peek ahead and see if next token is a function
        var state = this.state.clone();
        this.next();
        if (this.match(_tokenizerTypes.types._function) && !this.canInsertSemicolon()) {
          this.expect(_tokenizerTypes.types._function);
          return this.parseFunction(node, true, false, true);
        } else {
          this.state = state;
        }
      }

    // If the statement does not start with a statement keyword or a
    // brace, it's an ExpressionStatement or LabeledStatement. We
    // simply start parsing an expression, and afterwards, if the
    // next token is a colon and the expression was a simple
    // Identifier node, we switch to interpreting it as a label.
    default:
      var maybeName = this.state.value,
          expr = this.parseExpression();

      if (starttype === _tokenizerTypes.types.name && expr.type === "Identifier" && this.eat(_tokenizerTypes.types.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};

pp.takeDecorators = function (node) {
  if (this.state.decorators.length) {
    node.decorators = this.state.decorators;
    this.state.decorators = [];
  }
};

pp.parseDecorators = function (allowExport) {
  while (this.match(_tokenizerTypes.types.at)) {
    this.state.decorators.push(this.parseDecorator());
  }

  if (allowExport && this.match(_tokenizerTypes.types._export)) {
    return;
  }

  if (!this.match(_tokenizerTypes.types._class)) {
    this.raise(this.state.start, "Leading decorators must be attached to a class declaration");
  }
};

pp.parseDecorator = function () {
  if (!this.options.features["es7.decorators"]) {
    this.unexpected();
  }
  var node = this.startNode();
  this.next();
  node.expression = this.parseMaybeAssign();
  return this.finishNode(node, "Decorator");
};

pp.parseBreakContinueStatement = function (node, keyword) {
  var isBreak = keyword === "break";
  this.next();

  if (this.eat(_tokenizerTypes.types.semi) || this.canInsertSemicolon()) {
    node.label = null;
  } else if (!this.match(_tokenizerTypes.types.name)) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }

  // Verify that there is an actual destination to break or
  // continue to.
  for (var i = 0; i < this.state.labels.length; ++i) {
    var lab = this.state.labels[i];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
      if (node.label && isBreak) break;
    }
  }
  if (i === this.state.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};

pp.parseDebuggerStatement = function (node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};

pp.parseDoStatement = function (node) {
  this.next();
  this.state.labels.push(loopLabel);
  node.body = this.parseStatement(false);
  this.state.labels.pop();
  this.expect(_tokenizerTypes.types._while);
  node.test = this.parseParenExpression();
  this.eat(_tokenizerTypes.types.semi);
  return this.finishNode(node, "DoWhileStatement");
};

// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
// loop is non-trivial. Basically, we have to parse the init `var`
// statement or expression, disallowing the `in` operator (see
// the second parameter to `parseExpression`), and then check
// whether the next token is `in` or `of`. When there is no init
// part (semicolon immediately after the opening parenthesis), it
// is a regular `for` loop.

pp.parseForStatement = function (node) {
  this.next();
  this.state.labels.push(loopLabel);
  this.expect(_tokenizerTypes.types.parenL);

  if (this.match(_tokenizerTypes.types.semi)) {
    return this.parseFor(node, null);
  }

  if (this.match(_tokenizerTypes.types._var) || this.match(_tokenizerTypes.types._let) || this.match(_tokenizerTypes.types._const)) {
    var _init = this.startNode(),
        varKind = this.state.type;
    this.next();
    this.parseVar(_init, true, varKind);
    this.finishNode(_init, "VariableDeclaration");
    if ((this.match(_tokenizerTypes.types._in) || this.isContextual("of")) && _init.declarations.length === 1 && !(varKind !== _tokenizerTypes.types._var && _init.declarations[0].init)) return this.parseForIn(node, _init);
    return this.parseFor(node, _init);
  }

  var refShorthandDefaultPos = { start: 0 };
  var init = this.parseExpression(true, refShorthandDefaultPos);
  if (this.match(_tokenizerTypes.types._in) || this.isContextual("of")) {
    this.toAssignable(init);
    this.checkLVal(init);
    return this.parseForIn(node, init);
  } else if (refShorthandDefaultPos.start) {
    this.unexpected(refShorthandDefaultPos.start);
  }
  return this.parseFor(node, init);
};

pp.parseFunctionStatement = function (node) {
  this.next();
  return this.parseFunction(node, true);
};

pp.parseIfStatement = function (node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement(false);
  node.alternate = this.eat(_tokenizerTypes.types._else) ? this.parseStatement(false) : null;
  return this.finishNode(node, "IfStatement");
};

pp.parseReturnStatement = function (node) {
  if (!this.state.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.state.start, "'return' outside of function");
  }

  this.next();

  // In `return` (and `break`/`continue`), the keywords with
  // optional arguments, we eagerly look for a semicolon or the
  // possibility to insert one.

  if (this.eat(_tokenizerTypes.types.semi) || this.canInsertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }

  return this.finishNode(node, "ReturnStatement");
};

pp.parseSwitchStatement = function (node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(_tokenizerTypes.types.braceL);
  this.state.labels.push(switchLabel);

  // Statements under must be grouped (by label) in SwitchCase
  // nodes. `cur` is used to keep the node that we are currently
  // adding statements to.

  for (var cur, sawDefault; !this.match(_tokenizerTypes.types.braceR);) {
    if (this.match(_tokenizerTypes.types._case) || this.match(_tokenizerTypes.types._default)) {
      var isCase = this.match(_tokenizerTypes.types._case);
      if (cur) this.finishNode(cur, "SwitchCase");
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) this.raise(this.state.lastTokStart, "Multiple default clauses");
        sawDefault = true;
        cur.test = null;
      }
      this.expect(_tokenizerTypes.types.colon);
    } else {
      if (!cur) this.unexpected();
      cur.consequent.push(this.parseStatement(true));
    }
  }
  if (cur) this.finishNode(cur, "SwitchCase");
  this.next(); // Closing brace
  this.state.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};

pp.parseThrowStatement = function (node) {
  this.next();
  if (_utilWhitespace.lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start))) this.raise(this.state.lastTokEnd, "Illegal newline after throw");
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};

// Reused empty array added for node fields that are always empty.

var empty = [];

pp.parseTryStatement = function (node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.match(_tokenizerTypes.types._catch)) {
    var clause = this.startNode();
    this.next();
    this.expect(_tokenizerTypes.types.parenL);
    clause.param = this.parseBindingAtom();
    this.checkLVal(clause.param, true);
    this.expect(_tokenizerTypes.types.parenR);
    clause.body = this.parseBlock();
    node.handler = this.finishNode(clause, "CatchClause");
  }

  node.guardedHandlers = empty;
  node.finalizer = this.eat(_tokenizerTypes.types._finally) ? this.parseBlock() : null;

  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }

  return this.finishNode(node, "TryStatement");
};

pp.parseVarStatement = function (node, kind) {
  this.next();
  this.parseVar(node, false, kind);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};

pp.parseWhileStatement = function (node) {
  this.next();
  node.test = this.parseParenExpression();
  this.state.labels.push(loopLabel);
  node.body = this.parseStatement(false);
  this.state.labels.pop();
  return this.finishNode(node, "WhileStatement");
};

pp.parseWithStatement = function (node) {
  if (this.strict) this.raise(this.state.start, "'with' in strict mode");
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement(false);
  return this.finishNode(node, "WithStatement");
};

pp.parseEmptyStatement = function (node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};

pp.parseLabeledStatement = function (node, maybeName, expr) {
  var _arr = this.state.labels;

  for (var _i = 0; _i < _arr.length; _i++) {
    var label = _arr[_i];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }

  var kind = this.state.type.isLoop ? "loop" : this.match(_tokenizerTypes.types._switch) ? "switch" : null;
  for (var i = this.state.labels.length - 1; i >= 0; i--) {
    var label = this.state.labels[i];
    if (label.statementStart === node.start) {
      label.statementStart = this.state.start;
      label.kind = kind;
    } else {
      break;
    }
  }

  this.state.labels.push({ name: maybeName, kind: kind, statementStart: this.state.start });
  node.body = this.parseStatement(true);
  this.state.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};

pp.parseExpressionStatement = function (node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};

// Parse a semicolon-enclosed block of statements, handling `"use
// strict"` declarations when `allowStrict` is true (used for
// function bodies).

pp.parseBlock = function (allowStrict) {
  var node = this.startNode(),
      first = true,
      oldStrict = undefined;
  node.body = [];
  this.expect(_tokenizerTypes.types.braceL);
  while (!this.eat(_tokenizerTypes.types.braceR)) {
    var stmt = this.parseStatement(true);
    node.body.push(stmt);
    if (first && allowStrict && this.isUseStrict(stmt)) {
      oldStrict = this.strict;
      this.setStrict(this.strict = true);
    }
    first = false;
  }
  if (oldStrict === false) this.setStrict(false);
  return this.finishNode(node, "BlockStatement");
};

// Parse a regular `for` loop. The disambiguation code in
// `parseStatement` will already have parsed the init statement or
// expression.

pp.parseFor = function (node, init) {
  node.init = init;
  this.expect(_tokenizerTypes.types.semi);
  node.test = this.match(_tokenizerTypes.types.semi) ? null : this.parseExpression();
  this.expect(_tokenizerTypes.types.semi);
  node.update = this.match(_tokenizerTypes.types.parenR) ? null : this.parseExpression();
  this.expect(_tokenizerTypes.types.parenR);
  node.body = this.parseStatement(false);
  this.state.labels.pop();
  return this.finishNode(node, "ForStatement");
};

// Parse a `for`/`in` and `for`/`of` loop, which are almost
// same from parser's perspective.

pp.parseForIn = function (node, init) {
  var type = this.match(_tokenizerTypes.types._in) ? "ForInStatement" : "ForOfStatement";
  this.next();
  node.left = init;
  node.right = this.parseExpression();
  this.expect(_tokenizerTypes.types.parenR);
  node.body = this.parseStatement(false);
  this.state.labels.pop();
  return this.finishNode(node, type);
};

// Parse a list of variable declarations.

pp.parseVar = function (node, isFor, kind) {
  node.declarations = [];
  node.kind = kind.keyword;
  for (;;) {
    var decl = this.startNode();
    this.parseVarHead(decl);
    if (this.eat(_tokenizerTypes.types.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (kind === _tokenizerTypes.types._const && !(this.match(_tokenizerTypes.types._in) || this.isContextual("of"))) {
      this.unexpected();
    } else if (decl.id.type !== "Identifier" && !(isFor && (this.match(_tokenizerTypes.types._in) || this.isContextual("of")))) {
      this.raise(this.state.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(_tokenizerTypes.types.comma)) break;
  }
  return node;
};

pp.parseVarHead = function (decl) {
  decl.id = this.parseBindingAtom();
  this.checkLVal(decl.id, true);
};

// Parse a function declaration or literal (depending on the
// `isStatement` parameter).

pp.parseFunction = function (node, isStatement, allowExpressionBody, isAsync) {
  this.initFunction(node, isAsync);
  node.generator = this.eat(_tokenizerTypes.types.star);

  if (isStatement || this.match(_tokenizerTypes.types.name)) {
    node.id = this.parseIdent();
  }

  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody);
  return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
};

pp.parseFunctionParams = function (node) {
  this.expect(_tokenizerTypes.types.parenL);
  node.params = this.parseBindingList(_tokenizerTypes.types.parenR, false, this.options.features["es7.trailingFunctionCommas"]);
};

// Parse a class declaration or literal (depending on the
// `isStatement` parameter).

pp.parseClass = function (node, isStatement) {
  this.next();
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(_tokenizerTypes.types.braceL);
  var decorators = [];
  while (!this.eat(_tokenizerTypes.types.braceR)) {
    if (this.eat(_tokenizerTypes.types.semi)) continue;
    if (this.match(_tokenizerTypes.types.at)) {
      decorators.push(this.parseDecorator());
      continue;
    }
    var method = this.startNode();
    if (decorators.length) {
      method.decorators = decorators;
      decorators = [];
    }
    var isMaybeStatic = this.match(_tokenizerTypes.types.name) && this.state.value === "static";
    var isGenerator = this.eat(_tokenizerTypes.types.star),
        isAsync = false;
    this.parsePropertyName(method);
    method["static"] = isMaybeStatic && !this.match(_tokenizerTypes.types.parenL);
    if (method["static"]) {
      if (isGenerator) this.unexpected();
      isGenerator = this.eat(_tokenizerTypes.types.star);
      this.parsePropertyName(method);
    }
    if (!isGenerator && method.key.type === "Identifier" && !method.computed && this.isClassProperty()) {
      classBody.body.push(this.parseClassProperty(method));
      continue;
    }
    if (this.options.features["es7.asyncFunctions"] && !this.match(_tokenizerTypes.types.parenL) && !method.computed && method.key.type === "Identifier" && method.key.name === "async") {
      isAsync = true;
      this.parsePropertyName(method);
    }
    var isGetSet = false;
    method.kind = "method";
    if (!method.computed) {
      var key = method.key;

      if (!isAsync && !isGenerator && key.type === "Identifier" && !this.match(_tokenizerTypes.types.parenL) && (key.name === "get" || key.name === "set")) {
        isGetSet = true;
        method.kind = key.name;
        key = this.parsePropertyName(method);
      }
      if (!method["static"] && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
        if (hadConstructor) this.raise(key.start, "Duplicate constructor in the same class");
        if (isGetSet) this.raise(key.start, "Constructor can't have get/set modifier");
        if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
        if (isAsync) this.raise(key.start, "Constructor can't be an async function");
        method.kind = "constructor";
        hadConstructor = true;
      }
    }
    if (method.kind === "constructor" && method.decorators) {
      this.raise(method.start, "You can't attach decorators to a class constructor");
    }
    this.parseClassMethod(classBody, method, isGenerator, isAsync);
    if (isGetSet) {
      var paramCount = method.kind === "get" ? 0 : 1;
      if (method.value.params.length !== paramCount) {
        var start = method.value.start;
        if (method.kind === "get") {
          this.raise(start, "getter should have no params");
        } else {
          this.raise(start, "setter should have exactly one param");
        }
      }
    }
  }

  if (decorators.length) {
    this.raise(this.state.start, "You have trailing decorators with no method");
  }

  node.body = this.finishNode(classBody, "ClassBody");
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};

pp.isClassProperty = function () {
  return this.match(_tokenizerTypes.types.eq) || this.match(_tokenizerTypes.types.semi) || this.canInsertSemicolon();
};

pp.parseClassProperty = function (node) {
  if (this.match(_tokenizerTypes.types.eq)) {
    if (!this.options.features["es7.classProperties"]) this.unexpected();
    this.next();
    node.value = this.parseMaybeAssign();
  } else {
    node.value = null;
  }
  this.semicolon();
  return this.finishNode(node, "ClassProperty");
};

pp.parseClassMethod = function (classBody, method, isGenerator, isAsync) {
  method.value = this.parseMethod(isGenerator, isAsync);
  classBody.body.push(this.finishNode(method, "MethodDefinition"));
};

pp.parseClassId = function (node, isStatement) {
  node.id = this.match(_tokenizerTypes.types.name) ? this.parseIdent() : isStatement ? this.unexpected() : null;
};

pp.parseClassSuper = function (node) {
  node.superClass = this.eat(_tokenizerTypes.types._extends) ? this.parseExprSubscripts() : null;
};

// Parses module export declaration.

pp.parseExport = function (node) {
  this.next();
  // export * from '...'
  if (this.match(_tokenizerTypes.types.star)) {
    var specifier = this.startNode();
    this.next();
    if (this.options.features["es7.exportExtensions"] && this.eatContextual("as")) {
      specifier.exported = this.parseIdent();
      node.specifiers = [this.finishNode(specifier, "ExportNamespaceSpecifier")];
      this.parseExportSpecifiersMaybe(node);
      this.parseExportFrom(node, true);
    } else {
      this.parseExportFrom(node, true);
      return this.finishNode(node, "ExportAllDeclaration");
    }
  } else if (this.options.features["es7.exportExtensions"] && this.isExportDefaultSpecifier()) {
    var specifier = this.startNode();
    specifier.exported = this.parseIdent(true);
    node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
    if (this.match(_tokenizerTypes.types.comma) && this.lookahead().type === _tokenizerTypes.types.star) {
      this.expect(_tokenizerTypes.types.comma);
      var _specifier = this.startNode();
      this.expect(_tokenizerTypes.types.star);
      this.expectContextual("as");
      _specifier.exported = this.parseIdent();
      node.specifiers.push(this.finishNode(_specifier, "ExportNamespaceSpecifier"));
    } else {
      this.parseExportSpecifiersMaybe(node);
    }
    this.parseExportFrom(node, true);
  } else if (this.eat(_tokenizerTypes.types._default)) {
    // export default ...
    var possibleDeclaration = this.match(_tokenizerTypes.types._function) || this.match(_tokenizerTypes.types._class);
    var expr = this.parseMaybeAssign();
    var needsSemi = true;
    if (possibleDeclaration) {
      needsSemi = false;
      if (expr.id) {
        expr.type = expr.type === "FunctionExpression" ? "FunctionDeclaration" : "ClassDeclaration";
      }
    }
    node.declaration = expr;
    if (needsSemi) this.semicolon();
    this.checkExport(node);
    return this.finishNode(node, "ExportDefaultDeclaration");
  } else if (this.state.type.keyword || this.shouldParseExportDeclaration()) {
    node.specifiers = [];
    node.source = null;
    node.declaration = this.parseExportDeclaration(node);
  } else {
    // export { x, y as z } [from '...']
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers();
    this.parseExportFrom(node);
  }
  this.checkExport(node);
  return this.finishNode(node, "ExportNamedDeclaration");
};

pp.parseExportDeclaration = function () {
  return this.parseStatement(true);
};

pp.isExportDefaultSpecifier = function () {
  if (this.match(_tokenizerTypes.types.name)) {
    return this.state.value !== "type" && this.state.value !== "async" && this.state.value !== "interface";
  }

  if (!this.match(_tokenizerTypes.types._default)) {
    return false;
  }

  var lookahead = this.lookahead();
  return lookahead.type === _tokenizerTypes.types.comma || lookahead.type === _tokenizerTypes.types.name && lookahead.value === "from";
};

pp.parseExportSpecifiersMaybe = function (node) {
  if (this.eat(_tokenizerTypes.types.comma)) {
    node.specifiers = node.specifiers.concat(this.parseExportSpecifiers());
  }
};

pp.parseExportFrom = function (node, expect) {
  if (this.eatContextual("from")) {
    node.source = this.match(_tokenizerTypes.types.string) ? this.parseExprAtom() : this.unexpected();
    this.checkExport(node);
  } else {
    if (expect) {
      this.unexpected();
    } else {
      node.source = null;
    }
  }

  this.semicolon();
};

pp.shouldParseExportDeclaration = function () {
  return this.options.features["es7.asyncFunctions"] && this.isContextual("async");
};

pp.checkExport = function (node) {
  if (this.state.decorators.length) {
    var isClass = node.declaration && (node.declaration.type === "ClassDeclaration" || node.declaration.type === "ClassExpression");
    if (!node.declaration || !isClass) {
      this.raise(node.start, "You can only use decorators on an export when exporting a class");
    }
    this.takeDecorators(node.declaration);
  }
};

// Parses a comma-separated list of module exports.

pp.parseExportSpecifiers = function () {
  var nodes = [],
      first = true;
  // export { x, y as z } [from '...']
  this.expect(_tokenizerTypes.types.braceL);

  while (!this.eat(_tokenizerTypes.types.braceR)) {
    if (first) {
      first = false;
    } else {
      this.expect(_tokenizerTypes.types.comma);
      if (this.eat(_tokenizerTypes.types.braceR)) break;
    }

    var node = this.startNode();
    node.local = this.parseIdent(this.match(_tokenizerTypes.types._default));
    node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local.__clone();
    nodes.push(this.finishNode(node, "ExportSpecifier"));
  }

  return nodes;
};

// Parses import declaration.

pp.parseImport = function (node) {
  this.next();

  // import '...'
  if (this.match(_tokenizerTypes.types.string)) {
    node.specifiers = [];
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = [];
    this.parseImportSpecifiers(node);
    this.expectContextual("from");
    node.source = this.match(_tokenizerTypes.types.string) ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};

// Parses a comma-separated list of module imports.

pp.parseImportSpecifiers = function (node) {
  var first = true;
  if (this.match(_tokenizerTypes.types.name)) {
    // import defaultObj, { x, y as z } from '...'
    var startPos = this.state.start,
        startLoc = this.state.startLoc;
    node.specifiers.push(this.parseImportSpecifierDefault(this.parseIdent(), startPos, startLoc));
    if (!this.eat(_tokenizerTypes.types.comma)) return;
  }

  if (this.match(_tokenizerTypes.types.star)) {
    var specifier = this.startNode();
    this.next();
    this.expectContextual("as");
    specifier.local = this.parseIdent();
    this.checkLVal(specifier.local, true);
    node.specifiers.push(this.finishNode(specifier, "ImportNamespaceSpecifier"));
    return;
  }

  this.expect(_tokenizerTypes.types.braceL);
  while (!this.eat(_tokenizerTypes.types.braceR)) {
    if (first) {
      first = false;
    } else {
      this.expect(_tokenizerTypes.types.comma);
      if (this.eat(_tokenizerTypes.types.braceR)) break;
    }

    var specifier = this.startNode();
    specifier.imported = this.parseIdent(true);
    specifier.local = this.eatContextual("as") ? this.parseIdent() : specifier.imported.__clone();
    this.checkLVal(specifier.local, true);
    node.specifiers.push(this.finishNode(specifier, "ImportSpecifier"));
  }
};

pp.parseImportSpecifierDefault = function (id, startPos, startLoc) {
  var node = this.startNodeAt(startPos, startLoc);
  node.local = id;
  this.checkLVal(node.local, true);
  return this.finishNode(node, "ImportDefaultSpecifier");
};