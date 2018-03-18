var async = require("async");
var _ = require("./lodash");

var deprecatedChain ={};

deprecatedChain.chain = function(obj){
  var _this = this;
  if (!obj) { obj = {}; }

  // Update the onError callback if supplied.  The most recent .chain()
  // invocation overrides previous onError handlers.
  if (obj.onError) {
    this._chainOnErrorCallback = obj.onError;
  } else if (!this._chainOnErrorCallback) {
    this._chainOnErrorCallback = function(err) {
      if (err) { console.error("a function in your .chain() failed:", err); }
    };
  }

  // Add queue if not already here
  if(!_this._queue){
    _this._queue = async.queue(function (task, callback) {
      if(task.args.length > 0 && typeof task.args[task.args.length-1] === "function"){
        //wrap the existing callback
        //if this is queueAddAsync, we instead create a callback that will be
        //passed through to the function provided
        var cb_arg = (task.name === 'queueAddAsync' ? 1 : task.args.length - 1);
        var func = task.args[cb_arg];
        task.args[cb_arg] = function(err) {
          // if the chain user has their own callback, we will not invoke
          // the onError handler, supplying your own callback suggests you
          // handle the error on your own.
          if (func)
            { func.apply(null, arguments); }
          if (!_this._chainHalted) { callback(err); }
        };
      } else {
        // if the .chain() does not supply a callback, we assume they
        // expect us to catch errors.
        task.args.push(function(err) {
          // if there is an error, call the onError callback,
          // and do not invoke callback() which would make the
          // task queue continue processing
          if (err) { _this._chainOnErrorCallback(err); }
          else { callback(); }
        });
      }

      //call the function
      _this[task.name].apply(_this, task.args);
    }, 1);

    // add unshift method if we need to add sth to the queue
    _this._queue = _.extend(_this._queue, {
      unshift: function (data, callback) {
        var _this = this;
        if(data.constructor !== Array) {
            data = [data];
        }
        data.forEach(function(task) {
            _this.tasks.unshift({
                data: task,
                callback: typeof callback === 'function' ? callback : null
            });
            if (_this.saturated && _this.tasks.length === _this.concurrency) {
                _this.saturated();
            }
            async.nextTick(_this.process);
        });
      }
    });
  }

  var chain = {};

  //builds a placeHolder functions
  var buildPlaceholder = function(name){
    return function(){
      _this._queue.push({name: name, args: Array.prototype.slice.call(arguments, 0)});
      return chain;
    };
  };

  //fill the chain with placeholders
  _.each(_.functions(_this), function(k) {
    if(k !== "chain"){
      chain[k] = buildPlaceholder(k);
    }
  });

  return chain;
};

// manually stop processing of queued chained functions
deprecatedChain.haltChain = function(){
  this._chainHalted = true;
  this._queue = null;
};

deprecatedChain.pauseChain = function(timeoutMs, cb){
  setTimeout(function() {
    cb();
  }, timeoutMs);
  return this.chain;
};

deprecatedChain.next = function(){
  this._queue.unshift({name: arguments[0], args: _.rest(arguments)});
};

deprecatedChain.queueAdd = function(func){
  func();
  return this.chain;
};

deprecatedChain.queueAddAsync = function(func, cb) {
  func(cb);
  return this.chain;
};

module.exports = {
  patch: function(browser) {
    _(deprecatedChain).methods().each(function(methodName) {
      browser[methodName] = deprecatedChain[methodName].bind(browser);
    }).value();
  }
};
