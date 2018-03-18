var estraverse = require('estraverse');
var assign = require('lodash').assign;
var VISITOR_KEYS = require('./visitor-keys');

var keys = assign({}, VISITOR_KEYS, estraverse.VisitorKeys, {
    // These are deprecated, need to remove it in the future
    XJSIdentifier: [],
    XJSNamespacedName: ['namespace', 'name'],
    XJSMemberExpression: ['object', 'property'],
    XJSEmptyExpression: [],
    XJSExpressionContainer: ['expression'],
    XJSElement: ['openingElement', 'closingElement', 'children'],
    XJSClosingElement: ['name'],
    XJSOpeningElement: ['name', 'attributes'],
    XJSAttribute: ['name', 'value'],
    XJSSpreadAttribute: ['argument'],
    XJSText: null,

    // babel-core extends the estraverse "VisitorKeys" property with old TryStatement path
    // We need to revert it back
    TryStatement: ['block', 'handler', 'finalizer']
});

module.exports.iterate = function iterate(node, cb) {
    if ('type' in node) {
        estraverse.traverse(node, {
            enter: function(node, parent) {
                var parentCollection = [];

                // parentCollection support
                var path = this.path();
                if (path) {
                    var collectionKey;
                    while (path.length > 0) {
                        var pathElement = path.pop();
                        if (typeof pathElement === 'string') {
                            collectionKey = pathElement;
                            break;
                        }
                    }

                    parentCollection = parent[collectionKey];
                    if (!Array.isArray(parentCollection)) {
                        parentCollection = [parentCollection];
                    }
                }

                if (cb(node, parent, parentCollection) === false) {
                    return estraverse.VisitorOption.Skip;
                }
            },
            keys: keys
        });
    }
};
