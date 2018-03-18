//Element object
//Wrapper around browser methods
var __slice = Array.prototype.slice;
var _ = require("./lodash")
  , utils = require("./utils.js")
  , niceArgs = utils.niceArgs
  , niceResp = utils.niceResp
  , elementCommands = require('./element-commands');

var Element = function(value, browser) {
  this.value = value;
  this.browser = browser;

  if(!value){
    throw new Error("no value passed to Element constructor");
  }

  if(!browser){
    throw new Error("no browser passed to Element constructor");
  }
};

Element.prototype.emit = function() {
  this.browser.emit.apply(this.browser, __slice.call(arguments, 0));
};

Element.prototype.toString = function () {
  return String(this.value);
};

Element.prototype.toJSON = function () {
  return { ELEMENT: this.value };
};

_(elementCommands).each(function(fn, name) {
  Element.prototype[name] = function() {
    var _this = this;
    var fargs = utils.varargs(arguments);
    this.emit('command', "CALL" , "element." + name + niceArgs(fargs.all));
    var cb = function(err) {
      if(err) {
        err.message = '[element.' + name + niceArgs(fargs.all) + "] " + err.message;
        fargs.callback(err);
      } else {
        var cbArgs = __slice.call(arguments, 0);
        _this.emit('command', "RESPONSE" , "element." + name + niceArgs(fargs.all),
          niceResp(_.rest(cbArgs)));
        fargs.callback.apply(null, cbArgs);
      }
    };
    var args = fargs.all.concat([cb]);
    return fn.apply(this, args);
  };
}).value();

module.exports = Element;
