module.exports = validateReturnTagDescription;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    requireReturnDescription: {allowedValues: [true]}
};

/**
 * Validator for @return description.
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function validateReturnTagDescription(node, tag, err) {
    // Check tag existence. Note: for @returns tag, description is parsed as a name.
    if (tag.name) {
        return;
    }

    return err('Missing return description', tag.loc);
}
