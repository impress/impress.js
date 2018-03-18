var esprima = require('esprima');
var recast = require('recast');
var transform = require('./transform-tree.js');

module.exports = function(input, options) {
	options || (options = {});
	var sourceFileName = options.sourceFileName || '';
	var sourceMapName = options.sourceMapName || '';
	var createSourceMap = sourceFileName && sourceMapName;
	var tree = recast.parse(input, {
		'esprima': esprima,
		'sourceFileName': sourceFileName
	});
	tree = transform(tree);
	if (createSourceMap) {
		// If a source map was requested, return an object with `code` and `map`
		// properties.
		return recast.print(tree, {
			'sourceMapName': sourceMapName
		});
	}
	// If no source map was requested, return the transpiled code directly.
	return recast.print(tree).code;
};
