module.exports = disallowNewlineAfterDescription;
module.exports.scopes = ['function'];
module.exports.options = {
    disallowNewlineAfterDescription: {allowedValues: [true]}
};

var RE_NEWLINE_AT_THE_END = /\n$/;
var RE_NEWLINES = /\n/g;

/**
 * Disallows newline after description in jsdoc comment
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function disallowNewlineAfterDescription(node, err) {
    var doc = node.jsdoc;
    if (!doc || !doc.tags.length || !doc.description || !doc.description.length) {
        return;
    }

    if (!RE_NEWLINE_AT_THE_END.test(doc.description)) {
        return;
    }

    var loc = node.jsdoc.loc.start;
    var lines = doc.description.split(RE_NEWLINES);
    err('Newline required after description', {
        line: loc.line + lines.length,
        column: loc.column + 3 + lines[lines.length - 1].length
    });
}
