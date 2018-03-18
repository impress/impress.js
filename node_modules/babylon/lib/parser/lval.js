"use strict";

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tokenizerTypes = require("../tokenizer/types");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _utilIdentifier = require("../util/identifier");

var pp = _index2["default"].prototype;

// Convert existing expression atom to assignable pattern
// if possible.

pp.toAssignable = function (node, isBinding) {
  if (node) {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
        break;

      case "ObjectExpression":
        node.type = "ObjectPattern";
        var _arr = node.properties;
        for (var _i = 0; _i < _arr.length; _i++) {
          var prop = _arr[_i];
          if (prop.type === "SpreadProperty") continue;
          if (prop.kind !== "init") this.raise(prop.key.start, "Object pattern can't contain getter or setter");
          this.toAssignable(prop.value, isBinding);
        }
        break;

      case "ArrayExpression":
        node.type = "ArrayPattern";
        this.toAssignableList(node.elements, isBinding);
        break;

      case "AssignmentExpression":
        if (node.operator === "=") {
          node.type = "AssignmentPattern";
          delete node.operator;
        } else {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        break;

      case "MemberExpression":
        if (!isBinding) break;

      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  }
  return node;
};

// Convert list of expression atoms to binding list.

pp.toAssignableList = function (exprList, isBinding) {
  var end = exprList.length;
  if (end) {
    var last = exprList[end - 1];
    if (last && last.type === "RestElement") {
      --end;
    } else if (last && last.type === "SpreadElement") {
      last.type = "RestElement";
      var arg = last.argument;
      this.toAssignable(arg, isBinding);
      if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern") {
        this.unexpected(arg.start);
      }
      --end;
    }
  }
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) this.toAssignable(elt, isBinding);
  }
  return exprList;
};

// Convert list of expression atoms to a list of

pp.toReferencedList = function (exprList) {
  return exprList;
};

// Parses spread element.

pp.parseSpread = function (refShorthandDefaultPos) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(refShorthandDefaultPos);
  return this.finishNode(node, "SpreadElement");
};

pp.parseRest = function () {
  var node = this.startNode();
  this.next();
  node.argument = this.match(_tokenizerTypes.types.name) || this.match(_tokenizerTypes.types.bracketL) ? this.parseBindingAtom() : this.unexpected();
  return this.finishNode(node, "RestElement");
};

// Parses lvalue (assignable) atom.

pp.parseBindingAtom = function () {
  switch (this.state.type) {
    case _tokenizerTypes.types.name:
      return this.parseIdent();

    case _tokenizerTypes.types.bracketL:
      var node = this.startNode();
      this.next();
      node.elements = this.parseBindingList(_tokenizerTypes.types.bracketR, true, true);
      return this.finishNode(node, "ArrayPattern");

    case _tokenizerTypes.types.braceL:
      return this.parseObj(true);

    default:
      this.unexpected();
  }
};

pp.parseBindingList = function (close, allowEmpty, allowTrailingComma) {
  var elts = [],
      first = true;
  while (!this.eat(close)) {
    if (first) first = false;else this.expect(_tokenizerTypes.types.comma);
    if (allowEmpty && this.match(_tokenizerTypes.types.comma)) {
      elts.push(null);
    } else if (allowTrailingComma && this.eat(close)) {
      break;
    } else if (this.match(_tokenizerTypes.types.ellipsis)) {
      elts.push(this.parseAssignableListItemTypes(this.parseRest()));
      this.expect(close);
      break;
    } else {
      var left = this.parseMaybeDefault();
      this.parseAssignableListItemTypes(left);
      elts.push(this.parseMaybeDefault(null, null, left));
    }
  }
  return elts;
};

pp.parseAssignableListItemTypes = function (param) {
  return param;
};

// Parses assignment pattern around given atom if possible.

pp.parseMaybeDefault = function (startPos, startLoc, left) {
  startLoc = startLoc || this.state.startLoc;
  startPos = startPos || this.state.start;
  left = left || this.parseBindingAtom();
  if (!this.eat(_tokenizerTypes.types.eq)) return left;

  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};

// Verify that a node is an lval — something that can be assigned
// to.

pp.checkLVal = function (expr, isBinding, checkClashes) {
  switch (expr.type) {
    case "Identifier":
      if (this.strict && (_utilIdentifier.reservedWords.strictBind(expr.name) || _utilIdentifier.reservedWords.strict(expr.name))) this.raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      if (checkClashes) {
        if (checkClashes[expr.name]) {
          this.raise(expr.start, "Argument name clash in strict mode");
        } else {
          checkClashes[expr.name] = true;
        }
      }
      break;

    case "MemberExpression":
      if (isBinding) this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " member expression");
      break;

    case "ObjectPattern":
      var _arr2 = expr.properties;

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var prop = _arr2[_i2];
        if (prop.type === "Property") prop = prop.value;
        this.checkLVal(prop, isBinding, checkClashes);
      }
      break;

    case "ArrayPattern":
      var _arr3 = expr.elements;

      for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
        var elem = _arr3[_i3];
        if (elem) this.checkLVal(elem, isBinding, checkClashes);
      }
      break;

    case "AssignmentPattern":
      this.checkLVal(expr.left, isBinding, checkClashes);
      break;

    case "SpreadProperty":
    case "RestElement":
      this.checkLVal(expr.argument, isBinding, checkClashes);
      break;

    default:
      this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " rvalue");
  }
};