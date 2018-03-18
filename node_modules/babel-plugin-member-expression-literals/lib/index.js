"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("member-expression-literals", {
    metadata: {
      group: "builtin-trailing"
    },

    visitor: {
      MemberExpression: {
        exit: function exit(node) {
          var prop = node.property;
          if (node.computed && t.isLiteral(prop) && t.isValidIdentifier(prop.value)) {
            // foo["bar"] => foo.bar
            node.property = t.identifier(prop.value);
            node.computed = false;
          }
        }
      }
    }
  });
};

module.exports = exports["default"];