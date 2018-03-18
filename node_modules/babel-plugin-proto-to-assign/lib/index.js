"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _lodashArrayPull = require("lodash/array/pull");

var _lodashArrayPull2 = _interopRequireDefault(_lodashArrayPull);

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  function isProtoKey(node) {
    return t.isLiteral(t.toComputedKey(node, node.key), { value: "__proto__" });
  }

  function isProtoAssignmentExpression(node) {
    var left = node.left;
    return t.isMemberExpression(left) && t.isLiteral(t.toComputedKey(left, left.property), { value: "__proto__" });
  }

  function buildDefaultsCallExpression(expr, ref, file) {
    return t.expressionStatement(t.callExpression(file.addHelper("defaults"), [ref, expr.right]));
  }

  return new Plugin("proto-to-assign", {
    metadata: {
      secondPass: true
    },

    visitor: {
      AssignmentExpression: function AssignmentExpression(node, parent, scope, file) {
        if (!isProtoAssignmentExpression(node)) return;

        var nodes = [];
        var left = node.left.object;
        var temp = scope.maybeGenerateMemoised(left);

        if (temp) nodes.push(t.expressionStatement(t.assignmentExpression("=", temp, left)));
        nodes.push(buildDefaultsCallExpression(node, temp || left, file));
        if (temp) nodes.push(temp);

        return nodes;
      },

      ExpressionStatement: function ExpressionStatement(node, parent, scope, file) {
        var expr = node.expression;
        if (!t.isAssignmentExpression(expr, { operator: "=" })) return;

        if (isProtoAssignmentExpression(expr)) {
          return buildDefaultsCallExpression(expr, expr.left.object, file);
        }
      },

      ObjectExpression: function ObjectExpression(node, parent, scope, file) {
        var proto;

        for (var i = 0; i < node.properties.length; i++) {
          var prop = node.properties[i];

          if (isProtoKey(prop)) {
            proto = prop.value;
            (0, _lodashArrayPull2["default"])(node.properties, prop);
          }
        }

        if (proto) {
          var args = [t.objectExpression([]), proto];
          if (node.properties.length) args.push(node);
          return t.callExpression(file.addHelper("extends"), args);
        }
      }
    }
  });
};

module.exports = exports["default"];