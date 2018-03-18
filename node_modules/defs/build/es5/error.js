"use strict";

var fmt = require("simple-fmt");
var assert = require("assert");

function error(line, var_args) {
    assert(arguments.length >= 2);

    var msg = (arguments.length === 2 ?
        String(var_args) : fmt.apply(fmt, Array.prototype.slice.call(arguments, 1)));

    error.errors.push(line === -1 ? msg : fmt("line {0}: {1}", line, msg));
}

error.reset = function() {
    error.errors = [];
};

error.getline = function(node) {
    if (node && node.loc && node.loc.start) {
        return node.loc.start.line;
    }
    return -1;
};

error.reset();

module.exports = error;
