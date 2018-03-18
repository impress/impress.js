module.exports = {
    closestScopeNode: closestScopeNode
};

var scopeNodeTypes = [
    'Program',
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunctionExpression'
];

/**
 * Search for the closest scope node tree for Node
 *
 * @param {{type: string}} n
 * @returns {EsprimaNode}
 */
function closestScopeNode(n) {
    while (n && scopeNodeTypes.indexOf(n.type) === -1) {
        n = n.parentNode;
    }
    return n;
}
