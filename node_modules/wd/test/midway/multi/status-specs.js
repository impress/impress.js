/* global sauceJobTitle, mergeDesired */

require('../../helpers/setup');

describe('status ' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;

  before(function() {
    browser = wd.promiseChainRemote(env.REMOTE_CONFIG);

    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['midway']
    };
    return browser
      .configureLogging()
      .init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ));
  });

  afterEach(function() {
    allPassed = allPassed && (this.currentTest.state === 'passed');
  });

  after(function() {
    return browser
      .quit().then(function() {
        if(env.SAUCE) { return(browser.sauceJobStatus(allPassed)); }
      });
  });

  it("browser.status", function() {
    return browser.status().should.eventually.exist;
  });

  if(!env.SAUCE) { // this cannot work in a cloud env
    it("browser.sessions", function() {
      return browser.sessions().should.eventually.exist;
    });
  }

  it("browser.sessionCapabilities", function() {
    return browser.sessionCapabilities().then(function(capabilities) {
      should.exist(capabilities);
      should.exist(capabilities.browserName);
      should.exist(capabilities.platform);
    });
  });

  if(!env.SAUCE) { // it relies on browser.sessions
    it("browser.altSessionCapabilities", function() {
      return browser.altSessionCapabilities().then(function(capabilities) {
        should.exist(capabilities);
        should.exist(capabilities.browserName);
        should.exist(capabilities.platform);
      });
    });
  }
});
