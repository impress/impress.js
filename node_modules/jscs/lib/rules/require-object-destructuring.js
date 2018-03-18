/**
 * Requires variable declarations from objects via destructuring
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * Version: `ES6`
 *
 * #### Example
 *
 * ```js
 * "requireObjectDestructuring": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var { foo } = SomeThing;
 * var { bar } = SomeThing.foo;
 * var { val } = SomeThing['some.key'];
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var foo = SomeThing.foo;
 * var bar = SomeThing.foo.bar;
 * var val = SomeThing['some.key'].val;
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(option) {
        var isTrue = option === true;

        assert(
            isTrue || (typeof option === 'object' && Array.isArray(option.allExcept)),
            this.getOptionName() + ' requires the value `true` ' +
              'or an object with an `allExcept` array property'
        );

        this._propertyExceptions = !isTrue && option.allExcept || [];
    },

    getOptionName: function() {
        return 'requireObjectDestructuring';
    },

    check: function(file, errors) {
        var propertyExceptions = this._propertyExceptions;

        file.iterateNodesByType('VariableDeclaration', function(node) {

            node.declarations.forEach(function(declaration) {
                var declarationId = declaration.id || {};
                var declarationInit = declaration.init || {};

                if (declarationId.type !== 'Identifier' || declarationInit.type !== 'MemberExpression') {
                    return;
                }

                var propertyName = declarationInit.property && declarationInit.property.name;

                if (declarationId.name === propertyName &&
                    propertyExceptions.indexOf(propertyName) < 0) {

                    errors.add('Property assignments should use destructuring', node.loc.start);
                }
            });
        });
    }
};
