var EventEmitter = require('events').EventEmitter,
    _ = require("./lodash"),
    util = require( 'util' ),
    url = require('url'),
    __slice = Array.prototype.slice,
    utils = require("./utils"),
    findCallback = utils.findCallback,
    niceArgs = utils.niceArgs,
    niceResp = utils.niceResp,
    strip = utils.strip,
    deprecator = utils.deprecator,
    httpUtils = require('./http-utils'),
    config = require('./config'),
    Element = require('./element'),
    commands = require('./commands');

// Webdriver client main class
// configUrl: url object constructed via url.parse
var Webdriver = module.exports = function(configUrl) {
  EventEmitter.call( this );
  this.sessionID = null;
  this.configUrl = configUrl;
  this.sauceRestRoot = "https://saucelabs.com/rest/v1";
  // config url without auth
  this.noAuthConfigUrl = url.parse(url.format(this.configUrl));
  delete this.noAuthConfigUrl.auth;

  this.defaultCapabilities = {
    browserName: 'firefox'
     , version: ''
    , javascriptEnabled: true
    , platform: 'ANY'
  };

  this._httpConfig = _.clone(config.httpConfig);
};

//inherit from EventEmitter
util.inherits( Webdriver, EventEmitter );

// creates a new element
Webdriver.prototype.newElement = function(jsonWireElement) {
  return new Element(jsonWireElement, this);
};

/**
 * attach(sessionID, cb) -> cb(err)
 * Connect to an already-active session.
 */
Webdriver.prototype.attach = function(sessionID) {
  var cb = findCallback(arguments);
  this.sessionID = sessionID;
  if(cb) { cb(null); }
};

/**
 * detach(cb) -> cb(err)
 * Detach from the current session.
 */
Webdriver.prototype.detach = function() {
  var cb = findCallback(arguments);
  this.sessionID = null;
  if(cb) { cb(null); }
};

commands.chain = function(obj){
  deprecator.warn('chain', 'chain api has been deprecated, use promise chain instead.');
  require("./deprecated-chain").patch(this);
  return this.chain(obj);
};

Webdriver.prototype._init = function() {
  delete this.sessionID;
  var _this = this;
  var fargs = utils.varargs(arguments);
  var cb = fargs.callback,
      desired = fargs.all[0] || {};

  var _desired = _.clone(desired);

  if(desired.deviceName || desired.device || desired.wdNoDefaults ||
     desired['wd-no-defaults']) {
    // no default or appium caps, we dont default
    delete _desired.wdNoDefaults;
    delete _desired['wd-no-defaults'];
  } else {
    // using default
    _.defaults(_desired, this.defaultCapabilities);
  }

  // http options
  var httpOpts = httpUtils.newHttpOpts('POST', _this._httpConfig);

  var url = httpUtils.buildInitUrl(this.configUrl);

  // building request
  var data = {desiredCapabilities: _desired};

  httpUtils.emit(this, httpOpts.method, url, data);

  httpOpts.prepareToSend(url, data);

  httpUtils.requestWithRetry(httpOpts, this._httpConfig, this.emit.bind(this), function(err, res, data) {
    if(err) { return cb(err); }

    var resData;
    // retrieving session
    try{
      var jsonData = JSON.parse(data);
      if( jsonData.status === 0 ){
        _this.sessionID = jsonData.sessionId;
        resData = jsonData.value;
      }
    } catch(ignore){}
    if(!_this.sessionID){
      // attempting to retrieve the session the old way
      try{
        var locationArr = res.headers.location.replace(/\/$/, '').split('/');
        _this.sessionID = locationArr[locationArr.length - 1];
      } catch(ignore){}
    }

    if (_this.sessionID) {
      _this.emit('status', '\nDriving the web on session: ' + _this.sessionID + '\n');
      if (cb) { cb(null, _this.sessionID, resData); }
    } else {
      data = strip(data);
      if (cb) {
        err = new Error('The environment you requested was unavailable.');
        err.data = data;
        return cb(err);
      } else {
        console.error('\x1b[31mError\x1b[0m: The environment you requested was unavailable.\n');
        console.error('\x1b[33mReason\x1b[0m:\n');
        console.error(data);
        console.error('\nFor the available values please consult the WebDriver JSONWireProtocol,');
        console.error('located at: \x1b[33mhttp://code.google.com/p/selenium/wiki/JsonWireProtocol#/session\x1b[0m');
      }
    }
  });
};

// standard jsonwire call
Webdriver.prototype._jsonWireCall = function(opts) {
  var _this = this;

  // http options init
  var httpOpts = httpUtils.newHttpOpts(opts.method, this._httpConfig);

  var url = httpUtils.buildJsonCallUrl(this.noAuthConfigUrl, this.sessionID, opts.relPath, opts.absPath);

  // building callback
  var cb = opts.cb;
  if (opts.emit) {
    // wrapping cb if we need to emit a message
    var _cb = cb;
    cb = function() {
      var args = __slice.call(arguments, 0);
      _this.emit(opts.emit.event, opts.emit.message);
      if (_cb) { _cb.apply(_this,args); }
    };
  }

  // logging
  httpUtils.emit(this, httpOpts.method, url, opts.data);

  // writting data
  var data = opts.data || {};
  httpOpts.prepareToSend(url, data);
  // building request
  httpUtils.requestWithRetry(httpOpts, this._httpConfig, this.emit.bind(this), function(err, res, data) {
    if(err) { return cb(err); }
    data = strip(data);
    cb(null, data || "");
  });
};

Webdriver.prototype._sauceJobUpdate = function(jsonData, done) {
  var _this = this;
  if(!this.configUrl || !this.configUrl.auth){
    return done(new Error("Missing auth token."));
  } else if(!this.configUrl.auth.match(/^.+:.+$/)){
    return done(new Error("Invalid auth token."));
  }
  var jobUpdateUrl = url.resolve(
    this.sauceRestRoot.replace(/\/?$/,'/'),
    this.configUrl.auth.replace(/:.*$/,'') + '/jobs/' + this.sessionID);

  var httpOpts = httpUtils.newHttpOpts('PUT', this._httpConfig);
  httpOpts.auth = {
    user: this.configUrl.auth.split(':')[0],
    pass: this.configUrl.auth.split(':')[1],
  };
  httpOpts.jar = false; // disable cookies: avoids CSRF issues
  httpOpts.prepareToSend(jobUpdateUrl, jsonData);

  httpUtils.requestWithoutRetry(httpOpts, this.emit.bind(this), function(err, resp) {
    if(err) { return done(err); }
    if(resp.statusCode !== 200) {
      return done(new Error("Sauce job update failed with http status code:" +
        resp.statusCode));
    }
    httpUtils.emit(_this, 'POST', '/rest/v1/:user/jobs/:sessionID', jsonData);
    done();
  });
};

_(commands).each(function(fn, name) {
  Webdriver.prototype[name] = function() {
    var _this = this;
    var fargs = utils.varargs(arguments);
    this.emit('command', "CALL" , name + niceArgs(fargs.all));
    var cb = function(err) {
      if(err) {
        err.message = '[' + name + niceArgs(fargs.all) + "] " + err.message;
        if(fargs.callback) { fargs.callback(err); }
      } else {
        var cbArgs = __slice.call(arguments, 0);
        _this.emit('command', "RESPONSE" , name + niceArgs(fargs.all),
          niceResp(_.rest(cbArgs)));
        if(fargs.callback) { fargs.callback.apply(null, cbArgs); }
      }
    };
    var args = fargs.all.concat([cb]);
    return fn.apply(this, args);
  };
}).value();
