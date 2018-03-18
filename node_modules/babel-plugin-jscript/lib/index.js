"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("jscript", {
    metadata: {
      group: "builtin-trailing"
    },

    visitor: {
      FunctionExpression: {
        exit: function exit(node) {
          if (!node.id) return;
          node._ignoreUserWhitespace = true;

          return t.callExpression(t.functionExpression(null, [], t.blockStatement([t.toStatement(node), t.returnStatement(node.id)])), []);
        }
      }
    }
  });
};

module.exports = exports["default"];