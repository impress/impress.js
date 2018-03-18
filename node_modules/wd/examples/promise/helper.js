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

function search(something) {
  return function() {
    return browser
      .elementByCss('input[name=q]')
      .type(something)
      .keys(wd.SPECIAL_KEYS.Return);
  };
}

browser
  .init({browserName: 'chrome'})
  .get('http://www.google.com')
  .then(search('wd'))
  .fin(function() { return browser.sleep(2000).quit(); })
  .done();
