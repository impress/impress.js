var request = require('request'),
    utils = require("./utils"),
    urllib = require('url'),
    packageDotJson = require('../package.json');

exports.buildInitUrl =function(baseUrl)
{
  return utils.resolveUrl(baseUrl, 'session');
};

exports.emit =function(browser ,method, url, data)
{
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  if(typeof url === 'string') { url = urllib.parse(url); }
  browser.emit('http', method,
    url.path.replace(browser.sessionID, ':sessionID')
      .replace(browser.configUrl.pathname, ''), data
    );
};

exports.buildJsonCallUrl = function(baseUrl ,sessionID, relPath, absPath){
  var path = ['session'];
  if(sessionID)
    { path.push('/' , sessionID); }
  if(relPath)
    { path.push(relPath); }
  if(absPath)
    { path = [absPath]; }
  path = path.join('');

  return utils.resolveUrl(baseUrl, path);
};

exports.newHttpOpts = function(method, httpConfig) {
  // this._httpConfig
  var opts = {};

  opts.method = method;
  opts.headers = {};

  opts.headers.Connection = 'keep-alive';
  opts.headers['User-Agent'] = 'admc/wd/' + packageDotJson.version;
  opts.timeout = httpConfig.timeout;
  if(httpConfig.proxy) { opts.proxy = httpConfig.proxy; }
  // we need to check method here to cater for PUT and DELETE case
  if(opts.method === 'GET' || opts.method === 'POST'){
    opts.headers.Accept = 'application/json';
  }

  opts.prepareToSend = function(url, data) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }
    this.url = url;
    if (opts.method === 'POST' || opts.method === 'PUT') {
      this.headers['Content-Type'] = 'application/json; charset=UTF-8';
      this.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
      this.body = data;
    }
  };
  return opts;
};

var shouldRetryOn = function(err) {
    return err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT' ||
        err.code === 'ESOCKETTIMEDOUT' ||
        err.code === 'EPIPE';
};

var requestWithRetry = function(httpOpts, httpConfig, emit, cb, attempts) {
  request(httpOpts, function(err, res, data) {
    if(!attempts) { attempts = 1; }
    if( httpConfig.retries >= 0 &&
      (httpConfig.retries === 0 || (attempts -1) <= httpConfig.retries) &&
      err && (shouldRetryOn(err))) {
      emit('connection', err.code , 'Lost http connection retrying in ' + httpConfig.retryDelay + ' ms.', err);
      setTimeout(function() {
        requestWithRetry(httpOpts, httpConfig, emit, cb, attempts + 1 );
      }, httpConfig.retryDelay);
    } else {
      if(err) {
        emit('connection', err.code, 'Unexpected error.' , err);
      }
      cb(err, res, data);
    }
  });
};
exports.requestWithRetry = requestWithRetry;

var requestWithoutRetry = function(httpOpts, emit, cb) {
  request(httpOpts, function(err, res, data) {
    if(err) {
      emit('connection', err.code, 'Unexpected error.' , err);
    }
    cb(err, res, data);
  });
};
exports.requestWithoutRetry = requestWithoutRetry;
