"use strict";

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tokenizerTypes = require("../tokenizer/types");

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _utilWhitespace = require("../util/whitespace");

var pp = _index2["default"].prototype;

// ## Parser utilities

// Test whether a statement node is the string literal `"use strict"`.

pp.isUseStrict = function (stmt) {
  return stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.raw.slice(1, -1) === "use strict";
};

// TODO

pp.isRelational = function (op) {
  return this.match(_tokenizerTypes.types.relational) && this.state.value === op;
};

// TODO

pp.expectRelational = function (op) {
  if (this.isRelational(op)) {
    this.next();
  } else {
    this.unexpected();
  }
};

// Tests whether parsed token is a contextual keyword.

pp.isContextual = function (name) {
  return this.match(_tokenizerTypes.types.name) && this.state.value === name;
};

// Consumes contextual keyword if possible.

pp.eatContextual = function (name) {
  return this.state.value === name && this.eat(_tokenizerTypes.types.name);
};

// Asserts that following token is given contextual keyword.

pp.expectContextual = function (name) {
  if (!this.eatContextual(name)) this.unexpected();
};

// Test whether a semicolon can be inserted at the current position.

pp.canInsertSemicolon = function () {
  return this.match(_tokenizerTypes.types.eof) || this.match(_tokenizerTypes.types.braceR) || _utilWhitespace.lineBreak.test(this.input.slice(this.state.lastTokEnd, this.state.start));
};

// Consume a semicolon, or, failing that, see if we are allowed to
// pretend that there is a semicolon at this position.

pp.semicolon = function () {
  if (!this.eat(_tokenizerTypes.types.semi) && !this.canInsertSemicolon()) this.unexpected();
};

// Expect a token of a given type. If found, consume it, otherwise,
// raise an unexpected token error.

pp.expect = function (type) {
  return this.eat(type) || this.unexpected();
};

// Raise an unexpected token error.

pp.unexpected = function (pos) {
  this.raise(pos != null ? pos : this.state.start, "Unexpected token");
};