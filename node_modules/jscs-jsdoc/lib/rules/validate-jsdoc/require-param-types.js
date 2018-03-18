module.exports = validateParamTag;
module.exports.tags = ['param', 'arg', 'argument'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireParamTypes: {allowedValues: [true]}
};

/**
 * Validator for @param
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateParamTag(node, tag, err) {
    // checking existance
    if (tag.type) {
        return;
    }
    return err('Missing param type', (tag.name ? tag.name.loc : null) || tag.loc);
}
