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

var PromiseSimple = require('promise-simple');

// enables chai assertion chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

function altSleepAndOk(ms) {
  var promise = PromiseSimple.defer();
  setTimeout(function() {
    promise.resolve('OK');
  }, ms);
  return promise;
}

// adding custom promise chain method
wd.addPromiseChainMethod(  'altSleepAndOk', altSleepAndOk );

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
  .resolve(altSleepAndOk(200))
  .should.become('OK')
  .init({browserName:'chrome'})
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .altSleepAndOk(200)
  .should.become('OK')
  .title()
  .should.become('WD Tests')
  .fin(function() { return browser.quit(); })
  .done();

