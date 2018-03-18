var esprima = require("esprima").parse;
var traverse = require("ast-traverse");
var ast = esprima("f(!x, y)");

var val;
try {
    traverse(ast, {pre: function(node) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            val = node.argument;
            throw 0;
        }
    }});
} catch(e) {
    if (val === undefined) {
        throw e; // re-throw if it wasn't our exception
    }
}

console.dir(val); // { type: 'Identifier', name: 'x' }
