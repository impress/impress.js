"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("remove-debugger", {
    metadata: {
      group: "builtin-pre"
    },

    visitor: {
      DebuggerStatement: function DebuggerStatement() {
        this.dangerouslyRemove();
      }
    }
  });
};

module.exports = exports["default"];