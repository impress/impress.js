"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var parse = _ref.parse;
  var traverse = _ref.traverse;

  return new Plugin("eval", {
    metadata: {
      group: "builtin-pre"
    },

    visitor: {
      CallExpression: function CallExpression(node) {
        if (this.get("callee").isIdentifier({ name: "eval" }) && node.arguments.length === 1) {
          var evaluate = this.get("arguments")[0].evaluate();
          if (!evaluate.confident) return;

          var code = evaluate.value;
          if (typeof code !== "string") return;

          var ast = parse(code);
          traverse.removeProperties(ast);
          return ast.program;
        }
      }
    }
  });
};

module.exports = exports["default"];