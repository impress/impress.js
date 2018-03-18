module.exports = requireHyphenBeforeDescription;
module.exports.tags = ['param', 'arg', 'argument'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireHyphenBeforeDescription: {allowedValues: [true]}
};

/**
 * Checking returns types
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function requireHyphenBeforeDescription(node, tag, err) {
    if (!tag.description) {
        return;
    }

    // skip reporting if there is new line in description
    // todo: check this with newline of name and description when it'll be possible
    if (tag.value.indexOf('\n') !== -1 && tag.description.indexOf('\n') === -1) {
        return;
    }

    if (tag.description.substring(0, 2) !== '- ') {
        err('Missing hyphen before description', tag.loc);
    }
}
