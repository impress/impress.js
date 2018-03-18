module.exports = validateCheckParamNames;
module.exports.scopes = ['function'];
module.exports.options = {
    checkParamNames: {allowedValues: [true]}
};

/**
 * Validator for check-param-names
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function validateCheckParamNames(node, err) {
    if (!node.jsdoc || !node.jsdoc.valid) {
        return;
    }

    // outOfOrder
    var paramsByName = {};
    node.params.forEach(function(param) {
        paramsByName[param.name] = param;
    });
    var paramTagsByName = {};
    node.jsdoc.iterateByType(['param', 'arg', 'argument'], function(tag) {
        if (tag.name && tag.name.value) {
            paramTagsByName[tag.name.value] = tag;
        }
    });
    var outOfOrder = {};
    var skipped = 0;
    var lastRootParamTag;

    node.jsdoc.iterateByType(['param', 'arg', 'argument'],
        /**
         * Tag checker
         *
         * @param {DocType} tag
         * @param {number} i index
         */
        function(tag, i) {
            // There is no parameter name in destructuring assignments.
            if (node.params[i - skipped] && node.params[i - skipped].name === undefined) {
                // So if there is no tag name or the tag name does not contain '.', there is nothing to check.
                if (!tag.name || tag.name.value.indexOf('.') === -1) {
                    lastRootParamTag = tag;
                    return;
                }
            }

            // Сhecking validity
            if (!tag.name) {
                return err('Missing param name', tag.loc);
            }

            var dotPosition = tag.name.value.indexOf('.');
            if (dotPosition !== -1) {
                var dottedRootParam = tag.name.value.substr(0, dotPosition);
                if (dotPosition === 0 || !(dottedRootParam = tag.name.value.substr(0, dotPosition))) {
                    err('Invalid param name', tag.name.loc);
                } else if (!lastRootParamTag) {
                    err('Inconsistent param found', tag.name.loc);
                } else if (lastRootParamTag.name.value !== dottedRootParam) {
                    err('Expected `' + lastRootParamTag.name.value + '` but got `' + dottedRootParam + '`',
                        tag.name.loc);
                }
                skipped++;
                return;
            }

            lastRootParamTag = tag;

            var param = node.params[i - skipped];
            if (!param) {
                // skip if no param
                return;
            }

            // checking name
            var msg;
            if (tag.name.value !== param.name && !outOfOrder[tag.name.value]) {
                if (paramsByName[tag.name.value] && paramTagsByName[param.name]) {
                    outOfOrder[tag.name.value] = outOfOrder[param.name] = true;
                    msg = 'Parameters ' + tag.name.value + ' and ' + param.name + ' are out of order';
                } else if (paramsByName[tag.name.value]) {
                    outOfOrder[tag.name.value] = true;
                    msg = 'Parameter ' + tag.name.value + ' is out of order';
                } else {
                    msg = 'Expected ' + param.name + ' but got ' + tag.name.value;
                }

                return err(msg, tag.name.loc);
            }
        });
}
