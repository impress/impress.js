var url = require('url');
require('../helpers/setup');

describe("wd remote tests", function() {
  describe("default", function() {
    it("browser should be initialized with default parameters", function(done) {
      var browser;
      browser = wd.remote();
      browser.configUrl.hostname.should.equal('127.0.0.1');
      browser.configUrl.port.should.equal('4444');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done();
    });
  });
  describe("url string", function() {
    it("browser should be initialized with: http default", function(done) {
      var browser;
      browser = wd.remote('http://localhost');
      browser.configUrl.protocol.should.equal('http:');
      browser.configUrl.hostname.should.equal('localhost');
      should.not.exist(browser.configUrl.port);
      browser.configUrl.pathname.should.equal('/');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: http url", function(done) {
      var browser;
      browser = wd.remote('http://localhost:8888/wd/hub');
      browser.configUrl.protocol.should.equal('http:');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: https url", function(done) {
      var browser;
      browser = wd.remote('https://localhost:8888/wd/hub');
      browser.configUrl.protocol.should.equal('https:');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: http url, auth", function(done) {
      var browser;
      browser = wd.remote('http://mickey:mouse@localhost:8888/wd/hub');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      browser.configUrl.auth.should.equal('mickey:mouse');
      done(null);
    });
  });
  describe("url object", function() {
    it("browser should be initialized with: http default", function(done) {
      var browser;
      browser = wd.remote(url.parse('http://localhost'));
      browser.configUrl.protocol.should.equal('http:');
      browser.configUrl.hostname.should.equal('localhost');
      should.not.exist(browser.configUrl.port);
      browser.configUrl.pathname.should.match(/^\/?$/);
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: http url", function(done) {
      var browser;
      browser = wd.remote(url.parse('http://localhost:8888/wd/hub'));
      browser.configUrl.protocol.should.equal('http:');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: https url", function(done) {
      var browser;
      browser = wd.remote(url.parse('https://localhost:8888/wd/hub'));
      browser.configUrl.protocol.should.equal('https:');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: http url, auth", function(done) {
      var browser;
      browser = wd.remote(url.parse('http://mickey:mouse@localhost:8888/wd/hub'));
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      browser.configUrl.auth.should.equal('mickey:mouse');
      done(null);
    });
  });
  describe("params", function() {
    it("browser should be initialized with: host, port", function(done) {
      var browser;
      browser = wd.remote('localhost', 8888);
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      should.not.exist(browser.configUrl.auth);
      done(null);
    });
    it("browser should be initialized with: host, port, user, pwd", function(done) {
      var browser;
      browser = wd.remote('localhost', '8888', 'mickey', 'mouse');
      browser.configUrl.hostname.should.equal('localhost');
      browser.configUrl.port.should.equal('8888');
      browser.configUrl.pathname.should.equal('/wd/hub');
      browser.configUrl.auth.should.equal('mickey:mouse');
      done(null);
    });
  });
});
describe("options", function() {
  it("browser should be initialized with default", function(done) {
    var browser;
    browser = wd.remote({});
    browser.configUrl.hostname.should.equal('127.0.0.1');
    browser.configUrl.port.should.equal('4444');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: hostname, port", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'localhost',
      port: 8888
    });
    browser.configUrl.protocol.should.equal('http:');
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: protocol, hostname, port", function(done) {
    var browser;
    browser = wd.remote({
      protocol: 'https:',
      hostname: 'localhost',
      port: '8888'
    });
    browser.configUrl.protocol.should.equal('https:');
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: host", function(done) {
    var browser;
    browser = wd.remote({
      host: 'localhost:8888',
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: hostname, port, user, pwd", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'localhost',
      port: 8888,
      user: 'mickey',
      pwd: 'mouse'
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('mickey:mouse');
    done(null);
  });
  it("browser should be initialized with: hostname, port, user, pwd", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'localhost',
      port: 8888,
      auth: 'mickey:mouse',
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('mickey:mouse');
    done(null);
  });
  it("browser should be initialized with: path", function(done) {
    var browser;
    browser = wd.remote({
      pathname: '/taiwan'
    });
    browser.configUrl.hostname.should.equal('127.0.0.1');
    browser.configUrl.port.should.equal('4444');
    browser.configUrl.pathname.should.equal('/taiwan');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: hostname, port, path", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'localhost',
      port: 8888,
      pathname: '/'
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: hostname, port, username, user, pwd", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'localhost',
      port: 8888,
      user: 'mickey',
      pwd: 'mouse',
      pathname: '/asia/taiwan'
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/asia/taiwan');
    browser.configUrl.auth.should.equal('mickey:mouse');
    done(null);
  });
});
describe("automatic Saucelabs config", function() {
  before(function() {
    process.env.SAUCE_USERNAME = 'zorro';
    process.env.SAUCE_ACCESS_KEY = '1234-5678';
  });
  after(function() {
    delete process.env.SAUCE_USERNAME;
    delete process.env.SAUCE_ACCESS_KEY;
  });
  it("browser should be initialized with indexed parameters", function(done) {
    var browser;
    browser = wd.remote('ondemand.saucelabs.com', 80);
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    browser.configUrl.port.should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('zorro:1234-5678');
    done();
  });
  it("browser should be initialized with named parameters", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'ondemand.saucelabs.com',
      port:80 });
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    browser.configUrl.port.should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('zorro:1234-5678');
    done();
  });
  it("browser should be initialized with indexed parameters username and accessKey", function(done) {
    var browser;
    browser = wd.remote('ondemand.saucelabs.com', 80, 'not_zorro', '8765-4321');
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    browser.configUrl.port.should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('not_zorro:8765-4321');
    done();
  });
  it("browser should be initialized with named parameters username and accessKey", function(done) {
    var browser;
    browser = wd.remote({
      hostname: 'ondemand.saucelabs.com',
      port:80,
      username: 'not_zorro',
      accessKey: '8765-4321' });
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    browser.configUrl.port.should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('not_zorro:8765-4321');
    done();
  });
  it("browser should be initialized with url string", function(done) {
    var browser;
    browser = wd.remote('http://ondemand.saucelabs.com/wd/hub');
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    (browser.configUrl.port || '80').should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('zorro:1234-5678');
    done();
  });
  it("browser should be initialized with url object", function(done) {
    var browser;
    browser = wd.remote(url.parse('http://ondemand.saucelabs.com/wd/hub'));
    browser.configUrl.hostname.should.equal('ondemand.saucelabs.com');
    (browser.configUrl.port || '80').should.equal('80');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('zorro:1234-5678');
    done();
  });
});
describe("driver type", function() {
  it("default", function(done) {
    var browser;
    browser = wd.remote();
    (browser instanceof wd.Webdriver).should.be.true;
    done();
  });
  it("remote", function(done) {
    var browser;
    browser = wd.remote('async');
    (browser instanceof wd.Webdriver).should.be.true;
    done();
  });
  it("promise", function(done) {
    var browser;
    browser = wd.remote('promise');
    (browser instanceof wd.PromiseWebdriver).should.be.true;
    done();
  });
  it("promiseChain", function(done) {
    var browser;
    browser = wd.remote('promiseChain');
    (browser instanceof wd.PromiseChainWebdriver).should.be.true;
    done();
  });
  it("object + promise", function(done) {
    var browser;
    browser = wd.remote({}, 'promise');
    (browser instanceof wd.PromiseWebdriver).should.be.true;
    done();
  });
  it("url + promiseChain", function(done) {
    var browser;
    browser = wd.remote('http://example.com/wd', 'promiseChain');
    (browser instanceof wd.PromiseChainWebdriver).should.be.true;
    done();
  });
  it("host + port + promise", function(done) {
    var browser;
    browser = wd.remote('example.com',4444, 'promise');
    (browser instanceof wd.PromiseWebdriver).should.be.true;
    done();
  });
  it("host + port + username + password + promiseChain", function(done) {
    var browser;
    browser = wd.remote('example.com',4444, 'me', 'secret', 'promiseChain');
    (browser instanceof wd.PromiseChainWebdriver).should.be.true;
    done();
  });
});
describe("other remote methods", function() {
  it("asyncRemote", function(done) {
    var browser;
    browser = wd.asyncRemote();
    (browser instanceof wd.Webdriver).should.be.true;
    done();
  });
  it("promiseRemote", function(done) {
    var browser;
    browser = wd.promiseRemote();
    (browser instanceof wd.PromiseWebdriver).should.be.true;
    done();
  });
  it("promiseChainRemote", function(done) {
    var browser;
    browser = wd.promiseChainRemote();
    (browser instanceof wd.PromiseChainWebdriver).should.be.true;
    done();
  });
});
describe("backward compatibility", function() {
  it("browser should be initialized with: host, port", function(done) {
    var browser;
    browser = wd.remote({
      host: 'localhost',
      port: 8888
    });
    browser.configUrl.protocol.should.equal('http:');
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: https, host, port", function(done) {
    var browser;
    browser = wd.remote({
      https: true,
      host: 'localhost',
      port: 8888
    });
    browser.configUrl.protocol.should.equal('https:');
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
  it("browser should be initialized with: host, port, username, accesskey", function(done) {
    var browser;
    browser = wd.remote({
      host: 'localhost',
      port: 8888,
      username: 'mickey',
      accessKey: 'mouse'
    });
    browser.configUrl.hostname.should.equal('localhost');
    browser.configUrl.port.should.equal('8888');
    browser.configUrl.pathname.should.equal('/wd/hub');
    browser.configUrl.auth.should.equal('mickey:mouse');
    done(null);
  });
  it("browser should be initialized with: path", function(done) {
    var browser;
    browser = wd.remote({
      path: '/taiwan'
    });
    browser.configUrl.hostname.should.equal('127.0.0.1');
    browser.configUrl.port.should.equal('4444');
    browser.configUrl.pathname.should.equal('/taiwan');
    should.not.exist(browser.configUrl.auth);
    done(null);
  });
});
