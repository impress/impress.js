var __slice = Array.prototype.slice,
    url = require('url'),
    SPECIAL_KEYS = require('./special-keys'),
    Webdriver = require('./webdriver'),
    Element = require('./element'),
    utils = require('./utils'),
    deprecator = utils.deprecator,
    config = require('./config'),
    _ = require("./lodash"),
    Q = require('q'),
    actions = require('./actions');

function buildConfigUrl(remoteWdConfig)
{
  var configUrl = _(remoteWdConfig).clone();

  // for backward compatibility
  if( configUrl.host && (configUrl.host.indexOf(':') < 0) && configUrl.port )
  {
    configUrl.hostname = configUrl.host;
    delete configUrl.host;
  }

  // for backward compatibility
  if(configUrl.username){
    configUrl.user = configUrl.username;
    delete configUrl.username;
  }

  // for backward compatibility
  if(configUrl.accessKey){
    configUrl.pwd = configUrl.accessKey;
    delete configUrl.accessKey;
  }

  // for backward compatibility
  if(configUrl.https){
    configUrl.protocol = 'https:';
    delete configUrl.https;
  }

  // for backward compatibility
  if(configUrl.path){
    configUrl.pathname = configUrl.path;
    delete configUrl.path;
  }

  // setting auth from user/password
  if(configUrl.user && configUrl.pwd){
    configUrl.auth = configUrl.user + ':' + configUrl.pwd;
    delete configUrl.user;
    delete configUrl.pwd;
  }

  _.defaults(configUrl, {
    protocol: 'http:',
    hostname: '127.0.0.1',
    port: '4444',
    pathname: '/wd/hub'
  });

  // strip any trailing slashes from pathname
  var parsed = url.parse(url.format(configUrl), true);
  if (parsed.pathname[parsed.pathname.length - 1] === '/') {
    parsed.pathname = parsed.pathname.slice(0, parsed.pathname.length - 1);
  }
  return parsed;
}

// parses server parameters
var parseRemoteWdConfig = function(args) {
  var config;
  if ((typeof args[0]) === 'object') {
    if(args[0].href && args[0].format){
      // was constructed with url.parse, so we don't modify it
      config = args[0];
    } else {
      config = buildConfigUrl( args[0] );
    }
  } else if ((typeof args[0]) === 'string' && (args[0].match(/^https?:\/\//)))  {
    config = url.parse(args[0]);
  } else {
    config = buildConfigUrl( {
      hostname: args[0],
      port: args[1],
      user: args[2],
      pwd: args[3]
    } );
  }

  // saucelabs automatic config
  if( /saucelabs\.com/.exec(config.hostname) )
  {
    if(!config.auth && process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY){
      config.auth = process.env.SAUCE_USERNAME + ':' + process.env.SAUCE_ACCESS_KEY;
    }
  }

  return config;
};

var PromiseWebdriver, PromiseElement, PromiseChainWebdriver, PromiseChainElement;

// Creates the Webdriver object
// server parameters can be passed in 4 ways
//   - as a url string
//   - as a url object, constructed via url.parse
//   - as a list of arguments host,port, user, pwd
//   - as an option object containing the fields above
// A `driverType` string may be passed at the end of the argument list.
// If it is a valid type it will be detected even if the other arguments
// are ommited. Valide types are: `remote`, `promise` and `promiseChain`.
function remote() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var driverProtos = {
    'async': Webdriver,
    'promise': PromiseWebdriver,
    'promiseChain': PromiseChainWebdriver
  };
  var driverTypes = _(driverProtos).keys().value();
  var driverType = driverTypes.indexOf(_(args).last())>0 ? args.pop() : 'async';

  var rwc = parseRemoteWdConfig(args);
  return new (driverProtos[driverType])(rwc);
}

function wrap() {
  var promiseProtos = require('./promise-webdriver')(Webdriver, Element, false);
  PromiseWebdriver = promiseProtos.PromiseWebdriver;
  PromiseElement = promiseProtos.PromiseElement;
  var promiseChainProtos = require('./promise-webdriver')(Webdriver, Element, true);
  PromiseChainWebdriver = promiseChainProtos.PromiseWebdriver;
  PromiseChainElement = promiseChainProtos.PromiseElement;
}

// todo: allow adding element methods

function addPromiseChainMethod(name, method) {
  var wrappedMethod = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    var promise = new Q(method.apply(this, args));
    this._enrich(promise);
    return promise;
  };
  PromiseChainWebdriver.prototype[name] = wrappedMethod;
}

function addElementPromiseChainMethod(name, method) {
  var wrappedMethod = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    var promise = new Q(method.apply(this, args));
    this._enrich(promise);
    return promise;
  };
  PromiseChainElement.prototype[name] = wrappedMethod;
}

function addPromiseMethod(name, method) {
  var wrappedMethod = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return new Q(method.apply(this, args));
  };
  PromiseWebdriver.prototype[name] = wrappedMethod;
  addPromiseChainMethod(name, method);
}

function addElementPromiseMethod(name, method) {
  var wrappedMethod = function() {
    var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return new Q(method.apply(this, args));
  };
  PromiseElement.prototype[name] = wrappedMethod;
  addElementPromiseChainMethod(name, method);
}

function addAsyncMethod(name, method) {
  Webdriver.prototype[name] = method;
  PromiseWebdriver.prototype[name] = PromiseWebdriver._wrapAsync(method);
  PromiseChainWebdriver.prototype[name] = PromiseChainWebdriver._wrapAsync(method);
}

function addElementAsyncMethod(name, method) {
  Element.prototype[name] = method;  
  PromiseElement.prototype[name] = PromiseWebdriver._wrapAsync(method);
  PromiseChainElement.prototype[name] = PromiseChainWebdriver._wrapAsync(method);
}

function removeMethod(name) {
  delete Webdriver.prototype[name];
  delete PromiseWebdriver.prototype[name];
  delete PromiseChainWebdriver.prototype[name];
}

// creates a webdriver object using the Q promise wrap not chained
function asyncRemote() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var rwc = parseRemoteWdConfig(args);
  return new Webdriver(rwc);
}

// creates a webdriver object using the Q promise wrap not chained
function promiseRemote() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var rwc = parseRemoteWdConfig(args);
  return new PromiseWebdriver(rwc);
}

// creates a webdriver object using the Q promise wrap chained
function promiseChainRemote() {
  var args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  var rwc = parseRemoteWdConfig(args);
  return new PromiseChainWebdriver(rwc);
}

// initial wrapping
wrap();

module.exports = {
  // Retrieves browser
  remote: remote,
  asyncRemote: asyncRemote,

  // Retrieves wrap browser
  promiseRemote: promiseRemote,
  promiseChainRemote: promiseChainRemote,

  // Webdriver and Wrapper base classes
  Webdriver: Webdriver,
  webdriver: Webdriver, // for backward compatibility
  Element: Element,
  PromiseChainWebdriver: PromiseChainWebdriver,
  PromiseWebdriver: PromiseWebdriver,
  TouchAction: actions.TouchAction,
  MultiAction: actions.MultiAction,

  // Actualizes promise wrappers
  rewrap: function() {
    deprecator.warn('rewrap',
    'rewrap has been deprecated, use addAsyncMethod instead.');
    wrap();
  },

  // config
  /**
   * wd.configureHttp(opts)
   *
   * opts example:
   * {timeout:60000, retries: 3, 'retryDelay': 15, baseUrl='http://example.com/'}
   * more info in README.
   *
   * @wd
   */
  configureHttp: config.configureHttp,
  getHttpConfig: function() { return _(config.httpConfig).clone(); },

  // deprecation
  /**
   * wd.showHideDeprecation(boolean)
   *
   * @wd
   */
  showHideDeprecation: deprecator.showHideDeprecation.bind(deprecator),

  // add/remove methods
  /**
   * wd.addAsyncMethod(name, func)
   *
   * @wd
   */
  addAsyncMethod: addAsyncMethod,
  /**
   * wd.addElementAsyncMethod(name, func)
   *
   * @wd
   */
  addElementAsyncMethod: addElementAsyncMethod,
  /**
   * wd.addPromiseMethod(name, func)
   *
   * @wd
   */
  addPromiseMethod: addPromiseMethod,
  /**
   * wd.addElementPromiseMethod(name, func)
   *
   * @wd
   */
  addElementPromiseMethod: addElementPromiseMethod,
  /**
   * wd.addPromiseChainMethod(name, func)
   *
   * @wd
   */
  addPromiseChainMethod: addPromiseChainMethod,
  /**
   * wd.addElementPromiseChainMethod(name, func)
   *
   * @wd
   */
  addElementPromiseChainMethod: addElementPromiseChainMethod,
  /**
   * wd.removeMethod(name, func)
   *
   * @wd
   */
  removeMethod: removeMethod,

  // Useful stuff
  Asserter: require('./asserters').Asserter,
  asserters: require('./asserters'),
  SPECIAL_KEYS: SPECIAL_KEYS,
  Q: Q,
  findCallback: utils.findCallback,
  varargs: utils.varargs,
  transferPromiseness: utils.transferPromiseness,

  // This is for people who write wrapper
  // todo: That should not be needed.
  utils: utils,

  setBaseClasses: function(_Webdriver, _Element) {
    Webdriver = _Webdriver;
    Element = _Element;
    wrap();
  }
};
