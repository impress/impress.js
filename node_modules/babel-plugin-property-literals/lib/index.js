"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("property-literals", {
    metadata: {
      group: "builtin-trailing"
    },

    visitor: {
      Property: {
        exit: function exit(node) {
          var key = node.key;
          if (t.isLiteral(key) && t.isValidIdentifier(key.value)) {
            // "foo": "bar" -> foo: "bar"
            node.key = t.identifier(key.value);
            node.computed = false;
          }
        }
      }
    }
  });
};

module.exports = exports["default"];