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

var asserters = wd.asserters; // commonly used asserters

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// js to add and remove a child div
var appendChild =
  'setTimeout(function() {\n' +
  ' $("#i_am_an_id").append("<div class=\\"child\\">a waitFor child</div>");\n' +
  '}, arguments[0]);\n';

var removeChildren =
  ' $("#i_am_an_id").empty();\n';

var browser = wd.promiseChainRemote();

browser
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title().should.become('WD Tests')

  // generic waitFor, asserter compulsary
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitFor(asserters.textInclude('a waitFor child') , 2000)
  .should.eventually.include('a waitFor child')

  // waitForElement without asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child" , 2000)
  .text().should.become('a waitFor child')

  // waitForElement with element asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child", asserters.textNonEmpty , 2000)
  .text().should.become('a waitFor child')

  // isDisplayed asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child", asserters.isDisplayed , 2000)
  .text().should.become('a waitFor child')

  // jsCondition asserter
  .waitFor(asserters.jsCondition('$("#i_am_an_id .child")? true: false') , 2000)
  .should.eventually.be.ok

  .fin(function() { return browser.quit(); })
  .done();
