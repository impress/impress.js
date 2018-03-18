/* global sauceJobTitle, mergeDesired */

require('../helpers/setup');

describe('promise no-chain ' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;

  before(function() {
    browser = wd.promiseRemote(env.REMOTE_CONFIG);
    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['e2e']
    };
    return browser
      .configureLogging().then(function() {
        return browser.init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ));
      });
  });

  beforeEach(function() {
    return browser.get('http://admc.io/wd/test-pages/guinea-pig.html');
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

  it("should retrieve the title", function() {
    return browser
      .title().should.eventually.include("WD");
  });

  it("should retrieve a subelement value", function() {
    return browser.elementById('the_forms_id').then(function(el) {
        return el.elementById('unchecked_checkbox');
    }).then(function(el) {
        return el.getAttribute('type');
    }).should.become('checkbox');
  });

  it("clicking submit should work", function() {
    return browser.elementById("submit").then(function(el) {
      return browser.clickElement(el);
    }).then(function() {
      /* jshint evil: true */
      return browser.eval("window.location.href");
    }).should.eventually.include("http://");
  });

});

