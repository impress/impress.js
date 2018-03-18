module.exports = checkRedundantAccess;
module.exports.scopes = ['function'];

module.exports.options = {
    checkRedundantAccess: {allowedValues: [true, 'enforceLeadingUnderscore', 'enforceTrailingUnderscore']}
};

/**
 * Validator for @access
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function checkRedundantAccess(node, err) {
    var enforceLeadingUnderscore = this._options.checkRedundantAccess === 'enforceLeadingUnderscore';
    var enforceTrailingUnderscore = this._options.checkRedundantAccess === 'enforceTrailingUnderscore';
    if (!node.jsdoc || !node.jsdoc.valid) {
        return;
    }

    var access;
    node.jsdoc.iterateByType(['private', 'protected', 'public', 'access'], function(tag) {
        if (access) {
            err('Multiple access definition', tag.loc);
            return;
        }

        if (tag.id === 'access' && !tag.name) {
            err('Invalid access definition', tag.loc);
        }

        access = tag.id === 'access' ? tag.name.value : tag.id;
    });

    // skip unknown and don't check if no forcing
    if (typeof access === 'undefined' || access === 'public' ||
        !(enforceLeadingUnderscore || enforceTrailingUnderscore)) {
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

    // skip anonymous and names without underscores at begin
    if (name && name[enforceLeadingUnderscore ? 0 : (name.length - 1)] !== '_') {
        err('Missing ' + (enforceLeadingUnderscore ? 'leading' : 'trailing') +
            ' underscore for ' + name, (nameLocation || node.loc).start);
    }
}
