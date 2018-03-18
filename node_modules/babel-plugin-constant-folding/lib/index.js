"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var Plugin = _ref.Plugin;
  var t = _ref.types;

  return new Plugin("constant-folding", {
    metadata: {
      group: "builtin-prepass",
      experimental: true
    },

    visitor: {
      AssignmentExpression: function AssignmentExpression() {
        var left = this.get("left");
        if (!left.isIdentifier()) return;

        var binding = this.scope.getBinding(left.node.name);
        if (!binding || binding.hasDeoptValue) return;

        var evaluated = this.get("right").evaluate();
        if (evaluated.confident) {
          binding.setValue(evaluated.value);
        } else {
          binding.deoptValue();
        }
      },

      IfStatement: function IfStatement() {
        var evaluated = this.get("test").evaluate();
        if (!evaluated.confident) {
          // todo: deopt binding values for constant violations inside
          return this.skip();
        }

        if (evaluated.value) {
          this.skipKey("alternate");
        } else {
          this.skipKey("consequent");
        }
      },

      Scopable: {
        enter: function enter() {
          var funcScope = this.scope.getFunctionParent();

          for (var name in this.scope.bindings) {
            var binding = this.scope.bindings[name];
            var deopt = false;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = binding.constantViolations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var path = _step.value;

                var funcViolationScope = path.scope.getFunctionParent();
                if (funcViolationScope !== funcScope) {
                  deopt = true;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                  _iterator["return"]();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            if (deopt) binding.deoptValue();
          }
        },

        exit: function exit() {
          for (var name in this.scope.bindings) {
            var binding = this.scope.bindings[name];
            binding.clearValue();
          }
        }
      },

      Expression: {
        exit: function exit() {
          var res = this.evaluate();
          if (res.confident) return t.valueToNode(res.value);
        }
      }
    }
  });
};

module.exports = exports["default"];