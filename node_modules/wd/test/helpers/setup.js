require('./env');
require('colors');
require('./skip');

GLOBAL.wd = require('../../lib/main');
var utils = require('../../lib/utils');
GLOBAL.uuidLib = require('node-uuid');

if( env.TRAVIS ){
  console.log("Travis environment detected.");
  console.log("TRAVIS_BUILD_NUMBER --> ", env.TRAVIS_BUILD_NUMBER);
  console.log("TRAVIS_JOB_NUMBER --> ", env.TRAVIS_JOB_NUMBER);
  console.log("TRAVIS_JOB_ID --> ", env.TRAVIS_JOB_ID);
}

// monkey patching
wd.addAsyncMethod(
  'configureLogging',
  function (done){
  if(env.VERBOSE) {
    this.on('status', function(info) {
      console.log(info.cyan);
    });
    this.on('command', function(eventType, command, response) {
      console.log(' > ' + eventType.cyan, command, (response || '').grey);
    });
    this.on('http', function(meth, path, data) {
      console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
  }
  if(env.DEBUG_CONNECTION) {
    this.on('connection', function(message) {
      console.log('connection > ' + message );
    });
  }

  done();
  }
);

GLOBAL.midwayUrl = function(testSuite, cat, title){
  var uuid;
  if(typeof testSuite === 'object') {
    var opts = testSuite;
    testSuite = opts.testSuite;
    cat = opts.cat;
    title = opts.title,
    uuid = opts.uuid;
  } else {
    if(!title) {
      title = cat;
      cat = undefined;
    }    
  }
  var cleanTitle = title.replace(/@[-\w]+/g, '').trim();
  return env.MIDWAY_ROOT_URL + '/test-page' +
    '?p=' + encodeURIComponent(cleanTitle) +
    '&ts=' + encodeURIComponent(testSuite) +
    (cat? '&c=' +encodeURIComponent(cat) : '') +
    (uuid? '&uuid=' +encodeURIComponent(uuid) : '');
};

GLOBAL.mergeDesired = function(desired, extra){
  desired = _.clone(desired);
  if(!extra) { return desired; }
  _(extra).each(function(value, key) {
    if(key === 'tags'){
      desired[key] = _.union(desired[key], extra[key]);
    } else {
      desired[key] = extra[key] || desired[key];
    }
  }).value();
  return desired;
};

GLOBAL.sauceJobTitle = function(title) {
  return (env.TRAVIS_JOB_NUMBER? '[' + env.TRAVIS_JOB_NUMBER + '] ' : '') +
    title
      .replace(/\(.*\)/g,'')
      .replace(/\@[\w\-]+/g,'')
      .trim();
};

GLOBAL.prepareJs = function(script) {
  if(env.ANDROID){
    script = utils.inlineJs(script);
  }
  return script;
};

GLOBAL.Q = GLOBAL.wd.Q;

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
GLOBAL.AssertionError = chai.AssertionError;
GLOBAL.expect = chai.expect;
GLOBAL.should = chai.should();

GLOBAL.Express = require("./express-helper").Express;

wd.configureHttp(env.HTTP_CONFIG);
