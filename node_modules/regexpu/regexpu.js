module.exports = {
	'rewritePattern': require('./rewrite-pattern.js'),
	'transformTree': require('./transform-tree.js'),
	'transpileCode': require('./transpile-code.js'),
	'version': require('./package.json').version
};

module.exports.transform = module.exports.transformTree;
