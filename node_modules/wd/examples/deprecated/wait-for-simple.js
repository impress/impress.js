require('colors');
var chai = require("chai");
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

var asserters = wd.asserters; // commonly used asserters

// js to add and remove a child div
var appendChild =
  'setTimeout(function() {\n' +
  ' $("#i_am_an_id").append("<div class=\\"child\\">a waitFor child</div>");\n' +
  '}, arguments[0]);\n';

var removeChildren =
  ' $("#i_am_an_id").empty();\n';

var browser = wd.remote();

// optional extra logging
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(eventType, command, response) {
  console.log(' > ' + eventType.cyan, command, (response || '').grey);
});
browser.on('http', function(meth, path, data) {
  console.log(' > ' + meth.magenta, path, (data || '').grey);
});

browser
  .chain()
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title(function(err, title) { title.should.equal('WD Tests'); })

  // generic waitFor, asserter compulsary
  .execute(removeChildren)
  .execute( appendChild, [500] )
  // without callback
  .waitFor(asserters.textInclude('a waitFor child') , 2000)
  // with callback
  .waitFor(asserters.textInclude('a waitFor child') , 2000, function(err, text) {
    text.should.include('waitFor');
  })

  // waitForElement without asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child" , 2000, function(err, el) {
    el.text(function(err, text) { text.should.equal('a waitFor child'); });
  })

  // waitForElement with element asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child", asserters.textNonEmpty , 2000, function(err, el) {
    el.text(function(err, text) { text.should.equal('a waitFor child'); });
  })

  // isDisplayed asserter
  .execute(removeChildren)
  .execute( appendChild, [500] )
  .waitForElementByCss("#i_am_an_id .child", asserters.isDisplayed , 2000, function(err, el) {
    el.text(function(err, text) { text.should.equal('a waitFor child'); });
  })

  // jsCondition asserter
  .waitFor(asserters.jsCondition('$("#i_am_an_id .child")? true: false') , 2000, function(err, status) {
    status.should.be.ok;
  })

  .sleep(2000)
  .quit();

