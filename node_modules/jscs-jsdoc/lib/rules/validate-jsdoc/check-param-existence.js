module.exports = checkParamExistence;
module.exports.scopes = ['function'];
module.exports.options = {
    checkParamExistence: {allowedValues: [true]}
};

/**
 * validator for check-param-existence
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function checkParamExistence(node, err) {
    if (!node.jsdoc) {
        return;
    }

    var totalParams = 0;
    var excludable;
    var documentedParams = {};
    node.jsdoc.iterateByType(['param', 'arg', 'argument', 'inheritdoc', 'class', 'extends'],
        function(tag) {
            totalParams += 1;
            if (['inheritdoc', 'class', 'extends'].indexOf(tag.id) > -1) {
                excludable = true;
            }
            // set first instance at place where documentation is missing.
            if (['arg', 'argument', 'param'].indexOf(tag.id) > -1 && tag.name) {
                documentedParams[tag.name.value] = true;
            }
        });
    if (totalParams !== node.params.length && !excludable) {
        node.params.forEach(function(param) {
            if (!documentedParams[param.name]) {
                err('Function is missing documentation for parameter `' + param.name + '`.',
                    node.loc.start);
            }
        });
    }
}
