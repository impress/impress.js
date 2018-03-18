module.exports = validateParamTagDescription;
module.exports.tags = ['param', 'arg', 'argument'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireParamDescription: {allowedValues: [true]}
};

/**
 * Validator for @param
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateParamTagDescription(node, tag, err) {
    // checking existance
    if (tag.description) {
        return;
    }

    var offset = (tag.name && tag.name.value && tag.name.value.length) || 0;
    var loc = (tag.name ? tag.name.loc : null) || tag.loc;

    return err('Missing param description', {
        line: loc.line,
        column: loc.column + offset
    });
}
