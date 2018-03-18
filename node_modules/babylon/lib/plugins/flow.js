"use strict";

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tokenizerTypes = require("../tokenizer/types");

var _parser = require("../parser");

var _parser2 = _interopRequireDefault(_parser);

var pp = _parser2["default"].prototype;

pp.flowParseTypeInitialiser = function (tok) {
  var oldInType = this.state.inType;
  this.state.inType = true;
  this.expect(tok || _tokenizerTypes.types.colon);
  var type = this.flowParseType();
  this.state.inType = oldInType;
  return type;
};

pp.flowParseDeclareClass = function (node) {
  this.next();
  this.flowParseInterfaceish(node, true);
  return this.finishNode(node, "DeclareClass");
};

pp.flowParseDeclareFunction = function (node) {
  this.next();

  var id = node.id = this.parseIdent();

  var typeNode = this.startNode();
  var typeContainer = this.startNode();

  if (this.isRelational("<")) {
    typeNode.typeParameters = this.flowParseTypeParameterDeclaration();
  } else {
    typeNode.typeParameters = null;
  }

  this.expect(_tokenizerTypes.types.parenL);
  var tmp = this.flowParseFunctionTypeParams();
  typeNode.params = tmp.params;
  typeNode.rest = tmp.rest;
  this.expect(_tokenizerTypes.types.parenR);
  typeNode.returnType = this.flowParseTypeInitialiser();

  typeContainer.typeAnnotation = this.finishNode(typeNode, "FunctionTypeAnnotation");
  id.typeAnnotation = this.finishNode(typeContainer, "TypeAnnotation");

  this.finishNode(id, id.type);

  this.semicolon();

  return this.finishNode(node, "DeclareFunction");
};

pp.flowParseDeclare = function (node) {
  if (this.match(_tokenizerTypes.types._class)) {
    return this.flowParseDeclareClass(node);
  } else if (this.match(_tokenizerTypes.types._function)) {
    return this.flowParseDeclareFunction(node);
  } else if (this.match(_tokenizerTypes.types._var)) {
    return this.flowParseDeclareVariable(node);
  } else if (this.isContextual("module")) {
    return this.flowParseDeclareModule(node);
  } else if (this.isContextual("type")) {
    return this.flowParseDeclareTypeAlias(node);
  } else if (this.isContextual("interface")) {
    return this.flowParseDeclareInterface(node);
  } else {
    this.unexpected();
  }
};

pp.flowParseDeclareVariable = function (node) {
  this.next();
  node.id = this.flowParseTypeAnnotatableIdentifier();
  this.semicolon();
  return this.finishNode(node, "DeclareVariable");
};

pp.flowParseDeclareModule = function (node) {
  this.next();

  if (this.match(_tokenizerTypes.types.string)) {
    node.id = this.parseExprAtom();
  } else {
    node.id = this.parseIdent();
  }

  var bodyNode = node.body = this.startNode();
  var body = bodyNode.body = [];
  this.expect(_tokenizerTypes.types.braceL);
  while (!this.match(_tokenizerTypes.types.braceR)) {
    var node2 = this.startNode();

    // todo: declare check
    this.next();

    body.push(this.flowParseDeclare(node2));
  }
  this.expect(_tokenizerTypes.types.braceR);

  this.finishNode(bodyNode, "BlockStatement");
  return this.finishNode(node, "DeclareModule");
};

pp.flowParseDeclareTypeAlias = function (node) {
  this.next();
  this.flowParseTypeAlias(node);
  return this.finishNode(node, "DeclareTypeAlias");
};

pp.flowParseDeclareInterface = function (node) {
  this.next();
  this.flowParseInterfaceish(node);
  return this.finishNode(node, "DeclareInterface");
};

// Interfaces

pp.flowParseInterfaceish = function (node, allowStatic) {
  node.id = this.parseIdent();

  if (this.isRelational("<")) {
    node.typeParameters = this.flowParseTypeParameterDeclaration();
  } else {
    node.typeParameters = null;
  }

  node["extends"] = [];
  node.mixins = [];

  if (this.eat(_tokenizerTypes.types._extends)) {
    do {
      node["extends"].push(this.flowParseInterfaceExtends());
    } while (this.eat(_tokenizerTypes.types.comma));
  }

  if (this.isContextual("mixins")) {
    this.next();
    do {
      node.mixins.push(this.flowParseInterfaceExtends());
    } while (this.eat(_tokenizerTypes.types.comma));
  }

  node.body = this.flowParseObjectType(allowStatic);
};

pp.flowParseInterfaceExtends = function () {
  var node = this.startNode();

  node.id = this.parseIdent();
  if (this.isRelational("<")) {
    node.typeParameters = this.flowParseTypeParameterInstantiation();
  } else {
    node.typeParameters = null;
  }

  return this.finishNode(node, "InterfaceExtends");
};

pp.flowParseInterface = function (node) {
  this.flowParseInterfaceish(node, false);
  return this.finishNode(node, "InterfaceDeclaration");
};

// Type aliases

pp.flowParseTypeAlias = function (node) {
  node.id = this.parseIdent();

  if (this.isRelational("<")) {
    node.typeParameters = this.flowParseTypeParameterDeclaration();
  } else {
    node.typeParameters = null;
  }

  node.right = this.flowParseTypeInitialiser(_tokenizerTypes.types.eq);
  this.semicolon();

  return this.finishNode(node, "TypeAlias");
};

// Type annotations

pp.flowParseTypeParameterDeclaration = function () {
  var node = this.startNode();
  node.params = [];

  this.expectRelational("<");
  while (!this.isRelational(">")) {
    node.params.push(this.flowParseTypeAnnotatableIdentifier());
    if (!this.isRelational(">")) {
      this.expect(_tokenizerTypes.types.comma);
    }
  }
  this.expectRelational(">");

  return this.finishNode(node, "TypeParameterDeclaration");
};

pp.flowParseTypeParameterInstantiation = function () {
  var node = this.startNode(),
      oldInType = this.state.inType;
  node.params = [];

  this.state.inType = true;

  this.expectRelational("<");
  while (!this.isRelational(">")) {
    node.params.push(this.flowParseType());
    if (!this.isRelational(">")) {
      this.expect(_tokenizerTypes.types.comma);
    }
  }
  this.expectRelational(">");

  this.state.inType = oldInType;

  return this.finishNode(node, "TypeParameterInstantiation");
};

pp.flowParseObjectPropertyKey = function () {
  return this.match(_tokenizerTypes.types.num) || this.match(_tokenizerTypes.types.string) ? this.parseExprAtom() : this.parseIdent(true);
};

pp.flowParseObjectTypeIndexer = function (node, isStatic) {
  node["static"] = isStatic;

  this.expect(_tokenizerTypes.types.bracketL);
  node.id = this.flowParseObjectPropertyKey();
  node.key = this.flowParseTypeInitialiser();
  this.expect(_tokenizerTypes.types.bracketR);
  node.value = this.flowParseTypeInitialiser();

  this.flowObjectTypeSemicolon();
  return this.finishNode(node, "ObjectTypeIndexer");
};

pp.flowParseObjectTypeMethodish = function (node) {
  node.params = [];
  node.rest = null;
  node.typeParameters = null;

  if (this.isRelational("<")) {
    node.typeParameters = this.flowParseTypeParameterDeclaration();
  }

  this.expect(_tokenizerTypes.types.parenL);
  while (this.match(_tokenizerTypes.types.name)) {
    node.params.push(this.flowParseFunctionTypeParam());
    if (!this.match(_tokenizerTypes.types.parenR)) {
      this.expect(_tokenizerTypes.types.comma);
    }
  }

  if (this.eat(_tokenizerTypes.types.ellipsis)) {
    node.rest = this.flowParseFunctionTypeParam();
  }
  this.expect(_tokenizerTypes.types.parenR);
  node.returnType = this.flowParseTypeInitialiser();

  return this.finishNode(node, "FunctionTypeAnnotation");
};

pp.flowParseObjectTypeMethod = function (startPos, startLoc, isStatic, key) {
  var node = this.startNodeAt(startPos, startLoc);
  node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(startPos, startLoc));
  node["static"] = isStatic;
  node.key = key;
  node.optional = false;
  this.flowObjectTypeSemicolon();
  return this.finishNode(node, "ObjectTypeProperty");
};

pp.flowParseObjectTypeCallProperty = function (node, isStatic) {
  var valueNode = this.startNode();
  node["static"] = isStatic;
  node.value = this.flowParseObjectTypeMethodish(valueNode);
  this.flowObjectTypeSemicolon();
  return this.finishNode(node, "ObjectTypeCallProperty");
};

pp.flowParseObjectType = function (allowStatic) {
  var nodeStart = this.startNode();
  var node;
  var propertyKey;
  var isStatic;

  nodeStart.callProperties = [];
  nodeStart.properties = [];
  nodeStart.indexers = [];

  this.expect(_tokenizerTypes.types.braceL);

  while (!this.match(_tokenizerTypes.types.braceR)) {
    var optional = false;
    var startPos = this.state.start,
        startLoc = this.state.startLoc;
    node = this.startNode();
    if (allowStatic && this.isContextual("static")) {
      this.next();
      isStatic = true;
    }

    if (this.match(_tokenizerTypes.types.bracketL)) {
      nodeStart.indexers.push(this.flowParseObjectTypeIndexer(node, isStatic));
    } else if (this.match(_tokenizerTypes.types.parenL) || this.isRelational("<")) {
      nodeStart.callProperties.push(this.flowParseObjectTypeCallProperty(node, allowStatic));
    } else {
      if (isStatic && this.match(_tokenizerTypes.types.colon)) {
        propertyKey = this.parseIdent();
      } else {
        propertyKey = this.flowParseObjectPropertyKey();
      }
      if (this.isRelational("<") || this.match(_tokenizerTypes.types.parenL)) {
        // This is a method property
        nodeStart.properties.push(this.flowParseObjectTypeMethod(startPos, startLoc, isStatic, propertyKey));
      } else {
        if (this.eat(_tokenizerTypes.types.question)) {
          optional = true;
        }
        node.key = propertyKey;
        node.value = this.flowParseTypeInitialiser();
        node.optional = optional;
        node["static"] = isStatic;
        this.flowObjectTypeSemicolon();
        nodeStart.properties.push(this.finishNode(node, "ObjectTypeProperty"));
      }
    }
  }

  this.expect(_tokenizerTypes.types.braceR);

  return this.finishNode(nodeStart, "ObjectTypeAnnotation");
};

pp.flowObjectTypeSemicolon = function () {
  if (!this.eat(_tokenizerTypes.types.semi) && !this.eat(_tokenizerTypes.types.comma) && !this.match(_tokenizerTypes.types.braceR)) {
    this.unexpected();
  }
};

pp.flowParseGenericType = function (startPos, startLoc, id) {
  var node = this.startNodeAt(startPos, startLoc);

  node.typeParameters = null;
  node.id = id;

  while (this.eat(_tokenizerTypes.types.dot)) {
    var node2 = this.startNodeAt(startPos, startLoc);
    node2.qualification = node.id;
    node2.id = this.parseIdent();
    node.id = this.finishNode(node2, "QualifiedTypeIdentifier");
  }

  if (this.isRelational("<")) {
    node.typeParameters = this.flowParseTypeParameterInstantiation();
  }

  return this.finishNode(node, "GenericTypeAnnotation");
};

pp.flowParseTypeofType = function () {
  var node = this.startNode();
  this.expect(_tokenizerTypes.types._typeof);
  node.argument = this.flowParsePrimaryType();
  return this.finishNode(node, "TypeofTypeAnnotation");
};

pp.flowParseTupleType = function () {
  var node = this.startNode();
  node.types = [];
  this.expect(_tokenizerTypes.types.bracketL);
  // We allow trailing commas
  while (this.state.pos < this.input.length && !this.match(_tokenizerTypes.types.bracketR)) {
    node.types.push(this.flowParseType());
    if (this.match(_tokenizerTypes.types.bracketR)) break;
    this.expect(_tokenizerTypes.types.comma);
  }
  this.expect(_tokenizerTypes.types.bracketR);
  return this.finishNode(node, "TupleTypeAnnotation");
};

pp.flowParseFunctionTypeParam = function () {
  var optional = false;
  var node = this.startNode();
  node.name = this.parseIdent();
  if (this.eat(_tokenizerTypes.types.question)) {
    optional = true;
  }
  node.optional = optional;
  node.typeAnnotation = this.flowParseTypeInitialiser();
  return this.finishNode(node, "FunctionTypeParam");
};

pp.flowParseFunctionTypeParams = function () {
  var ret = { params: [], rest: null };
  while (this.match(_tokenizerTypes.types.name)) {
    ret.params.push(this.flowParseFunctionTypeParam());
    if (!this.match(_tokenizerTypes.types.parenR)) {
      this.expect(_tokenizerTypes.types.comma);
    }
  }
  if (this.eat(_tokenizerTypes.types.ellipsis)) {
    ret.rest = this.flowParseFunctionTypeParam();
  }
  return ret;
};

pp.flowIdentToTypeAnnotation = function (startPos, startLoc, node, id) {
  switch (id.name) {
    case "any":
      return this.finishNode(node, "AnyTypeAnnotation");

    case "void":
      return this.finishNode(node, "VoidTypeAnnotation");

    case "bool":
    case "boolean":
      return this.finishNode(node, "BooleanTypeAnnotation");

    case "mixed":
      return this.finishNode(node, "MixedTypeAnnotation");

    case "number":
      return this.finishNode(node, "NumberTypeAnnotation");

    case "string":
      return this.finishNode(node, "StringTypeAnnotation");

    default:
      return this.flowParseGenericType(startPos, startLoc, id);
  }
};

// The parsing of types roughly parallels the parsing of expressions, and
// primary types are kind of like primary expressions...they're the
// primitives with which other types are constructed.
pp.flowParsePrimaryType = function () {
  var startPos = this.state.start,
      startLoc = this.state.startLoc;
  var node = this.startNode();
  var tmp;
  var type;
  var isGroupedType = false;

  switch (this.state.type) {
    case _tokenizerTypes.types.name:
      return this.flowIdentToTypeAnnotation(startPos, startLoc, node, this.parseIdent());

    case _tokenizerTypes.types.braceL:
      return this.flowParseObjectType();

    case _tokenizerTypes.types.bracketL:
      return this.flowParseTupleType();

    case _tokenizerTypes.types.relational:
      if (this.state.value === "<") {
        node.typeParameters = this.flowParseTypeParameterDeclaration();
        this.expect(_tokenizerTypes.types.parenL);
        tmp = this.flowParseFunctionTypeParams();
        node.params = tmp.params;
        node.rest = tmp.rest;
        this.expect(_tokenizerTypes.types.parenR);

        this.expect(_tokenizerTypes.types.arrow);

        node.returnType = this.flowParseType();

        return this.finishNode(node, "FunctionTypeAnnotation");
      }

    case _tokenizerTypes.types.parenL:
      this.next();

      // Check to see if this is actually a grouped type
      if (!this.match(_tokenizerTypes.types.parenR) && !this.match(_tokenizerTypes.types.ellipsis)) {
        if (this.match(_tokenizerTypes.types.name)) {
          var token = this.lookahead().type;
          isGroupedType = token !== _tokenizerTypes.types.question && token !== _tokenizerTypes.types.colon;
        } else {
          isGroupedType = true;
        }
      }

      if (isGroupedType) {
        type = this.flowParseType();
        this.expect(_tokenizerTypes.types.parenR);

        // If we see a => next then someone was probably confused about
        // function types, so we can provide a better error message
        if (this.eat(_tokenizerTypes.types.arrow)) {
          this.raise(node, "Unexpected token =>. It looks like " + "you are trying to write a function type, but you ended up " + "writing a grouped type followed by an =>, which is a syntax " + "error. Remember, function type parameters are named so function " + "types look like (name1: type1, name2: type2) => returnType. You " + "probably wrote (type1) => returnType");
        }

        return type;
      }

      tmp = this.flowParseFunctionTypeParams();
      node.params = tmp.params;
      node.rest = tmp.rest;

      this.expect(_tokenizerTypes.types.parenR);

      this.expect(_tokenizerTypes.types.arrow);

      node.returnType = this.flowParseType();
      node.typeParameters = null;

      return this.finishNode(node, "FunctionTypeAnnotation");

    case _tokenizerTypes.types.string:
      node.rawValue = node.value = this.state.value;
      node.raw = this.input.slice(this.state.start, this.state.end);
      this.next();
      return this.finishNode(node, "StringLiteralTypeAnnotation");

    case _tokenizerTypes.types._true:case _tokenizerTypes.types._false:
      node.value = this.match(_tokenizerTypes.types._true);
      this.next();
      return this.finishNode(node, "BooleanLiteralTypeAnnotation");

    case _tokenizerTypes.types.num:
      node.rawValue = node.value = this.state.value;
      node.raw = this.input.slice(this.state.start, this.state.end);
      this.next();
      return this.finishNode(node, "NumberLiteralTypeAnnotation");

    case _tokenizerTypes.types._null:
      node.value = this.match(_tokenizerTypes.types._null);
      this.next();
      return this.finishNode(node, "NullLiteralTypeAnnotation");

    case _tokenizerTypes.types._this:
      node.value = this.match(_tokenizerTypes.types._this);
      this.next();
      return this.finishNode(node, "ThisTypeAnnotation");

    default:
      if (this.state.type.keyword === "typeof") {
        return this.flowParseTypeofType();
      }
  }

  this.unexpected();
};

pp.flowParsePostfixType = function () {
  var node = this.startNode();
  var type = node.elementType = this.flowParsePrimaryType();
  if (this.match(_tokenizerTypes.types.bracketL)) {
    this.expect(_tokenizerTypes.types.bracketL);
    this.expect(_tokenizerTypes.types.bracketR);
    return this.finishNode(node, "ArrayTypeAnnotation");
  } else {
    return type;
  }
};

pp.flowParsePrefixType = function () {
  var node = this.startNode();
  if (this.eat(_tokenizerTypes.types.question)) {
    node.typeAnnotation = this.flowParsePrefixType();
    return this.finishNode(node, "NullableTypeAnnotation");
  } else {
    return this.flowParsePostfixType();
  }
};

pp.flowParseIntersectionType = function () {
  var node = this.startNode();
  var type = this.flowParsePrefixType();
  node.types = [type];
  while (this.eat(_tokenizerTypes.types.bitwiseAND)) {
    node.types.push(this.flowParsePrefixType());
  }
  return node.types.length === 1 ? type : this.finishNode(node, "IntersectionTypeAnnotation");
};

pp.flowParseUnionType = function () {
  var node = this.startNode();
  var type = this.flowParseIntersectionType();
  node.types = [type];
  while (this.eat(_tokenizerTypes.types.bitwiseOR)) {
    node.types.push(this.flowParseIntersectionType());
  }
  return node.types.length === 1 ? type : this.finishNode(node, "UnionTypeAnnotation");
};

pp.flowParseType = function () {
  var oldInType = this.state.inType;
  this.state.inType = true;
  var type = this.flowParseUnionType();
  this.state.inType = oldInType;
  return type;
};

pp.flowParseTypeAnnotation = function () {
  var node = this.startNode();
  node.typeAnnotation = this.flowParseTypeInitialiser();
  return this.finishNode(node, "TypeAnnotation");
};

pp.flowParseTypeAnnotatableIdentifier = function (requireTypeAnnotation, canBeOptionalParam) {
  var ident = this.parseIdent();
  var isOptionalParam = false;

  if (canBeOptionalParam && this.eat(_tokenizerTypes.types.question)) {
    this.expect(_tokenizerTypes.types.question);
    isOptionalParam = true;
  }

  if (requireTypeAnnotation || this.match(_tokenizerTypes.types.colon)) {
    ident.typeAnnotation = this.flowParseTypeAnnotation();
    this.finishNode(ident, ident.type);
  }

  if (isOptionalParam) {
    ident.optional = true;
    this.finishNode(ident, ident.type);
  }

  return ident;
};

exports["default"] = function (instance) {
  // function name(): string {}
  instance.extend("parseFunctionBody", function (inner) {
    return function (node, allowExpression) {
      if (this.match(_tokenizerTypes.types.colon) && !allowExpression) {
        // if allowExpression is true then we're parsing an arrow function and if
        // there's a return type then it's been handled elsewhere
        node.returnType = this.flowParseTypeAnnotation();
      }

      return inner.call(this, node, allowExpression);
    };
  });

  instance.extend("parseStatement", function (inner) {
    return function (declaration, topLevel) {
      // strict mode handling of `interface` since it's a reserved word
      if (this.strict && this.match(_tokenizerTypes.types.name) && this.state.value === "interface") {
        var node = this.startNode();
        this.next();
        return this.flowParseInterface(node);
      } else {
        return inner.call(this, declaration, topLevel);
      }
    };
  });

  instance.extend("parseExpressionStatement", function (inner) {
    return function (node, expr) {
      if (expr.type === "Identifier") {
        if (expr.name === "declare") {
          if (this.match(_tokenizerTypes.types._class) || this.match(_tokenizerTypes.types.name) || this.match(_tokenizerTypes.types._function) || this.match(_tokenizerTypes.types._var)) {
            return this.flowParseDeclare(node);
          }
        } else if (this.match(_tokenizerTypes.types.name)) {
          if (expr.name === "interface") {
            return this.flowParseInterface(node);
          } else if (expr.name === "type") {
            return this.flowParseTypeAlias(node);
          }
        }
      }

      return inner.call(this, node, expr);
    };
  });

  instance.extend("shouldParseExportDeclaration", function (inner) {
    return function () {
      return this.isContextual("type") || this.isContextual("interface") || inner.call(this);
    };
  });

  instance.extend("parseParenItem", function () {
    return function (node, startLoc, startPos, forceArrow) {
      if (this.match(_tokenizerTypes.types.colon)) {
        var typeCastNode = this.startNodeAt(startLoc, startPos);
        typeCastNode.expression = node;
        typeCastNode.typeAnnotation = this.flowParseTypeAnnotation();

        if (forceArrow && !this.match(_tokenizerTypes.types.arrow)) {
          this.unexpected();
        }

        if (this.eat(_tokenizerTypes.types.arrow)) {
          // ((lol): number => {});
          var func = this.parseArrowExpression(this.startNodeAt(startLoc, startPos), [node]);
          func.returnType = typeCastNode.typeAnnotation;
          return func;
        } else {
          return this.finishNode(typeCastNode, "TypeCastExpression");
        }
      } else {
        return node;
      }
    };
  });

  instance.extend("parseExport", function (inner) {
    return function (node) {
      node = inner.call(this, node);
      if (node.type === "ExportNamedDeclaration") {
        node.exportKind = node.exportKind || "value";
      }
      return node;
    };
  });

  instance.extend("parseExportDeclaration", function (inner) {
    return function (node) {
      if (this.isContextual("type")) {
        node.exportKind = "type";

        var declarationNode = this.startNode();
        this.next();

        if (this.match(_tokenizerTypes.types.braceL)) {
          // export type { foo, bar };
          node.specifiers = this.parseExportSpecifiers();
          this.parseExportFrom(node);
          return null;
        } else {
          // export type Foo = Bar;
          return this.flowParseTypeAlias(declarationNode);
        }
      } else if (this.isContextual("interface")) {
        node.exportKind = "type";
        var _declarationNode = this.startNode();
        this.next();
        return this.flowParseInterface(_declarationNode);
      } else {
        return inner.call(this, node);
      }
    };
  });

  instance.extend("parseClassId", function (inner) {
    return function (node, isStatement) {
      inner.call(this, node, isStatement);
      if (this.isRelational("<")) {
        node.typeParameters = this.flowParseTypeParameterDeclaration();
      }
    };
  });

  // don't consider `void` to be a keyword as then it'll use the void token type
  // and set startExpr
  instance.extend("isKeyword", function (inner) {
    return function (name) {
      if (this.state.inType && name === "void") {
        return false;
      } else {
        return inner.call(this, name);
      }
    };
  });

  instance.extend("readToken", function (inner) {
    return function (code) {
      if (this.state.inType && (code === 62 || code === 60)) {
        return this.finishOp(_tokenizerTypes.types.relational, 1);
      } else {
        return inner.call(this, code);
      }
    };
  });

  instance.extend("jsx_readToken", function (inner) {
    return function () {
      if (!this.state.inType) return inner.call(this);
    };
  });

  function typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    return node.expression;
  }

  instance.extend("toAssignableList", function (inner) {
    return function (exprList, isBinding) {
      for (var i = 0; i < exprList.length; i++) {
        var expr = exprList[i];
        if (expr && expr.type === "TypeCastExpression") {
          exprList[i] = typeCastToParameter(expr);
        }
      }
      return inner.call(this, exprList, isBinding);
    };
  });

  instance.extend("toReferencedList", function () {
    return function (exprList) {
      for (var i = 0; i < exprList.length; i++) {
        var expr = exprList[i];
        if (expr && expr._exprListItem && expr.type === "TypeCastExpression") {
          this.raise(expr.start, "Unexpected type cast");
        }
      }

      return exprList;
    };
  });

  instance.extend("parseExprListItem", function (inner) {
    return function (allowEmpty, refShorthandDefaultPos) {
      var container = this.startNode();
      var node = inner.call(this, allowEmpty, refShorthandDefaultPos);
      if (this.match(_tokenizerTypes.types.colon)) {
        container._exprListItem = true;
        container.expression = node;
        container.typeAnnotation = this.flowParseTypeAnnotation();
        return this.finishNode(container, "TypeCastExpression");
      } else {
        return node;
      }
    };
  });

  instance.extend("parseClassProperty", function (inner) {
    return function (node) {
      if (this.match(_tokenizerTypes.types.colon)) {
        node.typeAnnotation = this.flowParseTypeAnnotation();
      }
      return inner.call(this, node);
    };
  });

  instance.extend("isClassProperty", function (inner) {
    return function () {
      return this.match(_tokenizerTypes.types.colon) || inner.call(this);
    };
  });

  instance.extend("parseClassMethod", function () {
    return function (classBody, method, isGenerator, isAsync) {
      var typeParameters;
      if (this.isRelational("<")) {
        typeParameters = this.flowParseTypeParameterDeclaration();
      }
      method.value = this.parseMethod(isGenerator, isAsync);
      method.value.typeParameters = typeParameters;
      classBody.body.push(this.finishNode(method, "MethodDefinition"));
    };
  });

  instance.extend("parseClassSuper", function (inner) {
    return function (node, isStatement) {
      inner.call(this, node, isStatement);
      if (node.superClass && this.isRelational("<")) {
        node.superTypeParameters = this.flowParseTypeParameterInstantiation();
      }
      if (this.isContextual("implements")) {
        this.next();
        var implemented = node["implements"] = [];
        do {
          var _node = this.startNode();
          _node.id = this.parseIdent();
          if (this.isRelational("<")) {
            _node.typeParameters = this.flowParseTypeParameterInstantiation();
          } else {
            _node.typeParameters = null;
          }
          implemented.push(this.finishNode(_node, "ClassImplements"));
        } while (this.eat(_tokenizerTypes.types.comma));
      }
    };
  });

  instance.extend("parseObjPropValue", function (inner) {
    return function (prop) {
      var typeParameters;

      // method shorthand
      if (this.isRelational("<")) {
        typeParameters = this.flowParseTypeParameterDeclaration();
        if (!this.match(_tokenizerTypes.types.parenL)) this.unexpected();
      }

      inner.apply(this, arguments);

      // add typeParameters if we found them
      if (typeParameters) {
        prop.value.typeParameters = typeParameters;
      }
    };
  });

  instance.extend("parseAssignableListItemTypes", function () {
    return function (param) {
      if (this.eat(_tokenizerTypes.types.question)) {
        param.optional = true;
      }
      if (this.match(_tokenizerTypes.types.colon)) {
        param.typeAnnotation = this.flowParseTypeAnnotation();
      }
      this.finishNode(param, param.type);
      return param;
    };
  });

  instance.extend("parseImportSpecifiers", function (inner) {
    return function (node) {
      node.importKind = "value";

      var kind = this.match(_tokenizerTypes.types._typeof) ? "typeof" : this.isContextual("type") ? "type" : null;
      if (kind) {
        var lh = this.lookahead();
        if (lh.type === _tokenizerTypes.types.name && lh.value !== "from" || lh.type === _tokenizerTypes.types.braceL || lh.type === _tokenizerTypes.types.star) {
          this.next();
          node.importKind = kind;
        }
      }

      inner.call(this, node);
    };
  });

  // function foo<T>() {}
  instance.extend("parseFunctionParams", function (inner) {
    return function (node) {
      if (this.isRelational("<")) {
        node.typeParameters = this.flowParseTypeParameterDeclaration();
      }
      inner.call(this, node);
    };
  });

  // var foo: string = bar
  instance.extend("parseVarHead", function (inner) {
    return function (decl) {
      inner.call(this, decl);
      if (this.match(_tokenizerTypes.types.colon)) {
        decl.id.typeAnnotation = this.flowParseTypeAnnotation();
        this.finishNode(decl.id, decl.id.type);
      }
    };
  });

  // var foo = (async (): number => {});
  instance.extend("parseAsyncArrowFromCallExpression", function (inner) {
    return function (node, call) {
      if (this.match(_tokenizerTypes.types.colon)) {
        node.returnType = this.flowParseTypeAnnotation();
      }

      return inner.call(this, node, call);
    };
  });

  instance.extend("parseParenAndDistinguishExpression", function (inner) {
    return function (startPos, startLoc, canBeArrow, isAsync) {
      startPos = startPos || this.state.start;
      startLoc = startLoc || this.state.startLoc;

      if (this.lookahead().type === _tokenizerTypes.types.parenR) {
        // var foo = (): number => {};
        this.expect(_tokenizerTypes.types.parenL);
        this.expect(_tokenizerTypes.types.parenR);

        var node = this.startNodeAt(startPos, startLoc);
        if (this.match(_tokenizerTypes.types.colon)) node.returnType = this.flowParseTypeAnnotation();
        this.expect(_tokenizerTypes.types.arrow);
        return this.parseArrowExpression(node, [], isAsync);
      } else {
        // var foo = (foo): number => {};
        var node = inner.call(this, startPos, startLoc, canBeArrow, isAsync);

        if (this.match(_tokenizerTypes.types.colon)) {
          var state = this.state.clone();
          try {
            return this.parseParenItem(node, startPos, startLoc, true);
          } catch (err) {
            if (err instanceof SyntaxError) {
              this.state = state;
              return node;
            } else {
              throw err;
            }
          }
        } else {
          return node;
        }
      }
    };
  });
};

module.exports = exports["default"];