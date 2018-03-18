require('colors');
var chai = require('chai');
chai.should();

var wd;
try {
  wd = require('wd');
} catch( err ) {
  wd = require('../../lib/main');
}

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

/* jshint evil: true */
browser
  .chain()
  .init({ browserName: 'chrome' })
  .get("http://admc.io/wd/test-pages/guinea-pig.html")
  .title(function(err, title) {
    title.should.include('WD');
  })
  .queueAddAsync(function(cb) {
    console.log("simulating async call, waiting 500ms");
    setTimeout(function() {
      console.log("500ms expired");
      cb(null);
    }, 500);
  })
  .elementById('i am a link', function(err, el) {
    //we should make clickElement not require a callback
    browser.next('clickElement', el, function() {
      console.log("did the click!");
    });
  })
  .eval("window.location.href", function(err, href) {
    href.should.include('guinea-pig2');
  })
  .quit();
