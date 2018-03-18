var assert = require('assert');
var esprimaHelpers = require('../../esprima-helpers');

module.exports = enforceExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    enforceExistence: true
};

/**
 * @param {Object} options
 */
enforceExistence.configure = function(options) {

    // set default policy
    var policy = this._enforceExistencePolicy = {
        all: true,
        anonymous: false,
        arrow: true,
        exports: true,
        expressions: true,
        'paramless-procedures': true,
    };

    // check options are valid
    var o = options.enforceExistence;
    assert(
        o === true || o === false || typeof o === 'string' || (typeof o === 'object' && Array.isArray(o.allExcept)),
        'jsDoc.enforceExistence rule was not configured properly'
    );

    var optionsToPolicyMap = Object.keys(policy);
    /**
     * @param {string} option
     */
    function updatePolicyRules(option) {
        if (o.allExcept.indexOf(option) > -1) {
            policy[option] = !policy[option];
        }
    }

    // parse options for policies
    if (o === false) {
        policy.all = false;
    } else if (typeof o === 'string' && o === 'exceptExports') { // backward compatible string option
        policy.exports = false;
    } else if (typeof o === 'object' && Array.isArray(o.allExcept)) {
        optionsToPolicyMap.forEach(updatePolicyRules);
    }

};

/**
 * Validator for jsdoc data existence
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function enforceExistence(node, err) {
    var policy = this._enforceExistencePolicy;

    // enforce 'break-out' policies
    var parentNode = node.parentNode || {};

    if (policy.all === false) {
        // don't check anything
        return;
    }

    if (policy.anonymous === false && node.type !== 'ArrowFunctionExpression' ||
        policy.arrow === false && node.type === 'ArrowFunctionExpression') {
        if (!node.id && ['AssignmentExpression', 'VariableDeclarator', 'Property',
            'ExportDefaultDeclaration'].indexOf(parentNode.type) === -1) {
            // don't check anonymous functions
            return;
        }
    }
    if (policy.exports === false) {
        if (parentNode.type === 'ExportDefaultDeclaration' || parentNode.type === 'ExportNamedDeclaration') {
            // don't check es6 export
            return;
        } else if (parentNode.type === 'AssignmentExpression') {
            var left = parentNode.left;
            if ((left.object && left.object.name) === 'module' &&
                (left.property && left.property.name) === 'exports') {
                // don't check commonjs exports format
                return;
            }
        }
    }
    if (policy.expressions === false) {
        if (['AssignmentExpression', 'VariableDeclarator', 'Property'].indexOf(parentNode.type) > -1) {
            // don't check expression functions
            return;
        }
    }
    if (policy['paramless-procedures'] === false) {
        var hasReturnsWhichRequireJsdoc = false;
        this._iterate(function(n) {
            if (hasReturnsWhichRequireJsdoc) {
                return;
            }
            var isReturnWithValue = n && n.type === 'ReturnStatement' && n.argument;
            var isInCurrentScope = node === esprimaHelpers.closestScopeNode(n);
            hasReturnsWhichRequireJsdoc = isReturnWithValue && isInCurrentScope;
        }, node);
        if (!node.params.length && !hasReturnsWhichRequireJsdoc) {
            // don't check functions without params
            return;
        }
    }

    // now clear to check for documentation
    if (node.jsdoc) {
        if (!node.jsdoc.valid) {
            err('Invalid jsdoc-block definition', node.jsdoc.loc.start);
        }
        return;
    }

    // report absence
    err('Expect valid jsdoc-block definition', node.loc.start);

}
