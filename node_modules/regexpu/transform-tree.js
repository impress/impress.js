var recast = require('recast');
var rewritePattern = require('./rewrite-pattern.js');
var types = recast.types;

var visitor = types.PathVisitor.fromMethodsObject({
	// This method is called for any AST node whose `type` is `Literal`.
	'visitLiteral': function(path) {
		var node = path.value;

		if (!node.regex) {
			return false;
		}

		var flags = node.regex.flags;
		if (flags.indexOf('u') == -1) {
			return false;
		}

		var newPattern = rewritePattern(node.regex.pattern, flags);
		var newFlags = flags.replace('u', '');
		var result = '/' + newPattern + '/' + newFlags;
		node.regex = {
			'pattern': newPattern,
			'flags': newFlags
		}
		node.raw = result;
		node.value = {
			'toString': function() {
				return result;
			}
		};

		// Return `false` to indicate that the traversal need not continue any
		// further down this subtree. (`Literal`s don’t have descendants anyway.)
		return false;
	}
});

module.exports = function(node) {
	return types.visit(node, visitor);
};
