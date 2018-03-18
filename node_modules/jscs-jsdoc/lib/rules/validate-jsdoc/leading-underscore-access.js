module.exports = validateLeadingUnderscoresAccess;
module.exports.scopes = ['function'];

module.exports.options = {
    leadingUnderscoreAccess: {
        allowedValues: [true, 'private', 'protected']
    }
};

var nativeUnderscoredProperties = [
    // standard
    '__proto__',
    // underscore
    '_',
    // node.js
    '__filename',
    '__dirname',
    'super_', // util.inherits
    // moz
    '__count__',
    '__parent__',
    '__defineGetter__',
    '__defineSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    '__noSuchMethod__',
    // dfilatov/inherit
    '__constructor',
    '__self',
    '__base',
    '__parent',
];

/**
 * Validator for jsdoc data existance
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateLeadingUnderscoresAccess(node, err) {
    var option = this._options.leadingUnderscoreAccess;
    if (!node.jsdoc || !node.jsdoc.valid) {
        return;
    }

    // fetch name from variable, property or function
    var name;
    var nameLocation;
    switch (node.parentNode.type) {
    case 'VariableDeclarator':
        name = node.parentNode.id.name;
        nameLocation = node.parentNode.id.loc;
        break;
    case 'Property':
        name = node.parentNode.key.name;
        nameLocation = node.parentNode.key.loc;
        break;
    default: // try to use func name itself (if not anonymous)
        name = (node.id || {}).name;
        nameLocation = (node.id || {}).loc;
        break;
    }

    if (nativeUnderscoredProperties.indexOf(name) !== -1) {
        return;
    }

    // skip anonymous and names without underscores at begin
    if (!name || name[0] !== '_') {
        return;
    }

    var access;
    var accessTag;
    var override = false;
    node.jsdoc.iterate(function(tag) {
        if (!access && ['private', 'protected', 'public', 'access'].indexOf(tag.id) !== -1) {
            access = (tag.id === 'access' ? tag.name.value : tag.id);
            accessTag = tag;
        } else if (tag.id === 'override') {
            override = true;
        }
    });

    if (!access || !accessTag) {
        if (!override) {
            err('Missing access tag for ' + (name || 'anonymous function'), (nameLocation || node.loc).start);
        }
    } else if ([true, access].indexOf(option) === -1) {
        err('Method access doesn\'t match', accessTag.loc);
    }
}
