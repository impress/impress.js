"use strict";

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

var _utilLocation = require("../util/location");

// Start an AST node, attaching a start offset.

var pp = _index2["default"].prototype;

var Node = (function () {
  function Node(parser, pos, loc) {
    _classCallCheck(this, Node);

    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new _utilLocation.SourceLocation(loc);
  }

  Node.prototype.__clone = function __clone() {
    var node2 = new Node();
    for (var key in this) node2[key] = this[key];
    return node2;
  };

  return Node;
})();

exports.Node = Node;

pp.startNode = function () {
  return new Node(this, this.state.start, this.state.startLoc);
};

pp.startNodeAt = function (pos, loc) {
  return new Node(this, pos, loc);
};

function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  node.loc.end = loc;
  this.processComment(node);
  return node;
}

// Finish an AST node, adding `type` and `end` properties.

pp.finishNode = function (node, type) {
  return finishNodeAt.call(this, node, type, this.state.lastTokEnd, this.state.lastTokEndLoc);
};

// Finish node at given position

pp.finishNodeAt = function (node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};