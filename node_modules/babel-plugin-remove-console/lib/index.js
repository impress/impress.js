"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("remove-console", {
    metadata: {
      group: "builtin-pre"
    },

    visitor: {
      CallExpression: function CallExpression() {
        if (this.get("callee").matchesPattern("console", true)) {
          this.dangerouslyRemove();
        }
      }
    }
  });
};

module.exports = exports["default"];