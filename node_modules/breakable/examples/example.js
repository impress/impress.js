var breakable = require("./breakable");
var esprima = require("esprima").parse;
var traverse = require("ast-traverse");
var ast = esprima("f(!x, y)");

var val = breakable(function(brk) {
    traverse(ast, {pre: function(node) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            brk(node.argument);
        }
    }});
});

console.dir(val); // { type: 'Identifier', name: 'x' }
