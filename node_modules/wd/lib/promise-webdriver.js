var __slice = Array.prototype.slice,
    Q = require('q'),
    _ = require('./lodash'),
    EventEmitter = require('events').EventEmitter,
    slice = Array.prototype.slice.call.bind(Array.prototype.slice),
    utils = require('./utils');

// The method below returns no result, so we are able hijack the result to
// preserve the element scope.
// This alows for thing like: field.click().clear().input('hello').getValue()
var elementChainableMethods = ['clear','click','doubleClick','doubleclick',
  'flick','tap','sendKeys','submit','type','keys','moveTo','sleep','noop'];

// gets the list of methods to be promisified.
function filterPromisedMethods(Obj) {
  return _(Obj).functions().filter(function(fname) {
    return  !fname.match('^newElement$|^toJSON$|^toString$|^_') &&
            !EventEmitter.prototype[fname];
  }).value();
}

module.exports = function(WebDriver, Element, chainable) {

  // wraps element + browser call in an enriched promise.
  // This is the same as in the first promise version, but enrichment +
  // event logging were added.
  function wrap(fn, fname) {
    return function() {
      var _this = this;
      var callback;
      var args = slice(arguments);
      var deferred = Q.defer();
      deferred.promise.then(function() {
        _this.emit("promise", _this, fname , args , "finished");
      });


      // Remove any undefined values from the end of the arguments array
      // as these interfere with our callback detection below
      for (var i = args.length - 1; i >= 0 && args[i] === undefined; i--) {
        args.pop();
      }

      // If the last argument is a function assume that it's a callback
      // (Based on the API as of 2012/12/1 this assumption is always correct)
      if(typeof args[args.length - 1] === 'function')
      {
        // Remove to replace it with our callback and then call it
        // appropriately when the promise is resolved or rejected
        callback = args.pop();
        deferred.promise.then(function(value) {
          callback(null, value);
        }, function(error) {
          callback(error);
        });
      }

      args.push(deferred.makeNodeResolver());
      _this.emit("promise", _this, fname , args , "calling");
      fn.apply(this, args);

      if(chainable) {
        return this._enrich(deferred.promise);
      } else {
        return deferred.promise;
      }
    };
  }

  // Element replacement.
  var PromiseElement = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return Element.apply(this, args);
  };
  PromiseElement.prototype = Object.create(Element.prototype);
  PromiseElement.prototype.isPromised = true;

  // WebDriver replacement.
  var PromiseWebdriver = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return WebDriver.apply(this, args);
  };
  PromiseWebdriver.prototype = Object.create(WebDriver.prototype);
  PromiseWebdriver.prototype.isPromised = true;
  PromiseWebdriver.prototype.defaultChainingScope = 'browser';

  PromiseWebdriver.prototype.getDefaultChainingScope = function() {
    return this.defaultChainingScope;
  };


  // wrapping browser methods with promises.
  _(filterPromisedMethods(WebDriver.prototype)).each(function(fname) {
    PromiseWebdriver.prototype[fname] = wrap(WebDriver.prototype[fname], fname);
  }).value();

  // wrapping element methods with promises.
  _(filterPromisedMethods(Element.prototype)).each(function(fname) {
    PromiseElement.prototype[fname] = wrap(Element.prototype[fname], fname);
  }).value();

  PromiseWebdriver.prototype.newElement = function(jsonWireElement) {
    return new PromiseElement(jsonWireElement, this);
  };

  // enriches a promise with the browser + element methods.
  PromiseWebdriver.prototype._enrich = function(obj, currentEl) {
    var _this = this;
    // There are cases were enrich may be called on non-promise objects.
    // It is easier and safer to check within the method.
    if(utils.isPromise(obj) && !obj.__wd_promise_enriched) {
      var promise = obj;

      // __wd_promise_enriched is there to avoid enriching twice.
      promise.__wd_promise_enriched = true;

      // making sure all the sub-promises are also enriched.
      _(promise).functions().each(function(fname) {
        var _orig = promise[fname];
        promise[fname] = function() {
          return this._enrich(
            _orig.apply(this, __slice.call(arguments, 0)), currentEl);
        };
      }).value();

      // we get the list of methods dynamically.
      var promisedMethods = filterPromisedMethods(Object.getPrototypeOf(_this));
      _this.sampleElement = _this.sampleElement || _this.newElement(1);
      var elementPromisedMethods = filterPromisedMethods(Object.getPrototypeOf(_this.sampleElement));
      var allPromisedMethods = _.union(promisedMethods, elementPromisedMethods);

      // adding browser + element methods to the current promise.
      _(allPromisedMethods).each(function(fname) {
        promise[fname] = function() {
          var args = __slice.call(arguments, 0);
          // This is a hint to figure out if we need to call a browser method or
          // an element method.
          // "<" --> browser method
          // ">" --> element method
          var scopeHint;
          if(args && args[0] && typeof args[0] === 'string' && args[0].match(/^[<>]$/)) {
            scopeHint = args[0];
            args = _.rest(args);
          }

          return this.then(function(res) {
            var el;
            // if the result is an element it has priority
            if(Element && res instanceof Element) {
              el = res; }
            // if we are within an element
            el = el || currentEl;

            // testing the water for the next call scope
            var isBrowserMethod =
              _.indexOf(promisedMethods, fname) >= 0;
            var isElementMethod =
              el && _.indexOf(elementPromisedMethods, fname) >= 0;
            if(!isBrowserMethod && !isElementMethod) {
              // doesn't look good
              throw new Error("Invalid method " + fname);
            }

            if(isBrowserMethod && isElementMethod) {
              // we need to resolve the conflict.
              if(scopeHint === '<') {
                isElementMethod = false;
              } else if(scopeHint === '>') {
                isBrowserMethod = false;
              } else if(fname.match(/element/) || (Element && args[0] instanceof Element)) {
                // method with element locators are browser scoped by default.
                if(_this.defaultChainingScope === 'element') { isBrowserMethod = false; }
                else { isElementMethod = false; } // default
              } else if(Element && args[0] instanceof Element) {
                // When an element is passed, we are in the global scope.                
                isElementMethod = false;
              } else {
                // otherwise we stay in the element scope to allow sequential calls
                isBrowserMethod = false;
              }
            }

            if(isElementMethod) {
              // element method case.
              return el[fname].apply(el, args).then(function(res) {
                if(_.indexOf(elementChainableMethods, fname) >= 0) {
                  // method like click, where no result is expected, we return
                  // the element to make it chainable
                  return el;
                } else {
                  return res; // we have no choice but loosing the scope
                }
              });
            }else{
              // browser case.
              return _this[fname].apply(_this, args);
            }
          });
        };
      }).value();
      // transfering _enrich
      promise._enrich = function(target) {
        return _this._enrich(target, currentEl);
      };

      // gets the element at index (starting at 0)
      promise.at = function(i) {
        return _this._enrich( promise.then(function(vals) {
          return vals[i];
        }), currentEl);
      };

      // gets the element at index (starting at 0)
      promise.last = function() {
        return promise.then(function(vals) {
          return vals[vals.length - 1];
        });
      };

      // gets nth element (starting at 1)
      promise.nth = function(i) {
        return promise.at(i - 1);
      };

      // gets the first element
      promise.first = function() {
        return promise.nth(1);
      };

      // gets the first element
      promise.second = function() {
        return promise.nth(2);
      };

      // gets the first element
      promise.third = function() {
        return promise.nth(3);
      };

      // print error
      promise.printError = function(prepend) {
        prepend = prepend || "";
        return _this._enrich( promise.catch(function(err) {
          console.log(prepend + err);
          throw err;
        }), currentEl);
      };

      // print
      promise.print = function(prepend) {
        prepend = prepend || "";
        return _this._enrich( promise.then(function(val) {
          console.log(prepend + val);
        }), currentEl);
      };
    }
    return obj;
  };

  /**
   * Starts the chain (promised driver only)
   * browser.chain()
   * element.chain()
   */
  PromiseWebdriver.prototype.chain = PromiseWebdriver.prototype.noop;
  PromiseElement.prototype.chain = PromiseElement.prototype.noop;

  /**
   * Resolves the promise (promised driver only)
   * browser.resolve(promise)
   * element.resolve(promise)
   */
  PromiseWebdriver.prototype.resolve = function(promise) {
    var qPromise = new Q(promise);
    this._enrich(qPromise);
    return qPromise;
  };
  PromiseElement.prototype.resolve = function(promise) {
    var qPromise = new Q(promise);
    this._enrich(qPromise);
    return qPromise;
  };


  // used to by chai-as-promised and custom methods
  PromiseElement.prototype._enrich = function(target) {
    if(chainable) { return this.browser._enrich(target, this); }
  };

  // used to wrap custom methods
  PromiseWebdriver._wrapAsync = wrap;

  // helper to allow easier promise debugging.
  PromiseWebdriver.prototype._debugPromise = function() {
    this.on('promise', function(context, method, args, status) {
      args = _.clone(args);
      if(context instanceof PromiseWebdriver) {
        context = '';
      } else {
        context = ' [element ' + context.value + ']';
      }
      if(typeof _.last(args) === 'function') {
        args.pop();
      }
      args = ' ( ' + _(args).map(function(arg) {
        if(arg instanceof Element) {
          return arg.toString();
        } else if(typeof arg === 'object') {
          return JSON.stringify(arg);
        } else {
          return arg;
        }
      }).join(', ') + ' )';
      console.log(' --> ' + status + context + " " + method + args);
    });
  };

  return {
    PromiseWebdriver: PromiseWebdriver,
    PromiseElement: PromiseElement
  };
};
