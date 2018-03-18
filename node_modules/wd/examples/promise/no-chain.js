require('colors');
var chai = require("chai");
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

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
  .then(function () { return browser.title();})
  .then(function (title) {
    title.should.equal('WD Tests');
    return browser.elementById('i am a link');
  })
  .then(function (el) { return browser.clickElement(el); })
  .then(function () {
    /* jshint evil: true */
    return browser.eval("window.location.href");
  })
  .then(function (href) { href.should.include('guinea-pig2'); })
  .fin(function () { return browser.quit(); })
  .done();
