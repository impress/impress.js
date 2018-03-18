module.exports = checkReturnTypes;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkReturnTypes: {allowedValues: [true]}
};

/**
 * Checking returns types
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function checkReturnTypes(node, tag, err) {
    // try to check returns types
    if (!tag.type || !tag.type.valid) {
        return;
    }

    var returnsArgumentStatements = this._getReturnStatementsForNode(node);
    returnsArgumentStatements.forEach(function(argument) {
        if (!tag.type.match(argument)) {
            err('Wrong returns value', argument.loc.start);
        }
    });
}
