var assert = require("assert");
var types = require("./types");
var getFieldValue = types.getFieldValue;
var n = types.namedTypes;
var sourceMap = require("source-map");
var SourceMapConsumer = sourceMap.SourceMapConsumer;
var SourceMapGenerator = sourceMap.SourceMapGenerator;
var hasOwn = Object.prototype.hasOwnProperty;

function getUnionOfKeys() {
    var result = {};
    var argc = arguments.length;
    for (var i = 0; i < argc; ++i) {
        var keys = Object.keys(arguments[i]);
        var keyCount = keys.length;
        for (var j = 0; j < keyCount; ++j) {
            result[keys[j]] = true;
        }
    }
    return result;
}
exports.getUnionOfKeys = getUnionOfKeys;

function comparePos(pos1, pos2) {
    return (pos1.line - pos2.line) || (pos1.column - pos2.column);
}
exports.comparePos = comparePos;

function copyPos(pos) {
    return {
        line: pos.line,
        column: pos.column
    };
}
exports.copyPos = copyPos;

exports.composeSourceMaps = function(formerMap, latterMap) {
    if (formerMap) {
        if (!latterMap) {
            return formerMap;
        }
    } else {
        return latterMap || null;
    }

    var smcFormer = new SourceMapConsumer(formerMap);
    var smcLatter = new SourceMapConsumer(latterMap);
    var smg = new SourceMapGenerator({
        file: latterMap.file,
        sourceRoot: latterMap.sourceRoot
    });

    var sourcesToContents = {};

    smcLatter.eachMapping(function(mapping) {
        var origPos = smcFormer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
        });

        var sourceName = origPos.source;
        if (sourceName === null) {
            return;
        }

        smg.addMapping({
            source: sourceName,
            original: copyPos(origPos),
            generated: {
                line: mapping.generatedLine,
                column: mapping.generatedColumn
            },
            name: mapping.name
        });

        var sourceContent = smcFormer.sourceContentFor(sourceName);
        if (sourceContent && !hasOwn.call(sourcesToContents, sourceName)) {
            sourcesToContents[sourceName] = sourceContent;
            smg.setSourceContent(sourceName, sourceContent);
        }
    });

    return smg.toJSON();
};

exports.getTrueLoc = function(node, lines) {
    // It's possible that node is newly-created (not parsed by Esprima),
    // in which case it probably won't have a .loc property (or an
    // .original property for that matter). That's fine; we'll just
    // pretty-print it as usual.
    if (!node.loc) {
        return null;
    }

    var start = node.loc.start;
    var end = node.loc.end;

    // If the node has any comments, their locations might contribute to
    // the true start/end positions of the node.
    if (node.comments) {
        node.comments.forEach(function(comment) {
            if (comment.loc) {
                if (comparePos(comment.loc.start, start) < 0) {
                    start = comment.loc.start;
                }

                if (comparePos(end, comment.loc.end) < 0) {
                    end = comment.loc.end;
                }
            }
        });
    }

    return {
        // Finally, trim any leading or trailing whitespace from the true
        // location of the node.
        start: lines.skipSpaces(start, false, false),
        end: lines.skipSpaces(end, true, false)
    };
};

exports.fixFaultyLocations = function(node) {
    if ((n.MethodDefinition && n.MethodDefinition.check(node)) ||
        (n.Property.check(node) && (node.method || node.shorthand))) {
        // If the node is a MethodDefinition or a .method or .shorthand
        // Property, then the location information stored in
        // node.value.loc is very likely untrustworthy (just the {body}
        // part of a method, or nothing in the case of shorthand
        // properties), so we null out that information to prevent
        // accidental reuse of bogus source code during reprinting.
        node.value.loc = null;

        if (n.FunctionExpression.check(node.value)) {
            // FunctionExpression method values should be anonymous,
            // because their .id fields are ignored anyway.
            node.value.id = null;
        }
    }

    var loc = node.loc;
    if (loc) {
        if (loc.start.line < 1) {
            loc.start.line = 1;
        }

        if (loc.end.line < 1) {
            loc.end.line = 1;
        }
    }
};
