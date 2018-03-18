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

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

// adding custom promise chain method
wd.addPromiseChainMethod(
  'elementByCssSelectorWhenReady',
  function(selector, timeout) {
    return this
      .waitForElementByCssSelector(selector, timeout)
      .elementByCssSelector(selector);
  }
);

var browser = wd.promiseChainRemote();

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
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title()
  .should.become('WD Tests')
  .elementByCssSelector('#comments').getTagName().should.become('textarea')
  .elementByCssSelectorWhenReady('#comments', 2000)
    .should.eventually.exist
  .elementByCssSelectorWhenReady('#comments', 2000)
    .type('Bonjour!').getValue().should.become('Bonjour!')
  .fin(function() { return browser.quit(); })
  .done();

