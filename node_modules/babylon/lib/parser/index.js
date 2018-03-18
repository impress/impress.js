"use strict";

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilIdentifier = require("../util/identifier");

var _options = require("../options");

var _tokenizer = require("../tokenizer");

var _tokenizer2 = _interopRequireDefault(_tokenizer);

// Registered plugins

var plugins = {};

exports.plugins = plugins;

var Parser = (function (_Tokenizer) {
  _inherits(Parser, _Tokenizer);

  function Parser(options, input) {
    _classCallCheck(this, Parser);

    _Tokenizer.call(this, input);

    this.options = _options.getOptions(options);
    this.isKeyword = _utilIdentifier.isKeyword;
    this.isReservedWord = _utilIdentifier.reservedWords[6];
    this.input = input;
    this.loadPlugins(this.options.plugins);

    // Figure out if it's a module code.
    this.inModule = this.options.sourceType === "module";
    this.strict = this.options.strictMode === false ? false : this.inModule;

    // If enabled, skip leading hashbang line.
    if (this.state.pos === 0 && this.input[0] === "#" && this.input[1] === "!") {
      this.skipLineComment(2);
    }
  }

  Parser.prototype.extend = function extend(name, f) {
    this[name] = f(this[name]);
  };

  Parser.prototype.loadPlugins = function loadPlugins(plugins) {
    for (var _name in plugins) {
      var plugin = exports.plugins[_name];
      if (!plugin) throw new Error("Plugin '" + _name + "' not found");
      plugin(this, plugins[_name]);
    }
  };

  Parser.prototype.parse = function parse() {
    var file = this.startNode();
    var program = this.startNode();
    this.nextToken();
    return this.parseTopLevel(file, program);
  };

  return Parser;
})(_tokenizer2["default"]);

exports["default"] = Parser;