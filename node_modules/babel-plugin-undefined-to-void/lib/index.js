"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("undefined-to-void", {
    metadata: {
      group: "builtin-basic"
    },

    visitor: {
      ReferencedIdentifier: function ReferencedIdentifier(node, parent) {
        if (node.name === "undefined") {
          return t.unaryExpression("void", t.literal(0), true);
        }
      }
    }
  });
};

module.exports = exports["default"];