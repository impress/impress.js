var jsdoc = require('../../jsdoc');

module.exports = validateTypesInTags;
module.exports.scopes = ['file'];
module.exports.options = {
    checkTypes: {allowedValues: [true, 'strictNativeCase', 'capitalizedNativeCase']}
};

var allowedTags = {
    // common
    typedef: true,
    type: true,
    param: true,
    'return': true,
    returns: true,
    'enum': true,

    // jsdoc
    'var': true,
    prop: true,
    property: true,
    arg: true,
    argument: true,

    // jsduck
    cfg: true,

    // closure
    lends: true,
    extends: true,
    implements: true,
    define: true
};

var strictNatives = {
    // lowercased
    boolean: 'boolean',
    number: 'number',
    string: 'string',
    // titlecased
    array: 'Array',
    object: 'Object',
    regexp: 'RegExp',
    date: 'Date',
    'function': 'Function'
};

/**
 * Validator for types in tags
 *
 * @param {JSCS.JSFile} file
 * @param {JSCS.Errors} errors
 */
function validateTypesInTags(file, errors) {
    var strictNativeCase = this._options.checkTypes === 'strictNativeCase';
    var capitalizedNativeCase = this._options.checkTypes === 'capitalizedNativeCase';

    var comments = file.getComments();
    comments.forEach(function(commentNode) {
        if (commentNode.type !== 'Block' || commentNode.value[0] !== '*') {
            return;
        }

        // trying to create DocComment object
        var node = jsdoc.createDocCommentByCommentNode(commentNode);
        if (!node.valid) {
            return;
        }

        node.iterateByType(Object.keys(allowedTags),
            /**
             * @param {DocType} tag
             */
            function(tag) {

                if (!tag.type) {
                    // skip untyped params
                    return;
                }
                if (!tag.type.valid) {
                    // throw an error if not valid
                    errors.add('Expects valid type instead of ' + tag.type.value, tag.type.loc);
                }
                if (strictNativeCase || capitalizedNativeCase) {
                    tag.type.iterate(function(node) {
                        // it shouldn't be!
                        if (!node.typeName) {
                            // skip untyped unknown things
                            return;
                        }

                        // is native?
                        var type = node.typeName;
                        var lowerType = type.toLowerCase();
                        if (!strictNatives.hasOwnProperty(lowerType)) {
                            return;
                        }

                        var normType = strictNatives[lowerType];
                        if (strictNativeCase && type !== normType ||
                            capitalizedNativeCase && type !== (normType[0].toUpperCase() + normType.substr(1))) {
                            errors.add('Invalid case of type `' + type + '`', tag.type.loc);
                        }
                    });
                }
            });
    });
}
