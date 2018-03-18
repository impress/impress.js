require('../helpers/setup');

var imageinfo = require('imageinfo');
var path = require('path');
var fs = require('fs');
var tmp = require('../../lib/tmp');

describe('api-various ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['browser.getLocation'] =
    '<div id="theDiv">I\'ve got a location</div>\n';
  it('browser.getLocation', function() {
    return browser
      .elementByCss("#theDiv").then(function(el) {
        return browser
          .getLocation(el).then(function(location) {
            should.exist(location.x);
            should.exist(location.y);
          });
      })
      .elementByCss("#theDiv").getLocation().then(function(location) {
        should.exist(location.x);
        should.exist(location.y);
      });
  });

  partials['browser.getLocationInView'] =
    '<div id="theDiv">I\'ve got a location</div>\n';
  it('browser.getLocationInView', function() {
    return browser
      .elementByCss("#theDiv").then(function(el) {
        return browser
          .getLocationInView(el).then(function(location) {
            should.exist(location.x);
            should.exist(location.y);
          });
      })
      .elementByCss("#theDiv").getLocationInView().then(function(location) {
        should.exist(location.x);
        should.exist(location.y);
      });
  });

  partials['browser.getSize'] =
    '<div id="theDiv">I\'ve got a good size!</div>\n';
  it('browser.getSize', function() {
    return browser
      .elementByCss("#theDiv").then(function(el) {
        return browser
          .getSize(el).then(function(size) {
            should.exist(size.width);
            should.exist(size.height);
          });
      })
      .elementByCss("#theDiv").getSize().then(function(size) {
        should.exist(size.width);
        should.exist(size.height);
      });
  });

  partials['browser.acceptAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.acceptAlert', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss("#theDiv a").click()
      .acceptAlert();
  });

  partials['browser.dismissAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.dismissAlert', skip('chrome'), function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss("#theDiv a").click()
      .dismissAlert();
  });

  it('browser.takeScreenshot', function() {
    return browser
      .takeScreenshot().then(function(res) {
        var data = new Buffer(res, 'base64');
        var img = imageinfo(data);
        img.should.not.be.false;
        img.format.should.equal('PNG');
        img.width.should.not.equal(0);
        img.height.should.not.equal(0);
      });
  });

  it('browser.saveScreenshot', function() {
    var mydir = path.join(tmp.tmpdir , 'myscreenshot');
    try { fs.mkdirSync(mydir); } catch(ign) {}

    return browser
      .saveScreenshot( mydir + '/abc.png')
      .should.become( mydir + '/abc.png')
      .then(function() {
        var res;
        try{
          res = fs.readFileSync(mydir + '/abc.png', {encoding: 'base64'});
        }catch(err){
          // for 0.8
          res = fs.readFileSync(mydir + '/abc.png');
        }
        var data = new Buffer(res, 'base64');
        var img = imageinfo(data);
        img.should.not.be.false;
        img.format.should.equal('PNG');
        img.width.should.not.equal(0);
        img.height.should.not.equal(0);
      })
      .saveScreenshot( mydir + '/aaa')
      .should.become( mydir + '/aaa.png')
      .saveScreenshot(mydir + '/')
        .should.eventually.match(/\/myscreenshot\/screenshot-\w+\.png$/)
      .saveScreenshot()
        .should.eventually.match(/\/screenshot-\w+\.png$/);
  });

  // cookie don't seem to work in explorer
  it('browser.<cookie methods>', skip('explorer'), function() {
    return browser
      .deleteAllCookies()
      .allCookies().should.eventually.deep.equal([])
      .setCookie({
        name: 'fruit1',
        value: 'apple'
      })
      .allCookies().then(function(res) {
        res.should.have.length(1);
        res.filter(function(c) {
          return c.name === 'fruit1' && c.value === 'apple';
        }).should.have.length(1);
      })
      .setCookie({
        name: 'fruit2',
        value: 'pear'
      })
      .allCookies().then(function(res) {
        res.should.have.length(2);
        res.filter(function(c) {
          return c.name === 'fruit1' && c.value === 'apple';
        }).should.have.length(1);
      })
      .setCookie({
        name: 'fruit3',
        value: 'orange'
      })
      .allCookies().should.eventually.have.length(3)
      .deleteCookie('fruit2')
      .allCookies().then(function(res) {
        res.should.have.length(2);
        res.filter(function(c) {
          return c.name === 'fruit2' && c.value === 'pear';
        }).should.have.length(0);
      })
      .deleteAllCookies()
      .allCookies().should.eventually.deep.equal([])
      // not sure how to test this
      .setCookie({
        name: 'fruit3',
        value: 'orange',
        secure: true
      })
      .deleteAllCookies();
  });

  it('browser.<localStorage methods>', function() {
    return browser
      .setLocalStorageKey('foo', 'bar')
      .getLocalStorageKey('foo').should.become('bar')
      .setLocalStorageKey("bar", "ham")
      .removeLocalStorageKey("bar")
      .getLocalStorageKey("bar").should.eventually.be.a('null')
      .setLocalStorageKey("ham", "foo")
      .clearLocalStorage()
      .getLocalStorageKey("ham").should.eventually.be.a('null');
  });

  it('browser.uploadFile', function() {
    return browser
      .uploadFile("test/mocha.opts").should.eventually.include('mocha.opts')
      .uploadFile("test/midway/assets/tux.jpg").should.eventually.include('tux.jpg');
  });


  partials['browser.active'] =
    '<div id="theDiv">\n' +
    '  <input class="i1" type="text" value="input 1">\n' +
    '  <input class="i2" type="text" value="input 2">\n' +
    '</div>\n';
  it('browser.active', function() {
    return browser
      .elementByCss("#theDiv .i1").click()
      .active().getValue().should.become("input 1")
      .elementByCss("#theDiv .i2").click()
      .active().getValue().should.become("input 2");
  });

  partials['browser.isVisible'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('browser.isVisible', function() {
    return browser
      .elementByCss("#theDiv a").then(function(el) {
        return browser
          .isVisible(el).should.eventually.be.ok;
      })
      .elementByCss("#theDiv a").isVisible().should.eventually.be.ok
      .isVisible("css selector", "#theDiv a").should.eventually.be.ok
      .execute('$("#theDiv a").hide();')
      .elementByCss("#theDiv a").isVisible().should.eventually.not.be.ok
      .isVisible("css selector", "#theDiv a").should.eventually.not.be.ok;
  });

  partials['browser.isDisplayed'] =
    '<div id="theDiv">\n' +
    '  <input class="displayed" type="text" value="Hello">\n' +
    '  <input class="hidden" type="hidden" value="Hello">\n' +
    '</div>\n';
  it('browser.isDisplayed', function() {
    return browser
      .elementByCss('#theDiv .displayed').then(function(el) {
        return browser.isDisplayed(el).should.eventually.be.ok;
      })
      .elementByCss('#theDiv .hidden').then(function(el) {
        return browser.isDisplayed(el).should.eventually.not.be.ok;
      })
      .elementByCss('#theDiv .displayed').isDisplayed().should.eventually.be.ok
      .elementByCss('#theDiv .hidden').isDisplayed().should.eventually.not.be.ok;
  });

  partials['browser.isEnabled'] =
    '<div id="theDiv">\n' +
    '  <input class="enabled" type="text" value="Hello">\n' +
    '  <input class="disabled" type="text" value="Hello" disabled>\n' +
    '</div>\n';
  it('browser.isEnabled', function() {
    return browser
      .elementByCss('#theDiv .enabled').then(function(el) {
        return browser.isEnabled(el).should.eventually.be.ok;
      })
      .elementByCss('#theDiv .disabled').then(function(el) {
        return browser.isEnabled(el).should.eventually.not.be.ok;
      })
      .elementByCss('#theDiv .enabled').isEnabled().should.eventually.be.ok
      .elementByCss('#theDiv .disabled').isEnabled().should.eventually.not.be.ok;
  });

  it('browser.sleep', function() {
    return browser
      .sleep(100).should.be.fulfilled
      .sleep(100).should.be.fulfilled;
  });

  it('browser.noop', function() {
    return browser
      .noop().should.be.fulfilled
      .sleep(100).should.be.fulfilled
      .noop().should.be.fulfilled;
  });

  it('browser.chain (promise chain)', function() {
    return browser
      .chain().should.be.fulfilled
      .chain().sleep(0).should.be.fulfilled;
  });

  it('browser.resolve', function() {
    var deferred = Q.defer();
    setTimeout(function() {
      deferred.resolve('123');
    }, 250);
    return browser
      .resolve(deferred.promise)
      .noop()
      .resolve(deferred.promise)
        .should.become('123');
  });

  it('browser.getSessionId', function() {
    return browser.getSessionId(100).should.eventually.have.length.above(0);
  });

  it('browser.setHttpTimeout', function() {
    return browser
      .setHttpTimeout(env.HTTP_TIMEOUT || 60000).should.be.fulfilled
         .setHTTPInactivityTimeout(env.HTTP_TIMEOUT || 60000).should.be.fulfilled
         .setHttpTimeout(env.HTTP_TIMEOUT).should.be.fulfilled;
  });

  // get item from array, starting at 0
  partials['at'] =
    '<div id="theDiv">\n' +
    '<div class=\'inside\'>first</div>\n' +
    '<div class=\'inside\'>second</div>\n' +
    '<div class=\'inside\'>third</div>\n' +
    '</div>';
  it('at', function() {
    return browser
      .elementsByCss('.inside').at(0).text()
        .should.become('first')
      .elementsByCss('.inside').at(1).text()
        .should.become('second')
      .elementsByCss('.inside').at(2).text()
        .should.become('third');
  });

  // get item from array, starting at 0
  partials['nth'] =
    '<div id="theDiv">\n' +
    '<div class=\'inside\'>first</div>\n' +
    '<div class=\'inside\'>second</div>\n' +
    '<div class=\'inside\'>third</div>\n' +
    '</div>';
  it('nth', function() {
    return browser
      .elementsByCss('.inside').nth(1).text()
        .should.become('first')
      .elementsByCss('.inside').nth(2).text()
        .should.become('second')
      .elementsByCss('.inside').nth(3).text()
        .should.become('third');
  });

  // get item from array, starting at 0
  partials['first/second/third/last'] =
    '<div id="theDiv">\n' +
    '<div class=\'inside\'>first</div>\n' +
    '<div class=\'inside\'>second</div>\n' +
    '<div class=\'inside\'>third</div>\n' +
    '</div>';
  it('first/second/third/last', function() {
    return browser
      .elementsByCss('.inside').first().text()
        .should.become('first')
      .elementsByCss('.inside').second().text()
        .should.become('second')
      .elementsByCss('.inside').third().text()
        .should.become('third')
      .elementsByCss('.inside').last().text()
        .should.become('third');
  });

  // print
  partials['print'] =
    '<div id="theDiv">Some text.</div>\n';
  it('print', function() {
    return browser
      .elementById('theDiv').text().print()
      .elementById('theDiv').text().print("prepend: ");
  });

  // print error
  it('printError', function() {
    return browser
      .elementById('unknown').printError().
        should.be.rejected;
  });

  it('err.inspect', function() {
    return browser
      .safeExecute("invalid-code> here").then(
        function() { assert(false); },
        function(err) {
          should.exist(err);
          (err instanceof Error).should.be.true;
          (err.inspect().length <= 510).should.be.true;
        }
      );
  });

});
