var fs = require("fs"),
    url = require('url'),
    path = require('path'),
    tmp = require('./tmp'),
    _ = require("./lodash"),
    async = require('async'),
    __slice = Array.prototype.slice,
    config = require('./config'),
    callbacks = require("./callbacks"),
    callbackWithData = callbacks.callbackWithData,
    simpleCallback = callbacks.simpleCallback,
    elementCallback = callbacks.elementCallback,
    elementsCallback = callbacks.elementsCallback,
    elementOrElementsCallback = callbacks.elementOrElementsCallback,
    utils = require("./utils"),
    findCallback = utils.findCallback,
    codeToString = utils.codeToString,
    deprecator = utils.deprecator,
    asserters = require("./asserters"),
    Asserter = asserters.Asserter;

var commands = {};

/**
 * init(desired, cb) -> cb(err, sessionID, capabilities)
 * Initialize the browser. capabilities return may be
 * absent, depending on driver.
 *
 * @jsonWire POST /session
 */
commands.init = function() {
  var args = __slice.call(arguments, 0);
  this._init.apply(this, args);
};

/**
 * status(cb) -> cb(err, status)
 *
 * @jsonWire GET /status
 */
commands.status = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , absPath: 'status'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * sessions(cb) -> cb(err, sessions)
 *
 * @jsonWire GET /sessions
 */
commands.sessions = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , absPath: 'sessions'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * Retrieves the current session id.
 * getSessionId(cb) -> cb(err, sessionId)
 * getSessionId()
 */
commands.getSessionId = function() {
  var cb = findCallback(arguments);
  if(cb) { cb(null, this.sessionID); }
  return this.sessionID;
};

commands.getSessionID = commands.getSessionId;

/**
 * execute(code, args, cb) -> cb(err, result)
 * execute(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *
 * @jsonWire POST /session/:sessionId/execute
 * @docOrder 1
 */
commands.execute = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      code = fargs.all[0],
      args = fargs.all[1] || [];
  code = codeToString(code);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute'
    , cb: callbackWithData(cb, this)
    , data: {script: code, args: args}
  });
};

// script to be executed in browser
var safeExecuteJsScript =
  utils.inlineJs(fs.readFileSync( __dirname + "/../browser-scripts/safe-execute.js", 'utf8'));

/**
 * Safely execute script within an eval block, always returning:
 * safeExecute(code, args, cb) -> cb(err, result)
 * safeExecute(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *
 * @jsonWire POST /session/:sessionId/execute
 * @docOrder 2
 */
commands.safeExecute = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      code = fargs.all[0],
      args = fargs.all[1] || [];

  code = codeToString(code);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute'
    , cb: callbackWithData(cb, this)
    , data: {script: safeExecuteJsScript, args: [code, args]}
  });
};

/**
 * Evaluate expression (using execute):
 * eval(code, cb) -> cb(err, value)
 *
 * @jsonWire POST /session/:sessionId/execute
 */
(function() {
  // jshint evil: true
  commands.eval = function(code) {
    var cb = findCallback(arguments);
    code = codeToString(code);
    code = "return " + code + ";";
    commands.execute.apply(this, [code, function(err, res) {
      if(err) {return cb(err);}
      cb(null, res);
    }]);
  };
})();

/**
 * Safely evaluate expression, always returning  (using safeExecute):
 * safeEval(code, cb) -> cb(err, value)
 *
 * @jsonWire POST /session/:sessionId/execute
 */
commands.safeEval = function(code) {
  var cb = findCallback(arguments);
  code = codeToString(code);
  commands.safeExecute.apply(this, [code, function(err, res) {
    if(err) {return cb(err);}
    cb(null, res);
  }]);
};

/**
 * executeAsync(code, args, cb) -> cb(err, result)
 * executeAsync(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *
 * @jsonWire POST /session/:sessionId/execute_async
 */
  commands.executeAsync = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      code = fargs.all[0],
      args = fargs.all[1] || [];

  code = codeToString(code);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute_async'
    , cb: callbackWithData(cb, this)
    , data: {script: code, args: args}
  });
};

// script to be executed in browser
var safeExecuteAsyncJsScript =
  utils.inlineJs(fs.readFileSync( __dirname + "/../browser-scripts/safe-execute-async.js", 'utf8'));

/**
 * Safely execute async script within an eval block, always returning:
 * safeExecuteAsync(code, args, cb) -> cb(err, result)
 * safeExecuteAsync(code, cb) -> cb(err, result)
 * args: script argument array (optional)
 *
 * @jsonWire POST /session/:sessionId/execute_async
 */
commands.safeExecuteAsync = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      code = fargs.all[0],
      args = fargs.all[1] || [];

  code = codeToString(code);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/execute_async'
    , cb: callbackWithData(cb, this)
    , data: {script: safeExecuteAsyncJsScript , args: [code, args]}
  });
};

/**
 * Alternate strategy to get session capabilities from server session list:
 * altSessionCapabilities(cb) -> cb(err, capabilities)
 *
 * @jsonWire GET /sessions
 */
commands.altSessionCapabilities = function() {
  var cb = findCallback(arguments);
  var _this = this;
  // looking for the current session
  commands.sessions.apply(this, [function(err, sessions) {
    if(err) {
      cb(err, sessions);
    } else {
      sessions = sessions.filter(function(session) {
        return session.id === _this.sessionID;
      });
      cb(null, sessions[0]? sessions[0].capabilities : 0);
    }
  }]);
};

/**
 * sessionCapabilities(cb) -> cb(err, capabilities)
 *
 * @jsonWire GET /session/:sessionId
 */
commands.sessionCapabilities = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    // default url
    , cb: callbackWithData(cb, this)
  });
};

/**
 * Opens a new window (using Javascript window.open):
 * newWindow(url, name, cb) -> cb(err)
 * newWindow(url, cb) -> cb(err)
 * name: optional window name
 * Window can later be accessed by name with the window method,
 * or by getting the last handle returned by the windowHandles method.
 */
commands.newWindow = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      url =  fargs.all[0],
      name = fargs.all[1];
  commands.execute.apply(
    this,
    [ "var url=arguments[0], name=arguments[1]; window.open(url, name);",
      [url,name] , cb]);
};

/**
 * close(cb) -> cb(err)
 *
 * @jsonWire DELETE /session/:sessionId/window
 */
commands.close = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/window'
    , cb: simpleCallback(cb)
  });
};

/**
 * currentContext(cb) -> cb(err)
 *
 * @jsonWire GET /session/:sessionId/context
 */
commands.currentContext = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/context'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * context(contextRef, cb) -> cb(err, context)
 *
 * @jsonWire POST /session/:sessionId/context
 */
commands.context = function(contextRef) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/context'
    , cb: simpleCallback(cb)
    , data: { name: contextRef }
  });
};

/**
 * contexts(cb) -> cb(err, handle)
 *
 * @jsonWire GET /session/:sessionId/contexts
 */
commands.contexts = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/contexts'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * window(name, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/window
 */
commands.window = function(windowRef) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/window'
    , cb: simpleCallback(cb)
    , data: { name: windowRef }
  });
};

/**
 * frame(frameRef, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/frame
 */
commands.frame = function(frameRef) {
  var cb = findCallback(arguments);
  // avoid using this, Webdriver seems very buggy
  // doesn't work at all with chromedriver
  if(typeof(frameRef) === 'function'){
    frameRef = null;
  }
  if(frameRef !== null && typeof(frameRef.value) !== "undefined"){
    // we have an element object
    frameRef = {ELEMENT: frameRef.value};
  }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/frame'
    , cb: simpleCallback(cb)
    , data: { id: frameRef }
  });
};

/**
 * windowName(cb) -> cb(err, name)
 */
commands.windowName = function() {
  var cb = findCallback(arguments);
  // jshint evil: true
  commands.eval.apply(this, ["window.name", cb]);
};

/**
 * windowHandle(cb) -> cb(err, handle)
 *
 * @jsonWire GET /session/:sessionId/window_handle
 */
commands.windowHandle = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/window_handle'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * windowHandles(cb) -> cb(err, arrayOfHandles)
 *
 * @jsonWire GET /session/:sessionId/window_handles
 */
commands.windowHandles = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/window_handles'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getGeoLocation(cb) -> cb(err, geoLocationObj)
 *
 * @jsonWire GET /session/:sessionId/location
 */
commands.getGeoLocation = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/location'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * setGeoLocation(lat, lon, alt, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/location
 */
commands.setGeoLocation = function(lat, lon, alt) {
  var cb = findCallback(arguments);
  if(typeof(alt) === 'function'){
    alt = 0;
  }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/location'
    , cb: simpleCallback(cb)
    , data: {location :{latitude: lat, longitude: lon, altitude: alt }}
  });
};

/**
 * scroll(xOffset, yOffset, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/log
 */
commands.scroll = function(xOffset, yOffset) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/touch/scroll'
    , cb: simpleCallback(cb, this)
    , data: { xoffset: xOffset, yoffset: yOffset }
  });
};


/**
 * logTypes(cb) -> cb(err, arrayOfLogTypes)
 *
 * @jsonWire GET /session/:sessionId/log/types
 */
commands.logTypes = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/log/types'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * log(logType, cb) -> cb(err, arrayOfLogs)
 *
 * @jsonWire POST /session/:sessionId/log
 */
commands.log = function(logType) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/log'
    , cb: callbackWithData(cb, this)
    , data: { type: logType }
  });
};

/**
 * quit(cb) -> cb(err)
 * Destroy the browser.
 *
 * @jsonWire DELETE /session/:sessionId
 */
commands.quit = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'DELETE'
    // default url
    , emit: {event: 'status', message: '\nEnding your web drivage..\n'}
    , cb: simpleCallback(cb)
  });
};

/**
 * get(url,cb) -> cb(err)
 * Get a new url.
 *
 * @jsonWire POST /session/:sessionId/url
 */
commands.get = function(_url) {
  if(this._httpConfig.baseUrl) {_url = url.resolve(this._httpConfig.baseUrl, _url); }
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/url'
    , data: {'url': _url}
    , cb: simpleCallback(cb)
  });
};

/**
 * refresh(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/refresh
 */
commands.refresh = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/refresh'
    , cb: simpleCallback(cb)
  });
};

/**
  * maximize(handle, cb) -> cb(err)
  *
  * @jsonWire POST /session/:sessionId/window/:windowHandle/maximize
 */
commands.maximize = function(win) {
var cb = findCallback(arguments);
this._jsonWireCall({
	method: 'POST'
	, relPath: '/window/'+ win + '/maximize'
	, cb: simpleCallback(cb)
	});
};

/**
  * windowSize(handle, width, height, cb) -> cb(err)
  *
  * @jsonWire POST /session/:sessionId/window/:windowHandle/size
 */
commands.windowSize = function(win, width, height) {
var cb = findCallback(arguments);
this._jsonWireCall({
  method: 'POST'
  , relPath: '/window/'+ win + '/size'
  , data: {'width':width, 'height':height}
  , cb: simpleCallback(cb)
  });
};

/**
  * getWindowSize(handle, cb) -> cb(err, size)
  * getWindowSize(cb) -> cb(err, size)
  * handle: window handle to get size (optional, default: 'current')
  *
  * @jsonWire GET /session/:sessionId/window/:windowHandle/size
 */
commands.getWindowSize = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      win = fargs.all[0] || 'current';
this._jsonWireCall({
	method: 'GET'
	, relPath: '/window/'+ win + '/size'
	, cb: callbackWithData(cb, this)
	});
};

/**
  * setWindowSize(width, height, handle, cb) -> cb(err)
  * setWindowSize(width, height, cb) -> cb(err)
  * width: width in pixels to set size to
  * height: height in pixels to set size to
  * handle: window handle to set size for (optional, default: 'current')
  * @jsonWire POST /session/:sessionId/window/:windowHandle/size
 */
commands.setWindowSize = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      width = fargs.all[0],
      height = fargs.all[1],
      win = fargs.all[2] || 'current';
this._jsonWireCall({
	method: 'POST'
	, relPath: '/window/'+ win + '/size'
    , cb: simpleCallback(cb)
    , data: {width: width, height: height}
	});
};

/**
  * getWindowPosition(handle, cb) -> cb(err, position)
  * getWindowPosition(cb) -> cb(err, position)
  * handle: window handle to get position (optional, default: 'current')
  *
  * @jsonWire GET /session/:sessionId/window/:windowHandle/position
 */
commands.getWindowPosition = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      win = fargs.all[0] || 'current';
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/window/'+ win + '/position'
    , cb: callbackWithData(cb, this)
    });
};

/**
  * setWindowPosition(x, y, handle, cb) -> cb(err)
  * setWindowPosition(x, y, cb) -> cb(err)
  * x: the x-coordinate in pixels to set the window position
  * y: the y-coordinate in pixels to set the window position
  * handle: window handle to set position for (optional, default: 'current')
  * @jsonWire POST /session/:sessionId/window/:windowHandle/position
 */
commands.setWindowPosition = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      x = fargs.all[0],
      y = fargs.all[1],
      win = fargs.all[2] || 'current';
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/window/'+ win + '/position'
    , cb: simpleCallback(cb)
    , data: {x: x, y: y}
  });
};

/**
 * forward(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/forward
 */
commands.forward = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/forward'
    , cb: simpleCallback(cb)
  });
};

/**
 * back(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/back
 */
commands.back = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/back'
    , cb: simpleCallback(cb)
  });
};

commands.setHttpTimeout = function() {
  deprecator.warn('setHttpTimeout',
    'setHttpTimeout/setHTTPInactivityTimeout has been deprecated, use configureHttp instead.');
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      ms = fargs.all[0];
  commands.configureHttp( {timeout: ms}, cb );
};

commands.setHTTPInactivityTimeout = commands.setHttpTimeout;

/**
 * configureHttp(opts)
 *
 * opts example:
 * {timeout:60000, retries: 3, 'retryDelay': 15, baseUrl='http://example.com/'}
 * more info in README.
 *
 */
commands.configureHttp = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      opts = fargs.all[0];
  config._configureHttp(this._httpConfig, opts);
  if(cb) { cb(null); }
};

/**
 * setImplicitWaitTimeout(ms, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/timeouts/implicit_wait
 */
commands.setImplicitWaitTimeout = function(ms) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts/implicit_wait'
    , data: {ms: ms}
    , cb: simpleCallback(cb)
  });
};

// for backward compatibility
commands.setWaitTimeout = commands.setImplicitWaitTimeout;

/**
 * setAsyncScriptTimeout(ms, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/timeouts/async_script
 */
commands.setAsyncScriptTimeout = function(ms) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts/async_script'
    , data: {ms: ms}
    , cb: simpleCallback(cb)
  });
};

/**
 * setPageLoadTimeout(ms, cb) -> cb(err)
 * (use setImplicitWaitTimeout and setAsyncScriptTimeout to set the other timeouts)
 *
 * @jsonWire POST /session/:sessionId/timeouts
 */
commands.setPageLoadTimeout = function(ms) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts'
    , data: {type: 'page load', ms: ms}
    , cb: simpleCallback(cb)
  });
};

/**
 * setCommandTimeout(ms, cb) -> cb(err)
 * (this is for Appium only)
 * @jsonWire POST /session/:sessionId/timeouts
 */
commands.setCommandTimeout = function(ms) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/timeouts'
    , data: {type: 'command', ms: ms}
    , cb: simpleCallback(cb)
  });
};

/**
 * element(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/element
 */
commands.element = function(using, value) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element'
    , data: {using: using, value: value}
    , cb: elementCallback(cb, this)
  });
};

/**
 * Retrieve an element avoiding not found exception and returning null instead:
 * elementOrNull(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 3
 */
commands.elementOrNull = function(using, value) {
  var cb = findCallback(arguments);
  commands.elements.apply(this, [using, value,
    function(err, elements) {
      if(!err) {
        if(elements.length>0) {cb(null,elements[0]);} else {cb(null,null);}
      } else {
        cb(err); }
    }
  ]);
};

/**
 * Retrieve an element avoiding not found exception and returning undefined instead:
 * elementIfExists(using, value, cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 5
 */
commands.elementIfExists = function(using, value) {
  var cb = findCallback(arguments);
  commands.elements.apply(this, [using, value,
    function(err, elements) {
      if(!err) {
        if(elements.length>0) {cb(null,elements[0]);} else {cb(null);}
      } else {
        cb(err); }
    }
  ]);
};

/**
 * elements(using, value, cb) -> cb(err, elements)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 1
 */
commands.elements = function(using, value) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/elements'
    , data: {using: using, value: value}
    , cb: elementsCallback(cb, this)
  });
};

/**
 * Check if element exists:
 * hasElement(using, value, cb) -> cb(err, boolean)
 *
 * @jsonWire POST /session/:sessionId/elements
 * @docOrder 7
 */
commands.hasElement = function(using, value){
  var cb = findCallback(arguments);
  commands.elements.apply( this, [using, value, function(err, elements){
    if(!err) {
      cb(null, elements.length > 0 );
    } else {
      cb(err); }
  }]);
};

/**
 * waitFor(asserter, timeout, pollFreq, cb) -> cb(err, return_value)
 * timeout and pollFreq are optional (default 1000ms/200ms)
 * waitFor(opts, cb) -> cb(err)
 * opts with the following fields: timeout, pollFreq, asserter.
 * asserter like: function(browser , cb) -> cb(err, satisfied, return_value)
 */
commands.waitFor = function(){
  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var opts;
  // retrieving options
  if(typeof fargs.all[0] === 'object' && !(fargs.all[0] instanceof Asserter)){
    opts = fargs.all[0];
  } else
  {
    opts = {
      asserter: fargs.all[0],
      timeout: fargs.all[1],
      pollFreq: fargs.all[2]
    };
  }

  // default
  opts.timeout = opts.timeout || 1000;
  opts.pollFreq = opts.pollFreq || 200;

  if(!opts.asserter) { throw new Error('Missing asserter!'); }

  var _this = this;
  var endTime = Date.now() + opts.timeout;

  var unpromisedAsserter = new Asserter(
    function(browser, cb) {
      var promise = opts.asserter.assert(browser, cb);
      if(promise && promise.then && typeof promise.then === 'function'){
        promise.then(
          function(res) { cb(null, true, res); },
          function(err) {
            if(err.retriable) { cb(null, false); }
            else { throw err; }
          }
        );
      }
    }
  );

  function poll(isFinalCheck){
    unpromisedAsserter.assert(_this, function(err, satisfied, value) {
      if(err) { return cb(err); }
      if(satisfied) {
        cb(null, value);
      } else {
        if(isFinalCheck) {
          cb(new Error("Condition wasn't satisfied!"));
        } else if(Date.now() > endTime){
          // trying one more time for safety
          setTimeout(poll.bind(null, true) , opts.pollFreq);
        } else {
          setTimeout(poll, opts.pollFreq);
        }
      }
    });
  }

  poll();
};

/**
 * waitForElement(using, value, asserter, timeout, pollFreq, cb) -> cb(err, el)
 * waitForElement(using, value, timeout, pollFreq, cb) -> cb(err, el)
 * timeout and pollFreq are optional (default 1000ms/200ms)
 * waitForElement(using, value, opts, cb) -> cb(err, el)
 * opts with the following fields: timeout, pollFreq, asserter.
 * asserter like: function(element , cb) -> cb(err, satisfied, el)
 */
commands.waitForElement = function(){

  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var using = fargs.all[0],
      value = fargs.all[1];
  var opts;

  // retrieving options
  if(typeof fargs.all[2] === 'object' && !(fargs.all[2] instanceof Asserter)){
    opts = fargs.all[2];
  } else if(fargs.all[2] instanceof Asserter) {
    opts = {
      asserter: fargs.all[2],
      timeout: fargs.all[3],
      pollFreq: fargs.all[4]
    };
  } else {
    opts = {
      timeout: fargs.all[2],
      pollFreq: fargs.all[3]
    };
  }

  // default
  opts.asserter = opts.asserter || new Asserter(function(el, cb) { cb(null, true); });

  var unpromisedAsserter = new Asserter(
    function(el, cb) {
      var promise = opts.asserter.assert(el, cb);
      if(promise && promise.then && typeof promise.then === 'function'){
        promise.then(
          function() { cb(null, true); },
          function(err) {
            if(err.retriable) { cb(null, false); }
            else { throw err; }
          }
        );
      }
    }
  );

  var wrappedAsserter = new Asserter(
    function(browser, cb){
      browser.elements(using, value, function(err, els){
        if(err) { return cb(err); }
        var seq = [];
        var satisfiedEl;
        _(els).each(function(el) {
          seq.push(function(cb) {
            if(satisfiedEl) { return cb(); }
            unpromisedAsserter.assert(el, function(err, satisfied) {
              if(err) { return cb(err); }
              if(satisfied) { satisfiedEl = el; }
              cb(err);
            });
          });
        }).value();
        async.series(seq, function(err) {
            if(err) { return cb(err); }
            cb(err, !_.isUndefined(satisfiedEl)  , satisfiedEl);
        });
      });
    }
  );

  commands.waitFor.apply(this,[
    {
      asserter: wrappedAsserter,
      timeout: opts.timeout,
      pollFreq: opts.pollFreq
    }, function(err, value) {
      if(err && err.message && err.message.match(/Condition/)) {
        cb(new Error("Element condition wasn't satisfied!"));
      } else {
        cb(err, value);
      }
    }]);
};

/**
 * waitForElements(using, value, asserter, timeout, pollFreq, cb) -> cb(err, els)
 * waitForElements(using, value, timeout, pollFreq, cb) -> cb(err, els)
 * timeout and pollFreq are optional (default 1000ms/200ms)
 * waitForElements(using, value, opts, cb) -> cb(err, els)
 * opts with the following fields: timeout, pollFreq, asserter.
 * asserter like: function(element , cb) -> cb(err, satisfied, el)
 */
commands.waitForElements = function(){

  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var using = fargs.all[0],
      value = fargs.all[1];
  var opts;

  // retrieving options
  if(typeof fargs.all[2] === 'object' && !(fargs.all[2] instanceof Asserter)){
    opts = fargs.all[2];
  } else if(fargs.all[2] instanceof Asserter) {
    opts = {
      asserter: fargs.all[2],
      timeout: fargs.all[3],
      pollFreq: fargs.all[4]
    };
  } else {
    opts = {
      timeout: fargs.all[2],
      pollFreq: fargs.all[3]
    };
  }

  // default
  opts.asserter = opts.asserter || new Asserter(function(el, cb) { cb(null, true); });

  var unpromisedAsserter = new Asserter(
    function(el, cb) {
      var promise = opts.asserter.assert(el, cb);
      if(promise && promise.then && typeof promise.then === 'function'){
        promise.then(
          function() { cb(null, true); },
          function(err) {
            if(err.retriable) { cb(null, false); }
            else { throw err; }
          }
        );
      }
    }
  );

  var wrappedAsserter = new Asserter(
    function(browser, cb){
      browser.elements(using, value, function(err, els){
        if(err) { return cb(err); }
        var seq = [];
        var satisfiedEls = [];
        _(els).each(function(el) {
          seq.push(function(cb) {
            unpromisedAsserter.assert(el, function(err, satisfied) {
              if(err) { return cb(err); }
              if(satisfied) { satisfiedEls.push(el); }
              cb(err);
            });
          });
        }).value();
        async.series(seq, function(err) {
            if(err) { return cb(err); }
            cb(err, satisfiedEls.length > 0  , satisfiedEls);
        });
      });
    }
  );

  commands.waitFor.apply(this,[
    {
      asserter: wrappedAsserter,
      timeout: opts.timeout,
      pollFreq: opts.pollFreq
    }, function(err, value) {
      if(err && err.message && err.message.match(/Condition/)) {
        cb(new Error("Element condition wasn't satisfied!"));
      } else {
        cb(err, value);
      }
    }]);
};

commands.waitForVisible = function(using, value, timeout, pollFreq) {
  deprecator.warn('waitForVisible',
    'waitForVisible has been deprecated, use waitForElement + isVisible asserter instead.');

  var cb = findCallback(arguments);

  commands.waitForElement.apply(this, [using, value, asserters.isVisible, timeout, pollFreq, function(err, isVisible) {
    if(err && err.message && err.message.match(/Element condition wasn't satisfied!/)){
      cb(new Error("Element didn't become visible"));
    } else {
      cb(err, isVisible);
    }
  }]);
};

/**
 * takeScreenshot(cb) -> cb(err, screenshot)
 *
 * @jsonWire GET /session/:sessionId/screenshot
 */
commands.takeScreenshot = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/screenshot'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * saveScreenshot(path, cb) -> cb(err, filePath)
 *
 * path maybe a full file path, a directory path (finishing with /),
 * the screenshot name, or left blank (will create a file in the system temp dir).
 */
commands.saveScreenshot = function() {
  var _this = this;
  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var _path = fargs.all[0];

  function buildFilePath(_path, cb) {
    if(!_path) { _path = tmp.tmpdir + '/'; }
    if(_path.match(/.*\/$/)) {
      tmp.tmpName( {template: 'screenshot-XXXXXX.png'}, function(err, fileName) {
        if(err) { return cb(err); }
        cb(null, path.join( _path , fileName) );
      });
    } else {
      if(path.extname(_path) === '') { _path = _path + '.png'; }
      cb(null, _path);
    }
  }

  buildFilePath(_path, function(err, filePath) {
    commands.takeScreenshot.apply(_this, [function(err, base64Data) {
      if(err) { return cb(err); }
      require("fs").writeFile(filePath, base64Data, 'base64', function(err) {
        if(err) { return cb(err); }
        cb(null, filePath);
      });
    }]);
  });
};

// adding all elementBy... , elementsBy... function

var addMethodsForSuffix = function(type, singular, plural) {
  if(singular){
    /**
     * elementByClassName(value, cb) -> cb(err, element)
     * elementByCssSelector(value, cb) -> cb(err, element)
     * elementById(value, cb) -> cb(err, element)
     * elementByName(value, cb) -> cb(err, element)
     * elementByLinkText(value, cb) -> cb(err, element)
     * elementByPartialLinkText(value, cb) -> cb(err, element)
     * elementByTagName(value, cb) -> cb(err, element)
     * elementByXPath(value, cb) -> cb(err, element)
     * elementByCss(value, cb) -> cb(err, element)
     * elementByIosUIAutomation(value, cb) -> cb(err, element)
     * elementByAndroidUIAutomator(value, cb) -> cb(err, element)
     * elementByAccessibilityId(value, cb) -> cb(err, element)
     *
     * @jsonWire POST /session/:sessionId/element
     */
    commands['element' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.element.apply(this, args);
    };

    /**
     * elementByClassNameOrNull(value, cb) -> cb(err, element)
     * elementByCssSelectorOrNull(value, cb) -> cb(err, element)
     * elementByIdOrNull(value, cb) -> cb(err, element)
     * elementByNameOrNull(value, cb) -> cb(err, element)
     * elementByLinkTextOrNull(value, cb) -> cb(err, element)
     * elementByPartialLinkTextOrNull(value, cb) -> cb(err, element)
     * elementByTagNameOrNull(value, cb) -> cb(err, element)
     * elementByXPathOrNull(value, cb) -> cb(err, element)
     * elementByCssOrNull(value, cb) -> cb(err, element)
     * elementByIosUIAutomationOrNull(value, cb) -> cb(err, element)
     * elementByAndroidUIAutomatorOrNull(value, cb) -> cb(err, element)
     * elementByAccessibilityIdOrNull(value, cb) -> cb(err, element)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 4
     */
    commands['element' + utils.elFuncSuffix(type)+ 'OrNull'] = function() {
      var fargs = utils.varargs(arguments);
      var cb = fargs.callback;
      var args = fargs.all;
      args.unshift(utils.elFuncFullType(type));
      args.push(
        function(err, elements) {
          if(!err) {
            if(elements.length>0) {cb(null,elements[0]);} else {cb(null,null);}
          } else {
            cb(err);
          }
        }
      );
      commands.elements.apply(this, args );
    };

    /**
     * elementByClassNameIfExists(value, cb) -> cb(err, element)
     * elementByCssSelectorIfExists(value, cb) -> cb(err, element)
     * elementByIdIfExists(value, cb) -> cb(err, element)
     * elementByNameIfExists(value, cb) -> cb(err, element)
     * elementByLinkTextIfExists(value, cb) -> cb(err, element)
     * elementByPartialLinkTextIfExists(value, cb) -> cb(err, element)
     * elementByTagNameIfExists(value, cb) -> cb(err, element)
     * elementByXPathIfExists(value, cb) -> cb(err, element)
     * elementByCssIfExists(value, cb) -> cb(err, element)
     * elementByIosUIAutomationIfExists(value, cb) -> cb(err, element)
     * elementByAndroidUIAutomatorIfExists(value, cb) -> cb(err, element)
     * elementByAccessibilityIdIfExists(value, cb) -> cb(err, element)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 6
     */
    commands['element' + utils.elFuncSuffix(type)+ 'IfExists'] = function() {
      var fargs = utils.varargs(arguments);
      var cb = fargs.callback;
      var args = fargs.all;
      args.unshift(utils.elFuncFullType(type));
      args.push(
        function(err, elements) {
          if(!err) {
            if(elements.length>0) {cb(null,elements[0]);} else {cb(null);}
          } else {
            cb(err); }
        }
      );
      commands.elements.apply(this, args);
    };

    /**
     * hasElementByClassName(value, cb) -> cb(err, boolean)
     * hasElementByCssSelector(value, cb) -> cb(err, boolean)
     * hasElementById(value, cb) -> cb(err, boolean)
     * hasElementByName(value, cb) -> cb(err, boolean)
     * hasElementByLinkText(value, cb) -> cb(err, boolean)
     * hasElementByPartialLinkText(value, cb) -> cb(err, boolean)
     * hasElementByTagName(value, cb) -> cb(err, boolean)
     * hasElementByXPath(value, cb) -> cb(err, boolean)
     * hasElementByCss(value, cb) -> cb(err, boolean)
     * hasElementByIosUIAutomation(value, cb) -> cb(err, boolean)
     * hasElementByAndroidUIAutomator(value, cb) -> cb(err, boolean)
     * hasElementByAccessibilityId(value, cb) -> cb(err, boolean)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 8
     */
    commands['hasElement' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.hasElement.apply(this, args);
    };

    /**
     * waitForElementByClassName(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByCssSelector(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementById(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByName(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByLinkText(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByPartialLinkText(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByTagName(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByXPath(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByCss(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByIosUIAutomation(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByAndroidUIAutomator(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementByAccessibilityId(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * asserter, timeout, pollFreq are optional, opts may be passed instead,
     * as in waitForElement.
     */
    commands['waitForElement' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.waitForElement.apply(this, args);
    };

    /**
     * waitForElementsByClassName(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByCssSelector(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsById(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByName(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByLinkText(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByPartialLinkText(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByTagName(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByXPath(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByCss(value, asserter, timeout, pollFreq, cb) -> cb(err, els)
     * waitForElementsByIosUIAutomation(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementsByAndroidUIAutomator(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * waitForElementsByAccessibilityId(value, asserter, timeout, pollFreq, cb) -> cb(err, el)
     * asserter, timeout, pollFreq are optional, opts may be passed instead,
     * as in waitForElements.
     */
    commands['waitForElements' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.waitForElements.apply(this, args);
    };

    commands['waitForVisible' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.waitForVisible.apply(this, args);
    };

    /**
     * elementsByClassName(value, cb) -> cb(err, elements)
     * elementsByCssSelector(value, cb) -> cb(err, elements)
     * elementsById(value, cb) -> cb(err, elements)
     * elementsByName(value, cb) -> cb(err, elements)
     * elementsByLinkText(value, cb) -> cb(err, elements)
     * elementsByPartialLinkText(value, cb) -> cb(err, elements)
     * elementsByTagName(value, cb) -> cb(err, elements)
     * elementsByXPath(value, cb) -> cb(err, elements)
     * elementsByCss(value, cb) -> cb(err, elements)
     * elementsByIosUIAutomation(value, cb) -> cb(err, elements)
     * elementsByAndroidUIAutomator(value, cb) -> cb(err, elements)
     * elementsByAccessibilityId(value, cb) -> cb(err, elements)
     *
     * @jsonWire POST /session/:sessionId/elements
     * @docOrder 2
     */
  }
  if(plural){
    commands['elements' + utils.elFuncSuffix(type)] = function() {
      var args = __slice.call(arguments, 0);
      args.unshift(utils.elFuncFullType(type));
      commands.elements.apply(this, args);
    };
  }
};

_.each(utils.elementFuncTypes, function(suffix) {
  addMethodsForSuffix(suffix, true, true);
});

/**
 * getTagName(element, cb) -> cb(err, name)
 *
 * @jsonWire GET /session/:sessionId/element/:id/name
 */
commands.getTagName = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/name'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getAttribute(element, attrName, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 1
 */
commands.getAttribute = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0],
      attrName = fargs.all[1];
  if(!element) { throw new Error('Missing element.'); }
  if(!attrName) { throw new Error('Missing attribute name.'); }
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/attribute/' + attrName
    , cb: callbackWithData(cb, this)
  });
};

/**
 * isDisplayed(element, cb) -> cb(err, displayed)
 *
 * @jsonWire GET /session/:sessionId/element/:id/displayed
 */
commands.isDisplayed = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/displayed'
    , cb: callbackWithData(cb, this)
  });
};

commands.displayed = commands.isDisplayed;

/**
  * isEnabled(element, cb) -> cb(err, enabled)
  *
  * @jsonWire GET /session/:sessionId/element/:id/enabled
  */
commands.isEnabled = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/enabled'
    , cb: callbackWithData(cb, this)
  });
};

commands.enabled = commands.isEnabled;

/**
 * isSelected(element, cb) -> cb(err, selected)
 *
 * @jsonWire GET /session/:sessionId/element/:id/selected
 */
commands.isSelected = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/selected'
    , cb: callbackWithData(cb, this)
  });
};

// commands.selected = commands.isSelected;

/**
 * Get element value (in value attribute):
 * getValue(element, cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/attribute/:name
 * @docOrder 3
 */
commands.getValue = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0];
  if(!element) { throw new Error('Missing element.'); }
  commands.getAttribute.apply(this, [element, 'value', cb]);
};

/**
 * clickElement(element, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/click
 */
commands.clickElement = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/click'
    , cb: simpleCallback(cb)
  });
};

/**
 * getComputedCss(element, cssProperty , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/css/:propertyName
 */
commands.getComputedCss = function(element, cssProperty) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/css/' + cssProperty
    , cb: callbackWithData(cb, this)
  });
};

commands.getComputedCSS = commands.getComputedCss;

/**
 * equalsElement(element, other , cb) -> cb(err, value)
 *
 * @jsonWire GET /session/:sessionId/element/:id/equals/:other
 */
commands.equalsElement = function(element, other) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/equals/' + other
    , cb: callbackWithData(cb, this)
  });
};

var _flick1 = function(){
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      xspeed = fargs.all[0],
      yspeed = fargs.all[1],
      swipe = fargs.all[2];

  var data = { xspeed: xspeed, yspeed: yspeed };
  if (swipe) {
    data.swipe = swipe;
  }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/touch/flick'
    , data: data
    , cb: simpleCallback(cb)
  });
};

var _flick2 = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0],
      xoffset = fargs.all[1],
      yoffset = fargs.all[2],
      speed = fargs.all[3];

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/touch/flick'
    , data: { element: element, xoffset: xoffset, yoffset: yoffset, speed: speed }
    , cb: simpleCallback(cb)
  });
};

/**
 * flick(xSpeed, ySpeed, swipe, cb) -> cb(err)
 * Flicks, starting anywhere on the screen.
 *
 * flick(element, xoffset, yoffset, speed, cb) -> cb(err)
 * Flicks, starting at element center.
 *
 * @jsonWire POST /session/:sessionId/touch/flick
 */
commands.flick = function() {
  var args = __slice.call(arguments, 0);
  if (args.length <= 4) {
    _flick1.apply(this, args);
  } else {
    _flick2.apply(this, args);
  }
};

/**
 * tapElement(element) -> cb(err)
 * Taps element
 *
 * @jsonWire POST /session/:sessionId/touch/click
 */
commands.tapElement = function(element, cb) {
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/touch/click'
    , data: { element: element.value.toString() }
    , cb: simpleCallback(cb)
  });
};

/**
 * performTouchAction(touchAction) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/touch/perform
 */
commands.performTouchAction = function () {
  var _this = this;
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      touchAction = fargs.all[0];

  try {
    _this._jsonWireCall({
      method: 'POST',
      relPath: '/touch/perform',
      data: touchAction.toJSON(),
      cb: callbackWithData(cb, this)
    });
  } catch (err) {
    return cb(err);
  }
};

/**
 * performMultiAction(element, multiAction) -> cb(err, touchStateObjects)
 * performMultiAction(multiAction) -> cb(err, touchStateObjects)
 *
 * @jsonWire POST /session/:sessionId/touch/multi/perform
 */
commands.performMultiAction = function () {
  var _this = this;
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0],
      multiTouchAction = fargs.all[1];
  if(!multiTouchAction) {
    multiTouchAction = element;
    element = null;
  }
  element =  element || multiTouchAction.element;
  try {
    var data = multiTouchAction.toJSON(element);
    if(element) { data.elementId = element.value.toString(); }
    _this._jsonWireCall({
      method: 'POST',
      relPath: '/touch/multi/perform',
      data: data,
      cb: callbackWithData(cb, this)
    });
  } catch (err) {
    return cb(err);
  }
};

/**
 * moveTo(element, xoffset, yoffset, cb) -> cb(err)
 * Move to element, element may be null, xoffset and y offset
 * are optional.
 *
 * @jsonWire POST /session/:sessionId/moveto
 */
commands.moveTo = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0],
      xoffset = fargs.all[1],
      yoffset = fargs.all[2];

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/moveto'
    , data: { element:
      element? element.toString(): null,
      xoffset: xoffset,
      yoffset: yoffset }
    , cb: simpleCallback(cb)
  });
};

/**
 * buttonDown(button ,cb) -> cb(err)
 * button is optional.
 * {LEFT = 0, MIDDLE = 1 , RIGHT = 2}.
 * LEFT if not specified.
 *
 * @jsonWire POST /session/:sessionId/buttondown
 */
commands.buttonDown = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      button = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/buttondown'
    , data: {button: button}
    , cb: simpleCallback(cb)
  });
};

/**
 * buttonUp(button, cb) -> cb(err)
 * button is optional.
 * {LEFT = 0, MIDDLE = 1 , RIGHT = 2}.
 * LEFT if not specified.
 *
 * @jsonWire POST /session/:sessionId/buttonup
 */
commands.buttonUp = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      button = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/buttonup'
    , data: {button: button}
    , cb: simpleCallback(cb)
  });
};

/**
 * click(button, cb) -> cb(err)
 * Click on current element.
 * Buttons: {left: 0, middle: 1 , right: 2}
 *
 * @jsonWire POST /session/:sessionId/click
 */
commands.click = function() {
  // parsing args, button optional
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      button = fargs.all[0];

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/click'
    , data: {button: button}
    , cb: simpleCallback(cb)
  });
};

/**
 * doubleclick(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/doubleclick
 */
commands.doubleclick = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/doubleclick'
    , cb: simpleCallback(cb)
  });
};

/**
 * type(element, keys, cb) -> cb(err)
 * Type keys (all keys are up at the end of command).
 * special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)
 *
 * @jsonWire POST /session/:sessionId/element/:id/value
 */
commands.type = function(element, keys) {
  var cb = findCallback(arguments);
  if (!(keys instanceof Array)) {keys = [keys];}
  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== "string") {
      keys[idx] = key.toString();
    }
  });
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/value'
    , data: {value: keys}
    , cb: simpleCallback(cb)
  });
};

commands.replace = function(element, keys) {
  var cb = findCallback(arguments);
  if (!(keys instanceof Array)) {keys = [keys];}
  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== "string") {
      keys[idx] = key.toString();
    }
  });
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/element/' + element + '/replace_value'
    , data: {value: keys}
    , cb: simpleCallback(cb)
  });
};

/**
 * submit(element, cb) -> cb(err)
 * Submit a `FORM` element.
 *
 * @jsonWire POST /session/:sessionId/element/:id/submit
 */
commands.submit = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/submit'
    , cb: simpleCallback(cb)
  });
};

/**
 * keys(keys, cb) -> cb(err)
 * Press keys (keys may still be down at the end of command).
 * special key map: wd.SPECIAL_KEYS (see lib/special-keys.js)
 *
 * @jsonWire POST /session/:sessionId/keys
 */
commands.keys = function(keys) {
  var cb = findCallback(arguments);
  if (!(keys instanceof Array)) {keys = [keys];}
  // ensure all keystrokes are strings to conform to JSONWP
  _.each(keys, function(key, idx) {
    if (typeof key !== "string") {
      keys[idx] = key.toString();
    }
  });
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/keys'
    , data: {value: keys}
    , cb: simpleCallback(cb)
  });
};

/**
 * clear(element, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/element/:id/clear
 */
commands.clear = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/' + element + '/clear'
    , cb: simpleCallback(cb)
  });
};

/**
 * title(cb) -> cb(err, title)
 *
 * @jsonWire GET /session/:sessionId/title
 */
commands.title = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/title'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * source(cb) -> cb(err, source)
 *
 * @jsonWire GET /session/:sessionId/source
 */
commands.source = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
		method: 'GET'
		, relPath: '/source'
		, cb: callbackWithData(cb, this)
	});
};

// element must be specified
var _rawText = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/text'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * text(element, cb) -> cb(err, text)
 * element: specific element, 'body', or undefined
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 1
 */
commands.text = function() {
  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var element = fargs.all[0];
  var _this = this;
  if (!element || element === 'body') {
    commands.element.apply(this, ['tag name', 'body', function(err, bodyEl) {
      if (!err) {_rawText.apply(_this, [bodyEl, cb]);} else {cb(err);}
    }]);
  }else {
    _rawText.apply(_this, [element, cb]);
  }
};

/**
 * Check if text is present:
 * textPresent(searchText, element, cb) -> cb(err, boolean)
 * element: specific element, 'body', or undefined
 *
 * @jsonWire GET /session/:sessionId/element/:id/text
 * @docOrder 3
 */
commands.textPresent = function(searchText, element) {
  var cb = findCallback(arguments);
  commands.text.apply(this, [element, function(err, text) {
    if (err) {
      cb(err, null);
    } else {
      cb(err, text.indexOf(searchText) >= 0);
    }
  }]);
};

/**
 * alertText(cb) -> cb(err, text)
 *
 * @jsonWire GET /session/:sessionId/alert_text
 */
commands.alertText = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/alert_text'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * alertKeys(keys, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/alert_text
 */
commands.alertKeys = function(keys) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/alert_text'
    , data: {text: keys}
    , cb: simpleCallback(cb)
  });
};

/**
 * acceptAlert(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/accept_alert
 */
commands.acceptAlert = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/accept_alert'
    , cb: simpleCallback(cb)
  });
};

/**
 * dismissAlert(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/dismiss_alert
 */
commands.dismissAlert = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/dismiss_alert'
    , cb: simpleCallback(cb)
  });
};

/**
 * active(cb) -> cb(err, element)
 *
 * @jsonWire POST /session/:sessionId/element/active
 */
commands.active = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/element/active'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * url(cb) -> cb(err, url)
 *
 * @jsonWire GET /session/:sessionId/url
 */
commands.url = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/url'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * allCookies() -> cb(err, cookies)
 *
 * @jsonWire GET /session/:sessionId/cookie
 */
commands.allCookies = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/cookie'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * setCookie(cookie, cb) -> cb(err)
 * cookie example:
 *  {name:'fruit', value:'apple'}
 * Optional cookie fields:
 *  path, domain, secure, expiry
 *
 * @jsonWire POST /session/:sessionId/cookie
 */
commands.setCookie = function(cookie) {
  var cb = findCallback(arguments);
  // setting secure otherwise selenium server throws
  if(cookie){ cookie.secure = cookie.secure || false; }

  this._jsonWireCall({
    method: 'POST'
    , relPath: '/cookie'
    , data: { cookie: cookie }
    , cb: simpleCallback(cb)
  });
};

/**
 * deleteAllCookies(cb) -> cb(err)
 *
 * @jsonWire DELETE /session/:sessionId/cookie
 */
commands.deleteAllCookies = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/cookie'
    , cb: simpleCallback(cb)
  });
};

/**
 * deleteCookie(name, cb) -> cb(err)
 *
 * @jsonWire DELETE /session/:sessionId/cookie/:name
 */
commands.deleteCookie = function(name) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'DELETE'
    , relPath: '/cookie/' + encodeURIComponent(name)
    , cb: simpleCallback(cb)
  });
};

/**
 * getOrientation(cb) -> cb(err, orientation)
 *
 * @jsonWire GET /session/:sessionId/orientation
 */
commands.getOrientation = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/orientation'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * setOrientation(cb) -> cb(err, orientation)
 *
 * @jsonWire POST /session/:sessionId/orientation
 */
commands.setOrientation = function(orientation) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/orientation'
    , data: { orientation: orientation }
    , cb: simpleCallback(cb)
  });
};

/**
 * setLocalStorageKey(key, value, cb) -> cb(err)
 *
 * # uses safeExecute() due to localStorage bug in Selenium
 *
 * @jsonWire POST /session/:sessionId/local_storage
 */
commands.setLocalStorageKey = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      key = fargs.all[0],
      value = fargs.all[1];

  commands.safeExecute.apply(
    this,
    ["localStorage.setItem(arguments[0], arguments[1])", [key, value], cb]
  );
};

/**
 * getLocalStorageKey(key, cb) -> cb(err)
 *
 * # uses safeEval() due to localStorage bug in Selenium
 *
 * @jsonWire GET /session/:sessionId/local_storage/key/:key
 */
commands.getLocalStorageKey = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      key = fargs.all[0];

  commands.safeEval.apply(
    this,
    ["localStorage.getItem('" + key + "')", cb]
  );
};

/**
 * removeLocalStorageKey(key, cb) -> cb(err)
 *
 * # uses safeExecute() due to localStorage bug in Selenium
 *
 * @jsonWire DELETE /session/:sessionId/local_storage/key/:key
 */
commands.removeLocalStorageKey = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      key = fargs.all[0];

  commands.safeExecute.apply(
    this,
    ["localStorage.removeItem(arguments[0])", [key], cb]
  );
};

/**
 * clearLocalStorage(cb) -> cb(err)
 *
 * # uses safeExecute() due to localStorage bug in Selenium
 *
 * @jsonWire DELETE /session/:sessionId/local_storage
 */
commands.clearLocalStorage = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;

  commands.safeExecute.apply(
    this,
    ["localStorage.clear()", cb]
  );
};

// deprecated
var _isVisible1 = function(element){
  var cb = findCallback(arguments);
  commands.getComputedCSS.apply(this, [element, "display", function(err, display){
    if(err){
      return cb(err);
    }

    cb(null, display !== "none");
  }]);
};

// deprecated
var _isVisible2 = function(queryType, querySelector){
  var cb = findCallback(arguments);
  commands.elementIfExists.apply(this, [queryType, querySelector, function(err, element){
    if(err){
      return cb(err);
    }

    if(element){
      element.isVisible(cb);
    } else {
      cb(null, false); }
  }]);
};

// deprecated
commands.isVisible = function() {
  deprecator.warn('isVisible', 'isVisible has been deprecated, use isDisplayed instead.');

  var args = __slice.call(arguments, 0);
  if (args.length <= 2) {
    _isVisible1.apply(this, args);
  } else {
    _isVisible2.apply(this, args);
  }
};

/**
 * Retrieves the pageIndex element (added for Appium):
 * getPageIndex(element, cb) -> cb(err, pageIndex)
 */
commands.getPageIndex = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/pageIndex'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getLocation(element, cb) -> cb(err, location)
 *
 * @jsonWire GET /session/:sessionId/element/:id/location
 */
commands.getLocation = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/location'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getLocationInView(element, cb) -> cb(err, location)
 *
 * @jsonWire GET /session/:sessionId/element/:id/location_in_view
 */
commands.getLocationInView = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/location_in_view'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getSize(element, cb) -> cb(err, size)
 *
 * @jsonWire GET /session/:sessionId/element/:id/size
 */
commands.getSize = function(element) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/element/' + element + '/size'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * Uploads a local file using undocumented
 * POST /session/:sessionId/file
 * uploadFile(filepath, cb) -> cb(err, filepath)
 */
commands.uploadFile = function(filepath) {
  var cb = findCallback(arguments);
  var _this = this;
  var archiver = require('archiver');

  var archive = archiver('zip');
  var dataList = [];

  archive
  .on('error', function(err) {
    cb(err);
  })
  .on('data', function(data) {
    dataList.push(data);
  })
  .on('end', function() {
    _this._jsonWireCall({
    method: 'POST'
      , relPath: '/file'
      , data: { file: Buffer.concat(dataList).toString('base64') },
      cb: callbackWithData(cb, _this)
    });
  });

  archive
  .append(
    fs.createReadStream(filepath),
    { name: path.basename(filepath) }
  );

  archive.finalize(function(err) {
    if (err) {
      cb(err);
    }
  });
};

commands.waitForJsCondition = function(){
  deprecator.warn('waitForJsCondition',
    'waitForJsCondition has been deprecated, use waitFor + jsCondition asserter instead.');

  var cb = findCallback(arguments);
  var fargs = utils.varargs(arguments);
  var jsConditionExpr = fargs.all[0],
      timeout = fargs.all[1],
      pollFreq = fargs.all[2];
  commands.waitFor.apply(this, [
    {
      asserter: asserters.jsCondition(jsConditionExpr, true),
      timeout: timeout,
      pollFreq: pollFreq
    }, function(err, value) {
      if(err && err.message && err.message.match(/Condition/)) {
        cb(new Error("Element condition wasn't satisfied!"));
      } else {
        cb(err, value);
      }
    }]);
};
commands.waitForCondition = commands.waitForJsCondition;

// script to be executed in browser
var _waitForConditionInBrowserJsScript =
  utils.inlineJs(fs.readFileSync( __dirname + "/../browser-scripts/wait-for-cond-in-browser.js", 'utf8'));

/**
 * Waits for JavaScript condition to be true (async script polling within browser):
 * waitForConditionInBrowser(conditionExpr, timeout, pollFreq, cb) -> cb(err, boolean)
 * conditionExpr: condition expression, should return a boolean
 * timeout and  pollFreq are optional, default: 1000/100.
 * return true if condition satisfied, error otherwise.
 */
commands.waitForConditionInBrowser = function() {
  var _this = this;
  // parsing args
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      conditionExpr = fargs.all[0],
      timeout = fargs.all[1] || 1000,
      poll = fargs.all[2] || 100;

  // calling script
  commands.safeExecuteAsync.apply( _this, [_waitForConditionInBrowserJsScript,
    [conditionExpr,timeout,poll], function(err,res) {
      if(err) {return cb(err);}
      if(res !== true) {return cb("waitForConditionInBrowser failure for: " + conditionExpr);}
      cb(null, res);
    }
  ]);
};

/**
 * sauceJobUpdate(jsonData, cb) -> cb(err)
 */
commands.sauceJobUpdate = function() {
  var fargs = utils.varargs(arguments);
  this._sauceJobUpdate.apply(this, fargs.array);
};

/**
 * sauceJobStatus(hasPassed, cb) -> cb(err)
 */
commands.sauceJobStatus = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      hasPassed = fargs.all[0];
  this._sauceJobUpdate.apply(this, [{passed: hasPassed}, cb]);
};

/**
 * sleep(ms, cb) -> cb(err)
 */
commands.sleep = function(ms, cb) {
  cb = cb || function() {};
  setTimeout(cb , ms);
};

/**
 * noop(cb) -> cb(err)
 */
commands.noop = function(cb) {
  if(cb) { cb(); }
};

/**
 * shakeDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/shake
 */
commands.shakeDevice = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/shake'
    , cb: simpleCallback(cb)
  });
};
/**
 * shake(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/shake
 */
commands.shake = commands.shakeDevice;

/**
 * lockDevice(seconds, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/lock
 */
commands.lockDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
           seconds = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/lock'
    , data: {seconds: seconds}
    , cb: simpleCallback(cb)
  });
};
/**
 * lock(seconds, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/lock
 */
commands.lock = commands.lockDevice;

/**
 * unlockDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/lock
 */
commands.unlockDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/unlock'
    , cb: simpleCallback(cb)
  });
};
/**
 * unlock(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/lock
 */
commands.unlock = commands.unlockDevice;

/**
 * isLocked(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/is_locked
 */
commands.isLocked = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/is_locked'
    , cb: callbackWithData(cb)
  });
};

/**
 * deviceKeyEvent(keycode, metastate, cb) -> cb(err)
 * metastate is optional
 *
 * @jsonWire POST /session/:sessionId/appium/device/keyevent
 */
commands.deviceKeyEvent = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      keycode = fargs.all[0],
      metastate = fargs.all[1];
  var data = {keycode: keycode};
  if(metastate) { data.metastate = metastate; }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/keyevent'
    , data: data
    , cb: simpleCallback(cb)
  });
};
/**
 * pressDeviceKey(keycode, metastate, cb) -> cb(err)
 * metastate is optional
 *
 * @jsonWire POST /session/:sessionId/appium/device/keyevent
 */
commands.pressDeviceKey = commands.deviceKeyEvent;

/**
 * rotateDevice(element, opts, cb) -> cb(err)
 * rotateDevice(opts, cb) -> cb(err)
 * opts is like the following:
 * {x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}
 *
 * @jsonWire POST /session/:sessionId/appium/device/rotate
 */
commands.rotateDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      element = fargs.all[0],
      opts = fargs.all[1];
  if(!(element && element.value)) {
    opts = element;
    element = null;
  }
  var data = _.clone(opts);
  if(element) { data.element = element.value.toString(); }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/rotate'
    , data: data
    , cb: simpleCallback(cb)
  });
};
/**
 * rotate(element, opts, cb) -> cb(err)
 * rotate(opts, cb) -> cb(err)
 * opts is like the following:
 * {x: 114, y: 198, duration: 5, radius: 3, rotation: 220, touchCount: 2}
 *
 * @jsonWire POST /session/:sessionId/appium/device/rotate
 */
commands.rotate = commands.rotateDevice;

/**
 * getCurrentDeviceActivity(cb) -> cb(err)
 *
 * @jsonWire GET /session/:sessionId/appium/device/current_activity
 */
commands.getCurrentDeviceActivity = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/appium/device/current_activity'
    , cb: callbackWithData(cb, this)
  });
};
/**
 * getCurrentActivity(cb) -> cb(err)
 *
 * @jsonWire GET /session/:sessionId/appium/device/current_activity
 */
commands.getCurrentActivity = commands.getCurrentDeviceActivity;

/**
 * installAppOnDevice(appPath, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/install_app
 */
commands.installAppOnDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      appPath = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/install_app'
    , data: { appPath: appPath}
    , cb: simpleCallback(cb)
  });
};
/**
 * installApp(appPath, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/install_app
 */
commands.installApp = commands.installAppOnDevice;

/**
 * removeAppFromDevice(appId, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/remove_app
 */
commands.removeAppFromDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      appId = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/remove_app'
    , data: { appId: appId}
    , cb: simpleCallback(cb)
  });
};
/**
 * removeApp(appId, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/remove_app
 */
commands.removeApp = commands.removeAppFromDevice;

/**
 * isAppInstalledOnDevice(bundleId, cb) -> cb(isInstalled, err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/app_installed
 */
commands.isAppInstalledOnDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      bundleId = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/app_installed'
    , data: {bundleId: bundleId}
    , cb: callbackWithData(cb, this)
  });
};
/**
 * isAppInstalled(bundleId, cb) -> cb(isInstalled, err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/app_installed
 */
commands.isAppInstalled = commands.isAppInstalledOnDevice;

/**
 * hideKeyboard() -> cb(err)
 * hideKeyboard(keyName, cb) -> cb(err)
 * hideKeyboard({strategy: 'pressKey', key:'<key>'}) -> cb(err)
 * hideKeyboard({strategy: 'tapOutside'}) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/hide_keyboard
 */
commands.hideDeviceKeyboard = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;
  var data = {};
  switch(typeof fargs.all[0]) {
    case 'string':
      data = {keyName: fargs.all[0]};
      break;
    case 'object':
      data = fargs.all[0];
      break;
    default:
      data= null; 
  }
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/hide_keyboard'
    , data: data
    , cb: simpleCallback(cb)
  });
};
commands.hideKeyboard = commands.hideDeviceKeyboard;

/**
 * pushFileToDevice(pathOnDevice, base64Data, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/push_file
 */
commands.pushFileToDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      pathOnDevice = fargs.all[0],
      base64Data = fargs.all[1];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/push_file'
    , data: {path: pathOnDevice, data: base64Data}
    , cb: simpleCallback(cb)
  });
};
/**
 * pushFile(pathOnDevice, base64Data, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/push_file
 */
commands.pushFile = commands.pushFileToDevice;


/**
 * pullFileFromDevice(pathOnDevice, cb) -> cb(base64EncodedData, err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/pull_file
 */
commands.pullFileFromDevice = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      pathOnDevice = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/pull_file'
    , data: {path: pathOnDevice}
    , cb: callbackWithData(cb, this)
  });
};
/**
 * pullFile(pathOnDevice, cb) -> cb(base64EncodedData, err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/pull_file
 */
commands.pullFile = commands.pullFileFromDevice;

/**
 * pullFolderFromDevice(pathOnDevice, cb) -> cb(base64EncodedData, err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/pull_folder
 */
 commands.pullFolderFromDevice = function() {
   var fargs = utils.varargs(arguments);
   var cb = fargs.callback,
       pathOnDevice = fargs.all[0];
   this._jsonWireCall({
     method: 'POST'
     , relPath: '/appium/device/pull_folder'
     , data: {path: pathOnDevice}
     , cb: callbackWithData(cb, this)
   });
 };

 /**
  * pullFolder(pathOnDevice, cb) -> cb(base64EncodedData, err)
  *
  * @jsonWire POST /session/:sessionId/appium/device/pull_folder
  */
commands.pullFolder = commands.pullFolderFromDevice;

/**
 * toggleAirplaneModeOnDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_airplane_mode
 */
commands.toggleAirplaneModeOnDevice = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/toggle_airplane_mode'
    , cb: simpleCallback(cb)
  });
};
/**
 * toggleAirplaneMode(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_airplane_mode
 */
commands.toggleAirplaneMode = commands.toggleAirplaneModeOnDevice;
/**
 * toggleFlightMode(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_airplane_mode
 */
commands.toggleFlightMode = commands.toggleAirplaneModeOnDevice;

/**
 * toggleWiFiOnDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_wifi
 */
commands.toggleWiFiOnDevice = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/toggle_wifi'
    , cb: simpleCallback(cb)
  });
};
/**
 * toggleWiFi(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_wifi
 */
commands.toggleWiFi = commands.toggleWiFiOnDevice;

/**
 * toggleLocationServicesOnDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_location_services
 */
commands.toggleLocationServicesOnDevice = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/toggle_location_services'
    , cb: simpleCallback(cb)
  });
};
/**
 * toggleLocationServices(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_location_services
 */
commands.toggleLocationServices = commands.toggleLocationServicesOnDevice;

/**
 * toggleDataOnDevice(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_data
 */
commands.toggleDataOnDevice = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/toggle_data'
    , cb: simpleCallback(cb)
  });
};
/**
 * toggleData(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/toggle_data
 */
commands.toggleData = commands.toggleDataOnDevice;

/**
 * launchApp(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/launch
 */
commands.launchApp = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/launch'
    , cb: simpleCallback(cb)
  });
};

/**
 * closeApp(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/close
 */
commands.closeApp = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/close'
    , cb: simpleCallback(cb)
  });
};


/**
 * resetApp(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/reset
 */
commands.resetApp = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/reset'
    , cb: simpleCallback(cb)
  });
};

/**
 * backgroundApp(seconds, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/background
 */
commands.backgroundApp = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      seconds = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/background'
    , data: {seconds: seconds}
    , cb: simpleCallback(cb)
  });
};

/**
 * endTestCoverageForApp(intentToBroadcast, pathOnDevice) -> cb(base64Data,err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/end_test_coverage
 */
commands.endTestCoverageForApp = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      intent = fargs.all[0],
      path = fargs.all[1];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/end_test_coverage'
    , data: {intent: intent, path: path}
    , cb: callbackWithData(cb, this)
  });
};
/**
 * endTestCoverage(intentToBroadcast, pathOnDevice) -> cb(base64Data,err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/end_test_coverage
 */
commands.endTestCoverage = commands.endTestCoverageForApp;
/**
 * endCoverage(intentToBroadcast, pathOnDevice) -> cb(base64Data,err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/end_test_coverage
 */
commands.endCoverage = commands.endTestCoverageForApp;

/**
 * complexFindInApp(selector) -> cb(element(s))
 * Return a single element or an elements array depending on
 * selector
 *
 * @jsonWire POST /session/:sessionId/appium/app/complex_find
 */
commands.complexFindInApp = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      selector = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/complex_find'
    , data: {selector: selector}
    , cb: elementOrElementsCallback(cb, this)
  });
};

/**
 * complexFind(selector) -> cb(element(s))
 * Return a single element or an elements array depending on
 * selector
 *
 * @jsonWire POST /session/:sessionId/appium/app/complex_find
 */
commands.complexFind = commands.complexFindInApp;

/**
 * getAppStrings(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/app/strings
 */
commands.getAppStrings = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      language = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/app/strings'
    , data: {language: language}
    , cb: callbackWithData(cb, this)
  });
};

/**
 * setImmediateValueInApp(element, value, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/element/:elementId?/value
 */
commands.setImmediateValueInApp = function(element, value) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/element/' + element.value.toString() + '/value'
    , data: {value: value}
    , cb: simpleCallback(cb)
  });
};

/**
 * startActivity(options, cb) -> cb(err)
 * Start an arbitrary Android activity during a session. The 'options' parameter should
 * implement the interface {appPackage, appActivity, [appWaitPackage], [appWaitActivity]}.
 *
 * @jsonWire POST /session/:sessionId/appium/device/start_activity
 */
commands.startActivity = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
    options = fargs.all[0];
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/start_activity'
    , data: options
    , cb: simpleCallback(cb)
  });
};

/**
 * setImmediateValue(element, value, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/element/:elementId?/value
 */
commands.setImmediateValue = commands.setImmediateValueInApp;

/**
 * setNetworkConnection(type, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/network_connection
 */
commands.setNetworkConnection = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/network_connection'
    , data: {parameters: {type: fargs.all[0]}}
    , cb: callbackWithData(cb, this)
  });
};

/**
 * getNetworkConnection(cb) -> cb(err, networkConnectionInfo)
 *
 * @jsonWire GET /session/:sessionId/network_connection
 */
commands.getNetworkConnection = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/network_connection'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * openNotifications(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/device/open_notifications
 */
commands.openNotifications = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/device/open_notifications'
    , cb: simpleCallback(cb, this)
  });
};

/**
 * settings(cb) -> cb(err, settingsObject)
 *
 * @jsonWire GET /session/:sessionId/appium/settings
 */
commands.settings = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/appium/settings'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * updateSettings(settingsObject, cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/appium/settings
 */
commands.updateSettings = function() {
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback;
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/appium/settings'
    , data: {settings: fargs.all[0]}
    , cb: simpleCallback(cb, this)
  });
};

/**
 * availableIMEEngines(cb) -> cb(err, engines)
 *
 * @jsonWire GET /session/:sessionId/ime/available_engines
 */
commands.availableIMEEngines = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/ime/available_engines'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * activateIMEEngine(cb, engine) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/ime/activate
 */
commands.activateIMEEngine = function(engine) {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/ime/activate'
    , data: { engine: engine }
    , cb: simpleCallback(cb, this)
  });
};

/**
 * deactivateIMEEngine(cb) -> cb(err)
 *
 * @jsonWire POST /session/:sessionId/ime/deactivate
 */
commands.deactivateIMEEngine = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'POST'
    , relPath: '/ime/deactivate'
    , cb: simpleCallback(cb, this)
  });
};

/**
 * activatedIMEEngine(cb) -> cb(err, active)
 *
 * @jsonWire GET /session/:sessionId/ime/activated
 */
commands.isIMEActive = function() {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/ime/activated'
    , cb: callbackWithData(cb, this)
  });
};

/**
 * activeIMEEngine(cb) -> cb(err, activeEngine)
 *
 * @jsonWire GET /session/:sessionId/ime/active_engine
 */
commands.activeIMEEngine = function () {
  var cb = findCallback(arguments);
  this._jsonWireCall({
    method: 'GET'
    , relPath: '/ime/active_engine'
    , cb: callbackWithData(cb, this)
  });
};

module.exports = commands;
