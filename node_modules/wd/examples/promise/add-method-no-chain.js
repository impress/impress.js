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

// add promise method
wd.addPromiseMethod(
  'elementByCssSelectorWhenReady',
  function(selector, timeout) {
  var browser = this;
  return browser
    .waitForElementByCssSelector(selector, timeout)
    .then(function() {
      return browser.elementByCssSelector(selector);
    });
  }
);

// DO NOT call rewrap after this, this would reset the PromiseChainWebdriver prototype

var browser = wd.promiseRemote();

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
  .init({ browserName: 'chrome' })
  .then(function () {
    return browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
  })
  .then(function () {
    return browser.title().should.become('WD Tests');
  })
  .then(function() {
    return browser
      .elementByCss('#comments')
      .then(function(el) {
        return el.getTagName().should.become('textarea');
      });
  })
  .then(function() {
    return browser.elementByCssSelectorWhenReady('#comments', 2000).should.exist;
  })
  .then(function() {
    return browser.elementByCssSelectorWhenReady('#comments', 2000);
  }).then(function(el) {
    return el
      .type("Bonjour!")
      .then(function() {
        return el.getValue().should.become("Bonjour!");
      });
  })
  .fin(function () { return browser.quit(); })
  .done();
