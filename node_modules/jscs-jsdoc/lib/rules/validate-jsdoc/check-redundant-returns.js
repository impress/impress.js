module.exports = checkReturnTypes;
module.exports.tags = ['return', 'returns'];
module.exports.scopes = ['function'];
module.exports.options = {
    checkRedundantReturns: {allowedValues: [true]}
};

/**
 * Checking returns types
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {DocTag} tag
 * @param {Function} err
 */
function checkReturnTypes(node, tag, err) {
    // checking consistency
    if (!tag.type) {
        return;
    }

    // skip abstract methods
    if (node.jsdoc.abstract) {
        return;
    }

    // checking redundant: invalid or not return statements in code
    var redundant = !Boolean(this._getReturnStatementsForNode(node).length);

    if (redundant) {
        err('Redundant return statement', tag.loc);
    }
}
