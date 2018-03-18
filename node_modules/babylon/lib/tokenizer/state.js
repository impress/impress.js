"use strict";

exports.__esModule = true;
// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _utilLocation = require("../util/location");

var _context = require("./context");

var _types = require("./types");

var State = (function () {
  function State() {
    _classCallCheck(this, State);
  }

  State.prototype.init = function init(input) {
    this.input = input;

    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;

    // Flags to track whether we are in a function, a generator.
    this.inFunction = this.inGenerator = false;

    // Labels in scope.
    this.labels = [];

    // Leading decorators.
    this.decorators = [];

    // Token store.
    this.tokens = [];

    // Comment store.
    this.comments = [];

    // Comment attachment store
    this.trailingComments = [];
    this.leadingComments = [];
    this.commentStack = [];

    // The current position of the tokenizer in the input.
    this.pos = this.lineStart = 0;
    this.curLine = 1;

    // Properties of the current token:
    // Its type
    this.type = _types.types.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();

    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = [_context.types.b_stat];
    this.exprAllowed = true;

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.

    this.containsEsc = false;

    return this;
  };

  State.prototype.curPosition = function curPosition() {
    return new _utilLocation.Position(this.curLine, this.pos - this.lineStart);
  };

  State.prototype.clone = function clone() {
    var state = new State();
    for (var key in this) {
      var val = this[key];
      if (Array.isArray(val)) val = val.slice();
      state[key] = val;
    }
    return state;
  };

  return State;
})();

exports["default"] = State;
module.exports = exports["default"];