/* global sauceJobTitle, mergeDesired */

require('../../helpers/setup');

function buildDesired(title, browser, platform) {
  var sauceExtra =  {
    name: sauceJobTitle(title),
    tags: ['midway']
  };
  var desired = mergeDesired( env.DESIRED,
    env.SAUCE? sauceExtra : null
  );
  delete desired.browserName;
  delete desired.platform;
  if(browser) { desired.browserName = browser; }
  if(platform) { desired.platform = platform; }
  return desired;
}

describe('init ' + env.ENV_DESC,function() {
  this.timeout(env.TIMEOUT);

  var browser;

  before(function() {
    browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
    return browser.configureLogging();
  });

  afterEach(function() {
    var _this = this;
    return browser
      .quit().then(function() {
        if(env.SAUCE) { return(browser.sauceJobStatus(_this.currentTest.state === 'passed')); }
      });
  });

  it("default should be firefox", function() {
    browser.defaultCapabilities.browserName.should.equal('firefox');
    browser.defaultCapabilities.javascriptEnabled.should.be.ok;
    return browser
      .init(buildDesired( this.runnable().parent.title + " #1",
        undefined, env.DESIRED.platform ))
      .sessionCapabilities().should.eventually.have.property('browserName', 'firefox');
  });

  it("setting browser default", function() {
    browser.defaultCapabilities.browserName = 'chrome';
    browser.defaultCapabilities.javascriptEnabled = false;
    return browser
      .init(buildDesired( this.runnable().parent.title + " #2",
        undefined, env.DESIRED.platform ))
      .sessionCapabilities().should.eventually.have.property('browserName', 'chrome');
  });

  it("desired browser as parameter", function() {
    browser.defaultCapabilities.browserName = 'firefox';
    return browser
      .init(buildDesired( this.runnable().parent.title + " #3",
        'chrome', env.DESIRED.platform))
      .sessionCapabilities().should.eventually.have.property('browserName', 'chrome');
  });

  if(env.SAUCE){

    it("setting browser platform to VISTA", function() {
      browser.defaultCapabilities.platform = 'VISTA';
      browser.defaultCapabilities.browserName = 'firefox';

      return browser
        .init(buildDesired( this.runnable().parent.title + " #4"))
        .sessionCapabilities().then(function(caps) {
          ['XP','WINDOWS'].should.include(caps.platform);
        });
   });

    it("setting browser platform to LINUX", function() {
      browser.defaultCapabilities.browserName = 'chrome';
      browser.defaultCapabilities.platform = 'LINUX';

      return browser
        .init(buildDesired( this.runnable().parent.title + " #5"))
        .sessionCapabilities().then(function(caps) {
          caps.platform.toLowerCase().should.equal('linux');
        });
    });

    it("configuring explorer in desired @saucelabs", function() {
      return browser
        .init(buildDesired( this.runnable().parent.title + " #6",
          'iexplore', 'Windows 2008'))
        .sessionCapabilities().then(function(sessionCapabilities) {
          sessionCapabilities.platform.should.equal('WINDOWS');
          sessionCapabilities.browserName.should.include('explorer');
        });
    });
  }
});
