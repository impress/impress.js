// requires node 0.11
// run with: node --harmony ./examples/promise/harmony.js
//
// This demos how to mix promise chain and generators

/* jshint moz: true, evil: true */

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

var Q = wd.Q;

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

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

Q.spawn(function *() {
  // basic
  try{
    yield browser.init({browserName:'chrome'});
    yield browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
    var title = yield browser.title();
    title.should.equal('WD Tests');
    var linkEl = yield  browser.elementById('i am a link');
    yield linkEl.click();
    var href = yield browser.eval("window.location.href");
    href.should.include('guinea-pig2');
    yield browser.back();
    var commentsEl = yield browser.elementByCss('#comments');
    yield commentsEl.type('Bonjour!');
    var comments = yield commentsEl.getValue();
    comments.should.equal('Bonjour!');
  } finally {
    yield browser.quit();
  }

  // more fancy
  try{
    yield browser
      .init({browserName:'chrome'})
      .get("http://admc.io/wd/test-pages/guinea-pig.html")
      .title().should.become('WD Tests');

    yield  browser
      .elementById('i am a link')
      .click();

    yield browser
      .eval("window.location.href")
      .should.eventually.include('guinea-pig2');

    yield browser.back();

    yield browser
      .elementByCss('#comments')
      .type('Bonjour!')
      .getValue()
      .should.become('Bonjour!');
  } finally {
    yield browser.quit();
  }

});
