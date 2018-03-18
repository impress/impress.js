/* global sauceJobTitle, mergeDesired, midwayUrl, Express */

require('../../helpers/setup');

function buildDesired(title) {
  var sauceExtra =  {
    name: sauceJobTitle(title),
    tags: ['midway']
  };
  var desired = mergeDesired( env.DESIRED,
    env.SAUCE? sauceExtra : null
  );
  return desired;
}

describe('config-http ' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var partials = {};
  var express;
  var currentHttpConfig;

  function promiseChainRemote() {
    browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
    browser.configureLogging();
    return browser;
  }

  before(function(done) {
    express = new Express( __dirname + '/../assets', partials);
    express.start(done);
  });

  beforeEach(function() {
    currentHttpConfig = wd.getHttpConfig();
  });

  afterEach(function() {
    var _this = this;
    wd.configureHttp(currentHttpConfig);
    wd.getHttpConfig().should.deep.equal(currentHttpConfig);
    if(browser && browser.sessionID){
      return browser
        .quit().then(function() {
          if(env.SAUCE) { return(browser.sauceJobStatus(_this.currentTest.state === 'passed')); }
        });
    }
  });

  after(function(done) {
    express.stop(done);
  });

  it("wd.configureHttp", function() {

    var newConfig = {
      timeout: env.HTTP_TIMEOUT || 60000,
      retries: env.HTTP_RETRIES || 10,
      retryDelay: env.HTTP_RETRY_DELAY || 50,
      baseUrl: 'http://example.com',
      proxy: undefined
    };

    var newConfig2 = _(newConfig).clone();
    newConfig2.baseUrl = 'http://example2.com';

    wd.configureHttp(newConfig);
    wd.getHttpConfig().should.deep.equal(newConfig);
    wd.configureHttp( {baseUrl: 'http://example2.com' } );
    wd.getHttpConfig().should.deep.equal(newConfig2);

    promiseChainRemote();

    browser._httpConfig.should.deep.equal(newConfig2);

  });

  it("browser.configureHttp", function() {

    var wdCurrent = wd.getHttpConfig();

    promiseChainRemote();

    browser._httpConfig.should.deep.equal(wdCurrent);

    var newConfig = {
      timeout: env.HTTP_TIMEOUT || 60000,
      retries: env.HTTP_RETRIES || 10,
      retryDelay: env.HTTP_RETRY_DELAY || 50,
      baseUrl: 'http://example3.com',
      proxy: undefined
    };

    var newConfig2 = _(newConfig).clone();
    newConfig2.baseUrl = 'http://example4.com';

    browser.configureHttp(newConfig);

    browser._httpConfig.should.deep.equal(newConfig);
    wd.getHttpConfig().should.deep.equal(wdCurrent);

    browser.configureHttp( {baseUrl: 'http://example4.com' } );
    browser._httpConfig.should.deep.equal(newConfig2);
    wd.getHttpConfig().should.deep.equal(wdCurrent);

  });

  it('browser.configureHttp (using promise)', function() {
    promiseChainRemote();
    var current = _(browser._httpConfig).clone();
    current.should.exist;
    var wdCurrent = wd.getHttpConfig();
    var newConfig = {
        timeout: env.HTTP_TIMEOUT || 60000,
        retries: env.HTTP_RETRIES || 10,
        retryDelay: env.HTTP_RETRY_DELAY || 50,
        baseUrl: 'http://example.com/',
        proxy: undefined
    };
    if(newConfig.retryDelay = wdCurrent.retryDelay) { newConfig.retryDelay++; }
    return browser
      .configureHttp( newConfig).then(function() {
        browser._httpConfig.should.deep.equal(newConfig);
        wd.getHttpConfig().should.deep.equal(wdCurrent);
      })
      .configureHttp(current).should.be.fulfilled;
  });

  it("setting global baseUrl", function() {
    var url =  midwayUrl( this.runnable().parent.title, this.runnable().title);
    var matcher = url.match(/(.*\/)(test-page.*)/);
    var baseUrl = matcher[1];
    should.exist(baseUrl);
    var relUrl = matcher[2];
    should.exist(relUrl);
    wd.configureHttp({baseUrl: baseUrl});
    promiseChainRemote();
    return browser
      .init(buildDesired( this.runnable().parent.title + " #1"))
      .get(url)
      .title().should.eventually.include('WD Tests - config-http')
      .get(relUrl).title().should.eventually.include('WD Tests - config-http')
      ;
  });

  it("setting browser baseUrl", function() {
    var url =  midwayUrl( this.runnable().parent.title, this.runnable().title);
    var matcher = url.match(/(.*\/)(test-page.*)/);
    var baseUrl = matcher[1];
    should.exist(baseUrl);
    var relUrl = matcher[2];
    should.exist(relUrl);

    promiseChainRemote();
    should.not.exist(browser._httpConfig.baseUrl);
    return browser
      .init(buildDesired( this.runnable().parent.title + " #2"))
      .then(function() {
        return browser
          .get(relUrl)
          .should.eventually.include('WD Tests - config-http')
          .should.be.rejected;
      })
      .configureHttp({baseUrl: baseUrl})
      .get(relUrl).title().should.eventually.include('WD Tests - config-http')
      .get(url).title().should.eventually.include('WD Tests - config-http');
  });

  it("wd baseUrl override", function() {
    var url =  midwayUrl( this.runnable().parent.title, this.runnable().title);
    var matcher = url.match(/(.*\/)(test-page.*)/);
    var baseUrl = matcher[1];
    should.exist(baseUrl);
    var relUrl = matcher[2];
    should.exist(relUrl);

    wd.configureHttp({baseUrl: 'http://__nowhere__:1234/'});
    promiseChainRemote();
    browser._httpConfig.baseUrl.should.include('__nowhere');
    return browser
      .init(buildDesired( this.runnable().parent.title + " #3"))
      .then(function() {
        return browser
          .get(relUrl).should.eventually.include('WD Tests - config-http')
          .should.be.rejected;
      })
      .configureHttp({baseUrl: baseUrl})      
      .get(relUrl).title().should.eventually.include('WD Tests - config-http')
      .get(url).title().should.eventually.include('WD Tests - config-http');
  });

});
