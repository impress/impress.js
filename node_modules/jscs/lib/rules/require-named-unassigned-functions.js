/**
 * Require unassigned functions to be named inline
 *
 * Types: `Boolean` or `Object`
 *
 * Values:
 *  - `true`
 *  - `Object`:
 *     - `allExcept`: array of quoted identifiers
 *
 * #### Example
 *
 * ```js
 * "requireNamedUnassignedFunctions": { "allExcept": ["describe", "it"] }
 * ```
 *
 * ##### Valid
 *
 * ```js
 * [].forEach(function x() {});
 * var y = function() {};
 * function z() {}
 * it(function () {});
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * [].forEach(function () {});
 * before(function () {});
 * ```
 */

var assert = require('assert');
var pathval = require('pathval');

function getNodeName(node) {
    if (node.type === 'Identifier') {
        return node.name;
    } else {
        return node.value;
    }
}

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        assert(
            options === true ||
            typeof options === 'object',
            this.getOptionName() + ' option requires true value ' +
            'or an object with String[] `allExcept` property'
        );

        // verify first item in `allExcept` property in object (if it's an object)
        assert(
            typeof options !== 'object' ||
            Array.isArray(options.allExcept) &&
            typeof options.allExcept[0] === 'string',
            'Property `allExcept` in ' + this.getOptionName() + ' should be an array of strings'
        );

        if (options.allExcept) {
            this._allExceptItems = options.allExcept.map(function(item) {
                var parts = pathval.parse(item).map(function extractPart(part) {
                    return part.i !== undefined ? part.i : part.p;
                });
                return JSON.stringify(parts);
            });
        }
    },

    getOptionName: function() {
        return 'requireNamedUnassignedFunctions';
    },

    check: function(file, errors) {
        var _this = this;
        file.iterateNodesByType('FunctionExpression', function(node) {
            var parentNode = node.parentNode;
            // If the function has been named via left hand assignment, skip it
            //   e.g. `var hello = function() {`, `foo.bar = function() {`
            if (parentNode.type.match(/VariableDeclarator|Property|AssignmentExpression/)) {
                return;
            }

            // If the function has been named, skip it
            //   e.g. `[].forEach(function hello() {`
            if (node.id !== null) {
                return;
            }

            // If we have exceptions and the function is being invoked, detect whether we excepted it
            if (_this._allExceptItems && parentNode.type === 'CallExpression') {
                // Determine the path that resolves to our call expression
                // We must cover both direct calls (e.g. `it(function() {`) and
                //   member expressions (e.g. `foo.bar(function() {`)
                var memberNode = parentNode.callee;
                var canBeRepresented = true;
                var fullpathParts = [];
                while (memberNode) {
                    if (memberNode.type.match(/Identifier|Literal/)) {
                        fullpathParts.unshift(getNodeName(memberNode));
                    } else if (memberNode.type === 'MemberExpression') {
                        fullpathParts.unshift(getNodeName(memberNode.property));
                    } else {
                        canBeRepresented = false;
                        break;
                    }
                    memberNode = memberNode.object;
                }

                // If the path is not-dynamic (i.e. can be represented by static parts),
                //   then check it against our exceptions
                if (canBeRepresented) {
                    var fullpath = JSON.stringify(fullpathParts);
                    for (var i = 0, l = _this._allExceptItems.length; i < l; i++) {
                        if (fullpath === _this._allExceptItems[i]) {
                            return;
                        }
                    }
                }
            }

            // Complain that this function must be named
            errors.add('Inline functions need to be named', node.loc.start);
        });
    }
};
