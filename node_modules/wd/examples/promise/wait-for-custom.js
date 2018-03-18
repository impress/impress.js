require('colors');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

var Asserter = wd.Asserter; // asserter base class

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// js to add and remove a child div
var appendChild =
  'setTimeout(function() {\n' +
  ' $("#i_am_an_id").append("<div class=\\"child\\">a waitFor child</div>");\n' +
  '}, arguments[0]);\n';

var removeChildren =
  ' $("#i_am_an_id").empty();\n';

// tagging chai assertion errors for retry
var tagChaiAssertionError = function(err) {
  // throw error and tag as retriable to poll again
  err.retriable = err instanceof chai.AssertionError;
  throw err;
};

// simple asserter, just making sure that the element (or browser)
// text is non-empty and returning the text.
// It will be called until the promise is resolved with a defined value.
var customTextNonEmpty = new Asserter(
  function(target) { // browser or el
    return target
      .text().then(function(text) {
        // condition implemented with chai within a then
        text.should.have.length.above(0);
        return text; // this will be returned by waitFor
                     // and ignored by waitForElement.
      })
      .catch(tagChaiAssertionError); // tag errors for retry in catch.
  }
);

// another simple element asserter
var customIsDisplayed = new Asserter(
  function(el) {
    return el
      .isDisplayed().should.eventually.be.ok
      .catch(tagChaiAssertionError);
  }
);

// asserter generator
var customTextInclude = function(text) {
  return new Asserter(
    function(target) { // browser or el
      return target
        // condition implemented with chai as promised
        .text().should.eventually.include(text)
        .text() // this will be returned by waitFor
                // and ignored by waitForElement.
        .catch(tagChaiAssertionError); // tag errors for retry in catch.
    }
  );
};

// optional add custom method
wd.PromiseChainWebdriver.prototype.waitForElementWithTextByCss = function(selector, timeout, pollFreq) {
  return this
    .waitForElementByCss(selector, customTextNonEmpty , timeout, pollFreq);
};

var browser = wd.promiseChainRemote();

browser
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title().should.become('WD Tests')

  // generic waitFor, asserter compulsary
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitFor(customTextInclude('a waitFor child') , 2000)
  .should.eventually.include('a waitFor child')

  // waitForElement with element asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child", customTextNonEmpty , 2000)

  // another asserter
  .waitForElementByCss("#i_am_an_id .child", customIsDisplayed , 2000)
  .text().should.become('a waitFor child')

  // custom method
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementWithTextByCss("#i_am_an_id .child", 2000)
  .text().should.become('a waitFor child')

  .fin(function() { return browser.quit(); })
  .done();
