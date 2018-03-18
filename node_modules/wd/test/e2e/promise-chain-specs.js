/* global sauceJobTitle, mergeDesired */

require('../helpers/setup');

describe('promise chain ' + env.ENV_DESC, function() {
  this.timeout(env.TIMEOUT);

  var browser;
  var allPassed = true;

  before(function() {
    browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
    var sauceExtra = {
      name: sauceJobTitle(this.runnable().parent.title),
      tags: ['e2e']
    };
    return browser
      .configureLogging()
      .init(mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null ));
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

  it("should retrieve title", function() {
    return browser
      .title().should.eventually.contain("WD");
  });

 it("should retrieve title a subelement value", function() {
    return browser
      .elementById('the_forms_id')
      .elementById('>', 'unchecked_checkbox').then(function(el) {
        return Q.all([
          el.click().click().getAttribute('type').should.become('checkbox'),
          el.getAttribute('type').should.become('checkbox')
        ]);
      });
  });

  it("sendKeys should work", function() {
    var el = browser
      .elementById('the_forms_id')
      .elementById('>', 'unchecked_checkbox');
      return el.sendKeys('X');
  });

   it("clicking submit should work", function() {
    /* jshint evil: true */
    return browser
      .elementById("submit")
      .click()
      .eval("window.location.href")
      .should.eventually.contain("http://");
  });

});
