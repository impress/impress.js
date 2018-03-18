"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("inline-environment-variables", {
    metadata: {
      group: "builtin-pre"
    },

    visitor: {
      MemberExpression: function MemberExpression(node) {
        if (this.get("object").matchesPattern("process.env")) {
          var key = this.toComputedKey();
          if (t.isLiteral(key)) {
            return t.valueToNode(process.env[key.value]);
          }
        }
      }
    }
  });
};

module.exports = exports["default"];