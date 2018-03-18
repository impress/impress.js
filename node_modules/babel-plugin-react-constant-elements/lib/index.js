"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;

  var immutabilityVisitor = {
    enter: function enter(node, parent, scope, state) {
      var _this = this;

      var stop = function stop() {
        state.isImmutable = false;
        _this.stop();
      };

      if (this.isJSXClosingElement()) {
        this.skip();
        return;
      }

      if (this.isJSXIdentifier({ name: "ref" }) && this.parentPath.isJSXAttribute({ name: node })) {
        return stop();
      }

      if (this.isJSXIdentifier() || this.isIdentifier() || this.isJSXMemberExpression()) {
        return;
      }

      if (!this.isImmutable()) stop();
    }
  };

  return new Plugin("react-constant-elements", {
    metadata: {
      group: "builtin-basic"
    },

    visitor: {
      JSXElement: function JSXElement(node) {
        if (node._hoisted) return;

        var state = { isImmutable: true };
        this.traverse(immutabilityVisitor, state);

        if (state.isImmutable) {
          this.hoist();
        } else {
          node._hoisted = true;
        }
      }
    }
  });
};

module.exports = exports["default"];