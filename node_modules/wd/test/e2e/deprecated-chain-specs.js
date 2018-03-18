/* global sauceJobTitle, mergeDesired */

require('../helpers/setup');

describe('deprecated chain - full' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;

  before(function(done) {
    browser = wd.remote(env.REMOTE_CONFIG);
    browser.configureLogging(done);
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function(done) {
    if(env.SAUCE) { browser.sauceJobStatus(allPassed, done); }
    else { done(); }
  });

  it("full chaining should work", function(done) {
    this.timeout(env.INIT_TIMEOUT);
    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['e2e']
    };
    /* jshint evil: true */
    browser.chain()
      .init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ))
      .get("http://admc.io/wd/test-pages/guinea-pig.html")
      .title(function(err, title) {
        title.should.include('WD');
      })
      .quit(function(err) {
        should.not.exist(err);
        done();
      });
  });

});

describe('deprecated chain - partial' + env.ENV_DESC, function() {
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

  it("partial chaining should work", function(done) {
    /* jshint evil: true */
    browser.chain()
      .title(function(err, title) {
        title.should.include('WD');
      })
      .elementById('submit', function(err, el) {
        should.not.exist(err);
        should.exist(el);

        // Commenting this test, nothing preventing quit to be called first
        // we should make clickElement not require a callback
        // browser.clickElement(el, function(err) {
        //  should.not.exist.err;
        //});
      })
      .eval("window.location.href", function(err, href) {
        href.should.include('http');
        done(null);
      });
  });

  var asyncCallCompleted = false;
  it("browser.queueAddAsync", function(done) {
    browser.chain()
      .title(function(err, title) {
        title.should.include('WD');
      })
      .queueAddAsync( function(cb) {
        setTimeout(function() {
          asyncCallCompleted = true;
          cb(null);
        }, 250);
      })
      .elementById('submit', function(err, el) {
        should.not.exist(err);
        should.exist(el);
        asyncCallCompleted.should.be.true;
        done(null);
      });
  });

});

