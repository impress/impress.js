/**
 * Requires function names to match member and property names.
 *
 * It doesn't affect anonymous functions nor functions assigned to members or
 * properties named with a reserved word. Assigning to `module.exports` is also
 * ignored, unless `includeModuleExports: true` is configured.
 *
 * Types: `Boolean` or `Object`
 *
 * Values: `true` or Object with `includeModuleExports: true`
 *
 * #### Example
 *
 * ```js
 * "requireMatchingFunctionName": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var test = {};
 * test.foo = function foo() {};
 * ```
 *
 * ```js
 * var test = {};
 * test['foo'] = function foo() {};
 * ```
 *
 * ```js
 * var test = {foo: function foo() {}};
 * ```
 *
 * ```js
 * module.exports = function foo() {};
 * ```
 *
 * ```js
 * module['exports'] = function foo() {};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var test = {};
 * test.foo = function bar() {};
 * ```
 *
 * ```js
 * var test = {};
 * test['foo'] = function bar() {};
 * ```
 *
 * ```js
 * var test = {foo: function bar() {}};
 * ```
 *
 * ```js
 * var test = {module: {}};
 * test.module.exports = function foo() {};
 * ```
 *
 * #### Example
 *
 * ```js
 * "requireMatchingFunctionName": { "includeModuleExports": true }
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * module.exports = function foo() {};
 * ```
 *
 * ```js
 * module['exports'] = function foo() {};
 * ```
 */

var assert = require('assert');
var reservedWords = require('reserved-words');

module.exports = function() {};

module.exports.prototype = {
    configure: function(requireMatchingFunctionName) {
        if (typeof requireMatchingFunctionName === 'object') {
            assert(requireMatchingFunctionName.includeModuleExports === true,
                'requireMatchingFunctionName option requires includeModuleExports property to be true for object');
            this._includeModuleExports = requireMatchingFunctionName.includeModuleExports;
        } else {
            assert(
                requireMatchingFunctionName === true,
                'requireMatchingFunctionName option requires true value or should be removed'
            );
        }
    },

    getOptionName: function() {
        return 'requireMatchingFunctionName';
    },

    check: function(file, errors) {
        var _includeModuleExports = this._includeModuleExports;
        file.iterateNodesByType(['FunctionExpression'], function(node) {
            switch (node.parentNode.type) {
                // var foo = function bar() {}
                // object.foo = function bar() {}
                // object['foo'] = function bar() {}
                case 'AssignmentExpression':
                    if (_includeModuleExports || !_isModuleExports(node.parentNode.left)) {
                        checkForMember(node.parentNode, skip, errors);
                    }
                    break;

                // object = {foo: function bar() {}}
                case 'Property':
                    checkForProperty(node.parentNode, skip, errors);
                    break;
            }
        });

        function skip(key, value) {
            // We don't care about anonymous functions as
            // those should be enforced by separate rule
            if (!value.id) {
                return true;
            }

            // Relax a bit when reserved word is detected
            if (reservedWords.check(key, file.getDialect(), true)) {
                return true;
            }
        }
    }
};

function _isModuleExports(pattern) {
    if (pattern.type === 'MemberExpression') {
        // must be module.sth
        if (pattern.object.type === 'Identifier' &&
            pattern.object.name === 'module') {

            if (pattern.property.type === 'Identifier' &&
                pattern.property.name === 'exports') {
                // sth.exports
                return true;
            } else if (pattern.property.type === 'Literal' &&
                pattern.property.value === 'exports') {
                // sth["exports"]
                return true;
            }
        }
    }
    return false;
}

/**
 * Fetching name from a Pattern
 *
 * @param {Pattern} pattern - E.g. left side of AssignmentExpression
 * @returns {String|Boolean} - Resolved name or false (if there is an Expression)
 */
function _resolvePatternName(pattern) {
    switch (pattern.type) {
        case 'Identifier':
            // prop = ...;
            return pattern.name;
        case 'Literal':
            // obj['prop'] = ...;
            return pattern.value;
        case 'MemberExpression':
            // obj.prop = ...;
            return _resolvePatternName(pattern.property);
        default:
            // Something unhandy like obj['x' + 2] = ...;
            return false;
    }
}

function checkForMember(assignment, skip, errors) {
    var _name = _resolvePatternName(assignment.left);
    if (_name === false || skip(_name, assignment.right)) {
        return;
    }

    if (_name !== assignment.right.id.name) {
        errors.add(
            'Function name does not match member name',
            assignment.loc.start
        );
    }
}

function checkForProperty(property, skip, errors) {
    var _name = _resolvePatternName(property.key);
    if (_name === false || skip(_name, property.value)) {
        return;
    }

    if (_name !== property.value.id.name) {
        errors.add(
            'Function name does not match property name',
            property.loc.start
        );
    }
}
