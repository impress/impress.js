// requires node 0.11
// run with: mocha --harmony examples/promise/mocha-harmony.js

/* global describe, it, before , beforeEach, after*/
/* jshint moz: true, evil: true */

require('colors');
var chai = require("chai");
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

var wrap = wd.Q.async;

describe("mocha with generators", function() {
  this.timeout(10000);
  var browser;

  before(wrap(function *() {
    browser = wd.promiseChainRemote();
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
    yield browser.init({browserName:'chrome'});
  }));

  beforeEach(wrap(function*() {
    yield browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
  }));

  after(wrap(function*() {
    yield browser.quit();
  }));

  it("should retrieve the page title", wrap(function *() {
    var title = yield browser.title();
    title.should.equal("WD Tests");
  }));

  it("submit element should be clicked", wrap(function *() {
    var submitEl = yield browser.elementById("submit");
    yield submitEl.click();
    var location = yield browser.eval("window.location.href");
    location.should.include("&submit");
  }));

});

