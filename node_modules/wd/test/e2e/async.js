/* global sauceJobTitle, mergeDesired */

require('../helpers/setup');

describe('async' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;

  before(function(done) {
    browser = wd.remote(env.REMOTE_CONFIG);
    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['e2e']
    };
    browser.configureLogging(function(err) {
      if(err) { return done(err); }
      browser.init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ), done);
    });
  });

  beforeEach(function(done) {
    browser.get('http://admc.io/wd/test-pages/guinea-pig.html', done);
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function(done) {
    browser.quit(function() {
      if(env.SAUCE) { browser.sauceJobStatus(allPassed, done); }
      else { done(); }
    });
  });

  it("should retrieve title", function(done) {
    browser.title(function(err, title) {
      should.not.exist(err);
      title.should.include('WD');
      done();
    });
  });

  it("should get element", function(done) {
    browser.elementById('submit', function(err, el) {
      should.not.exist(err);
      should.exist(el);
      done();
    });
  });

  it("eval", function(done) {
    /* jshint evil: true */
    browser.eval("window.location.href", function(err, href) {
      href.should.include('http');
      done(null);
    });
  });
});

