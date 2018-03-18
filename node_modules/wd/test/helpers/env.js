GLOBAL._ = require('../../lib/lodash');

/*global env:true */ 
var env = GLOBAL.env = {};

var toBoolean = function(str) {
  return _(str).toBoolean().value();
};

env.VERBOSE = toBoolean(process.env.VERBOSE);
env.BASE_TIME_UNIT = _(process.env.BASE_TIME_UNIT || 500).toNumber().value();
env.TIMEOUT = _(process.env.TIMEOUT || 60000).toNumber().value();
env.SHORT = toBoolean(process.env.SHORT);

env.HTTP_CONFIG = {};
if(process.env.HTTP_TIMEOUT)
  { env.HTTP_CONFIG.timeout = _(process.env.HTTP_TIMEOUT).toNumber().value(); }
if(process.env.HTTP_RETRIES)
  { env.HTTP_CONFIG.retries = _(process.env.HTTP_RETRIES).toNumber().value(); }
if(process.env.HTTP_RETRY_DELAY)
  { env.HTTP_CONFIG.retryDelay = _(process.env.HTTP_RETRY_DELAY).toNumber().value(); }

env.DEBUG_CONNECTION = process.env.DEBUG_CONNECTION;

env.REMOTE_CONFIG = process.env.REMOTE_CONFIG;
env.BROWSER = process.env.BROWSER || 'chrome';
env.BROWSER_SKIP = env.BROWSER;

env.MULTI = false;

if(env.BROWSER === 'multi') {
    env.MULTI = true;
}

env.DESIRED = process.env.DESIRED ? JSON.parse(process.env.DESIRED) :
  {browserName: env.BROWSER};

if(env.BROWSER === 'multi') {
  env.DESIRED = {browserName: 'chrome'};
}

require('./mobile_env');

env.EXPRESS_PORT = _(process.env.EXPRESS_PORT || 3000).toNumber().value();
env.PROXY_PORT = _(process.env.PROXY_PORT || 5050).toNumber().value();

if(env.ANDROID){
  env.TIMEOUT = 300000;
}

env.SAUCE_CONNECT = toBoolean(process.env.SAUCE_CONNECT);
env.SAUCE = toBoolean(process.env.SAUCE) || env.SAUCE_CONNECT;

env.TRAVIS_JOB_ID = process.env.TRAVIS_JOB_ID;
env.TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;
env.TRAVIS_BUILD_NUMBER = process.env.TRAVIS_BUILD_NUMBER;

if( env.TRAVIS_JOB_ID ){
  env.TRAVIS = true;
}

if(env.SAUCE) {
  env.MIDWAY_ROOT_URL = "http://localhost:" + env.PROXY_PORT + '/' + 
    env.EXPRESS_PORT;
} else {
  env.MIDWAY_ROOT_URL = "http://localhost:" +  env.EXPRESS_PORT;
}

if(env.SAUCE){
  env.BASE_TIME_UNIT = _(process.env.BASE_TIME_UNIT || 4000).toNumber().value();
  env.TIMEOUT = _(process.env.TIMEOUT || 600000).toNumber().value();

  env.SAUCE_JOB_ID =
    env.TRAVIS_BUILD_NUMBER ||
    process.env.SAUCE_JOB_ID ||
    Math.round(new Date().getTime() / (1000*60));
  env.SAUCE_USERNAME = process.env.SAUCE_USERNAME;
  env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
  env.SAUCE_PLATFORM = process.env.SAUCE_PLATFORM || 'Linux';
  env.SAUCE_RECORD_VIDEO = toBoolean(process.env.SAUCE_RECORD_VIDEO);
  env.TUNNEL_IDENTIFIER = process.env.TUNNEL_IDENTIFIER;

  if(env.SAUCE_CONNECT){
    env.REMOTE_CONFIG =
      'http://' + env.SAUCE_USERNAME + ':' + env.SAUCE_ACCESS_KEY +
        '@localhost:4445/wd/hub';
  } else {
    env.REMOTE_CONFIG =
      'http://' + env.SAUCE_USERNAME + ':' + env.SAUCE_ACCESS_KEY +
        '@ondemand.saucelabs.com/wd/hub';
  }

  if(!env.DESIRED.platformName) {
    env.DESIRED.platform = env.DESIRED.platform || env.SAUCE_PLATFORM;
  }
  env.DESIRED.build = env.SAUCE_JOB_ID;
  env.DESIRED["record-video"] = env.SAUCE_RECORD_VIDEO;
  env.DESIRED.tags = env.DESIRED.tags || [];
  env.DESIRED.tags.push('wd');
  if(env.TRAVIS_JOB_NUMBER){
    env.DESIRED.tags.push('travis');
  }
  if(env.TUNNEL_IDENTIFIER) {
    env.DESIRED['tunnel-identifier'] = env.TUNNEL_IDENTIFIER;
  }

  // special case for window
  if (env.BROWSER === 'explorer') {
    env.DESIRED.browserName = 'internet explorer';
    env.DESIRED.platform = 'Windows 8';
    env.DESIRED.version = '10';
  }
}

if(env.MULTI){
    env.ENV_DESC =  '(' + (env.SAUCE? 'sauce' : 'local') + ', multi)';
} else {
    env.ENV_DESC =  '(' + (env.SAUCE? 'sauce' : 'local') + ', ' +
        (env.DESIRED.browserName || 'default') + ')';
}
