/* global describe, it, before , beforeEach, after*/

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

describe('mocha spec examples', function() {
  this.timeout(10000);

  // returning promises and chai-as-promised is the best way
  describe("using promises and chai-as-promised", function() {
    var browser;

    before(function() {
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
      return browser
        .init({browserName:'chrome'});
    });

    beforeEach(function() {
      return browser.get("http://admc.io/wd/test-pages/guinea-pig.html");
    });

    after(function() {
      return browser
        .quit();
    });

    it("should retrieve the page title", function() {
      return browser
        .title().should.become("WD Tests");
    });

    it("submit element should be clicked", function() {
      /* jshint evil: true */
      return browser
        .elementById("submit")
        .click()
        .eval("window.location.href").should.eventually.include("&submit");
    });
  });

  // regular mocha usage is also an option
  describe("regular mocha usage", function() {
    var browser;

    before(function(done) {
      browser = wd.promiseChainRemote();
      //browser._debugPromise();
      browser.on('status', function(info) {
        console.log(info);
      });
      browser.on('command', function(meth, path, data) {
        console.log(' > ' + meth, path, data || '');
      });
      browser
        .init({browserName:'chrome'})
        .nodeify(done);  //same as : .then(function() { done(); });
    });

    beforeEach(function(done) {
      browser
        .get("http://admc.io/wd/test-pages/guinea-pig.html")
        .nodeify(done);
    });

    after(function(done) {
      browser
        .quit()
        .nodeify(done);
    });

    it("should retrieve the page title", function(done) {
      browser
        .title()
        .then(function(title) {
          title.should.equal("WD Tests");
        })
        .nodeify(done);
    });

    it("submit element should be clicked", function(done) {
      /* jshint evil: true */
      browser
        .elementById("submit")
        .click()
        .eval("window.location.href")
        .then(function(location) {
          location.should.include("&submit");
        })
        .nodeify(done);
    });
  });

});
