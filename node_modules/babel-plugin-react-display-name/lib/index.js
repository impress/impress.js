"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  function addDisplayName(id, call) {
    var props = call.arguments[0].properties;
    var safe = true;

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      var key = t.toComputedKey(prop);
      if (t.isLiteral(key, { value: "displayName" })) {
        safe = false;
        break;
      }
    }

    if (safe) {
      props.unshift(t.property("init", t.identifier("displayName"), t.literal(id)));
    }
  }

  var isCreateClassCallExpression = t.buildMatchMemberExpression("React.createClass");

  function isCreateClass(node) {
    if (!node || !t.isCallExpression(node)) return false;

    // not React.createClass call member object
    if (!isCreateClassCallExpression(node.callee)) return false;

    // no call arguments
    var args = node.arguments;
    if (args.length !== 1) return false;

    // first node arg is not an object
    var first = args[0];
    if (!t.isObjectExpression(first)) return false;

    return true;
  }

  return new Plugin("react-display-name", {
    metadata: {
      group: "builtin-pre"
    },

    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(node, parent, scope, file) {
        if (isCreateClass(node.declaration)) {
          addDisplayName(file.opts.basename, node.declaration);
        }
      },

      "AssignmentExpression|Property|VariableDeclarator": function AssignmentExpressionPropertyVariableDeclarator(node) {
        var left, right;

        if (t.isAssignmentExpression(node)) {
          left = node.left;
          right = node.right;
        } else if (t.isProperty(node)) {
          left = node.key;
          right = node.value;
        } else if (t.isVariableDeclarator(node)) {
          left = node.id;
          right = node.init;
        }

        if (t.isMemberExpression(left)) {
          left = left.property;
        }

        if (t.isIdentifier(left) && isCreateClass(right)) {
          addDisplayName(left.name, right);
        }
      }
    }
  });
};

module.exports = exports["default"];