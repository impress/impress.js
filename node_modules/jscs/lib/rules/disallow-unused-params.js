/**
 * Disallows unused params in function expression and function declaration.
 *
 * Types: `Boolean`
 *
 * Values: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowUnusedParams": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * function x(test) {
 *     return test;
 * }
 *
 * var x = function(test) {
 *     return test;
 * }
 * ```
 *
 * ##### Invalid
 *
 * ```js
  * function x(test) {
 * }
 *
 * var x = function(test) {
 * }
 * ```
 */

var assert = require('assert');

function getUsedParams(scope) {
    var vars;
    var res = [];

    if (scope.type === 'function-expression-name') {
        scope = scope.childScopes[0];
    }

    var length = scope.block.params.length;

    for (var i = 0; i <= length; i++) {
        vars = scope.variables[i];

        if (vars.name === 'arguments') {
            continue;
        }

        res.push({
            param: vars,
            used: !!vars.references.length
        });
    }

    var used = false;
    res.reverse().forEach(function(param) {
        if (used) {
            param.used = true;

            return;
        }

        if (param.used) {
            used = true;
        }
    });

    return res.reverse();
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true,
            this.getOptionName() + ' option requires a true value or should be removed'
        );
    },

    getOptionName: function() {
        return 'disallowUnusedParams';
    },

    check: function(file, errors) {
        file.iterateNodesByType(['FunctionDeclaration', 'FunctionExpression'], function(node) {
            var scope = file.getScope().acquire(node);
            var params = node.params;

            getUsedParams(scope).forEach(function(value, index) {
                if (value.used) {
                    return;
                }

                var param = params[index];

                errors.cast({
                    message: 'Param `' + value.param.name + '` is not used',
                    line: param.loc.start.line,
                    column: param.loc.start.column,
                    additional: {
                        node: param,
                        token: file.getFirstNodeToken(param)
                    }
                });
            });
        });
    },

    _fix: function(file, error) {
        var node = error.additional.node;
        var parent = node.parentNode;

        var index = parent.params.indexOf(node);
        var length = parent.params.length;

        var token = error.additional.token;

        var next;

        if (parent.params[index + 1]) {
            next = file.findNextToken(token, 'Identifier');
        }

        // For "b"

        // function test(b) {}
        if (length === 1) {
            file.removeToken(token);

            return;
        }

        // function test(a, b) {}
        if (length > 1 && index + 1 === length) {
            file.removeEntity(parent.params, node);
            var comma = file.findPrevToken(token, 'Punctuator', ',');
            file.setWhitespaceBefore(comma, '');
            file.removeToken(comma);
            file.setWhitespaceBefore(token, '');
            file.removeToken(token);

            return;
        }

        // function test(b, c) {}
        if (length > 1) {
            file.removeEntity(parent.params, node);
            file.removeToken(file.findNextToken(token, 'Punctuator', ','));
            file.setWhitespaceBefore(next, '');
            file.removeToken(token);

            return;
        }
    }
};
