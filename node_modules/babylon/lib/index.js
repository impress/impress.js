"use strict";

exports.__esModule = true;
exports.parse = parse;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _parser = require("./parser");

var _parser2 = _interopRequireDefault(_parser);

require("./parser/util");

require("./parser/statement");

require("./parser/lval");

require("./parser/expression");

require("./parser/node");

require("./parser/location");

require("./parser/comments");

var _tokenizerTypes = require("./tokenizer/types");

require("./tokenizer");

require("./tokenizer/context");

var _pluginsFlow = require("./plugins/flow");

var _pluginsFlow2 = _interopRequireDefault(_pluginsFlow);

var _pluginsJsx = require("./plugins/jsx");

var _pluginsJsx2 = _interopRequireDefault(_pluginsJsx);

_parser.plugins.flow = _pluginsFlow2["default"];
_parser.plugins.jsx = _pluginsJsx2["default"];

function parse(input, options) {
  return new _parser2["default"](options, input).parse();
}

exports.tokTypes = _tokenizerTypes.types;