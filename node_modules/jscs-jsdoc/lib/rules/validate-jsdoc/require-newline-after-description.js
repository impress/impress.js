module.exports = requireNewlineAfterDescription;
module.exports.scopes = ['function'];
module.exports.options = {
    requireNewlineAfterDescription: {allowedValues: [true]}
};

var RE_NEWLINE_AT_THE_END = /\n$/;
var RE_NEWLINES = /\n/g;

/**
 * Requires newline after description in jsdoc comment
 *
 * @param {(FunctionDeclaration|FunctionExpression)} node
 * @param {Function} err
 */
function requireNewlineAfterDescription(node, err) {
    var doc = node.jsdoc;
    if (!doc || !doc.tags.length || !doc.description || !doc.description.length) {
        return;
    }

    if (!RE_NEWLINE_AT_THE_END.test(doc.description)) {
        var loc = node.jsdoc.loc.start;
        var lines = doc.description.split(RE_NEWLINES);
        err('Newline required after description', {
            line: loc.line + lines.length,
            column: loc.column + 3 + lines[lines.length - 1].length
        });
    }
}
