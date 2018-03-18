require('../helpers/setup');

describe('api-nav ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  if(!env.SAUCE){ // page timeout seems to be disabled in sauce
    it('browser.setPageLoadTimeout', function() {
      var defaultTimeout = (env.DESIRED.browserName === 'firefox')? -1 : env.BASE_TIME_UNIT;
      return browser
        .setPageLoadTimeout(env.BASE_TIME_UNIT / 2)
        .setPageLoadTimeout(defaultTimeout);
    });
  }

  partials['browser.get'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.get', function() {
    return browser.text().
      should.eventually.include('Hello World!');
  });

  it('browser.url', function() {
    return browser
      .url().should.eventually.include("http://")
      .url().should.eventually.include("test-page");
  });

  it('browser.refresh', function() {
    return browser.refresh();
  });

  it('back/forward', function() {
    return browser.url().then(function(url) {
      return browser
        .get( url + '&thePage=2')
        .url().should.eventually.include("&thePage=2")
        .back()
        .url().should.eventually.not.include("&thePage=2")
        .forward()
        .url().should.eventually.include("&thePage=2");
    });
  });

  partials['browser.setImplicitWaitTimeout'] =
    '<div id="setWaitTimeout"></div>';
  it('browser.setImplicitWaitTimeout', function() {
    var startMs = Date.now();
    return browser
      // return error 7 when timeout set to 0
      .setImplicitWaitTimeout(0)
      .execute( prepareJs(
        'setTimeout(function() {\n' +
        '$("#setWaitTimeout").html("<div class=\\"child\\">a child</div>");\n' +
        '}, arguments[0]);' ), [env.BASE_TIME_UNIT])
      .then(function() {
        // if selenium was too slow skip the test.
        if(Date.now() - startMs < env.BASE_TIME_UNIT){
          return browser
            .elementByCss('#setWaitTimeout .child')
            .should.be.rejectedWith(/status\: 7/);
        }
      })
      .setImplicitWaitTimeout(2 * env.BASE_TIME_UNIT)
      .elementByCss('#setWaitTimeout .child')
      .setImplicitWaitTimeout(0);
  });

  partials['browser.clickElement'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>\n';
  it('browser.clickElement', function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   a.html(\'clicked\');\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss("#theDiv a").then(function(el) {
        return browser
          .text(el).should.become("not clicked")
          .clickElement(el)
          .text(el).should.become("clicked")
          ;
      });
  });

  partials['browser.moveTo'] =
    '<div id="theDiv">\n' +
    '  <div class="div1" href="#">div 1</div>\n' +
    '  <div class="div2" href="#">div 1</div>\n' +
    '  <div class="current"></div>\n' +
    '</div>\n';
  it('browser.moveTo', skip('ios', 'android'), function() {
    if(true || env.BROWSER === 'explorer') {
      // cannot get hover to work in explorer
      return browser
        .elementByCss('#theDiv .div1').then(function(div1) {
          return browser
            .moveTo(div1).should.be.fulfilled;
        })
        .elementByCss('#theDiv .div1')
        .moveTo().should.be.fulfilled;
    } else {
      return browser
        .execute( prepareJs(
          'jQuery( function() {\n' +
          ' var div1 = $(\'#theDiv .div1\');\n' +
          ' var div2 = $(\'#theDiv .div2\');\n' +
          ' var current = $(\'#theDiv .current\');\n' +
          ' div1.hover(function() {\n' +
          '   current.html(\'div 1\');\n' +
          ' });\n' +
          ' div2.hover(function() {\n' +
          '   current.html(\'div 2\');\n' +
          ' });\n' +
          '});\n')
        )
        .elementByCss('#theDiv .current').text().should.become('')
        .elementByCss('#theDiv .div1').then(function(div1) {
          return browser
            .moveTo(div1)
            .elementByCss('#theDiv .current').text().should.become('div 1');
        })
        .elementByCss('#theDiv .div2').then(function(div2) {
          return browser
            .moveTo(div2)
            .elementByCss('#theDiv .current').text().should.become('div 2');
        })
         .elementByCss('#theDiv .div1').then(function(div1) {
          return browser
            .moveTo(div1)
            .elementByCss('#theDiv .current').text().should.become('div 1');
        });
    }
  });

  partials['browser.buttonDown/browser.buttonUp'] =
    '<div id="theDiv"><a>hold me</a><div class="res"></div></div>\n';
  it('browser.buttonDown/browser.buttonUp', skip('ios', 'android'), function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' res = $(\'#theDiv .res\');\n' +
        ' current = $(\'#theDiv .current\');\n' +
        ' a.mousedown(function() {\n' +
        '   res.html(\'button down\');\n' +
        ' });\n' +
        ' a.mouseup(function() {\n' +
        '   res.html(\'button up\');\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss('#theDiv .res').text().should.become('')
      .elementByCss('#theDiv a').then(function(el) {
        return browser
          .moveTo(el)
          .buttonDown()
          .elementByCss('#theDiv .res').text().should.become('button down')
          .buttonUp()
          .elementByCss('#theDiv .res').text().should.become('button up')
          .moveTo(el)
          .buttonDown(0)
          .elementByCss('#theDiv .res').text().should.become('button down')
          .buttonUp(0)
          .elementByCss('#theDiv .res').text().should.become('button up');
      });
  });

  partials['browser.click'] =
    '<div id="theDiv">\n' +
    '  <div class="numOfClicks">not clicked</div>\n' +
    '  <div class="buttonNumber">not clicked</div>\n' +
    '</div>\n';
  it('browser.click', skip('ios', 'android'), function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' var numOfClick = 0;\n' +
        ' numOfClicksDiv = $(\'#theDiv .numOfClicks\');\n' +
        ' buttonNumberDiv = $(\'#theDiv .buttonNumber\');\n' +
        ' current = $(\'#theDiv .current\');\n' +
        ' numOfClicksDiv.mousedown(function(eventObj) {\n' +
        '   var button = eventObj.button;\n' +
        '   if(button === undefined) {button="default";}\n' +
        '   numOfClick++;\n' +
        '   numOfClicksDiv.html("clicked " + numOfClick);\n' +
        '   buttonNumberDiv.html(button);\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss('#theDiv .numOfClicks').text().should.become('not clicked')
      .elementByCss('#theDiv .buttonNumber').text().should.become('not clicked')
      .elementByCss('#theDiv .numOfClicks').then(function(el) {
        return browser
          .moveTo(el)
          .click(0)
          .elementByCss('#theDiv .numOfClicks').text()
            .should.become('clicked 1')
          .elementByCss('#theDiv .buttonNumber').text()
            .should.become('0')
          .then(function() {
            if(!env.SAUCE){ // sauce complains when button is missing
              browser
                .click()
                .elementByCss('#theDiv .numOfClicks').text()
                  .should.become('clicked 2')
                .elementByCss('#theDiv .buttonNumber').text()
                  .should.become('0');
            }
          });
      });
  });

  partials['browser.doubleclick'] =
    '<div id="theDiv">\n' +
    '  <div>not clicked</div>\n' +
    '</div>\n';
  it('browser.doubleclick', skip('ios', 'android'), function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' div = $(\'#theDiv div\');\n' +
        ' div.dblclick(function() {\n' +
        '   div.html("doubleclicked");\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss('#theDiv div').text().should.become('not clicked')
      .elementByCss('#theDiv div').then(function(div) {
        return browser
          .moveTo(div)
          .doubleclick()
          .elementByCss('#theDiv div').text().should.become('doubleclicked');
      });
  });

  if(!env.SAUCE) {
    // weird stuff with keying spaces on Sauce at the moment, commenting
    // until browser has been upgraded.
    partials['browser.clear'] =
      '<div id="theDiv">\n' +
      '  <input type="text" value="not cleared">\n' +
      '</div>\n';
    it('browser.clear', function() {
      return browser
        .waitForElementByCss("#theDiv input", 5000).then(function(el) {
          return browser
            .getValue(el).should.become('not cleared')
            .clear(el)
            .getValue(el).should.become('');
        })
        .elementByCss("#theDiv input").type("not cleared")
        .getValue().should.become('not cleared')
        .elementByCss("#theDiv input").clear().getValue().should.become('');
    });    
  }

  it('browser.title', function() {
    return browser.title().should.eventually.include("WD Tests");
  });

  partials['browser.acceptAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.acceptAlert', skip('ios', 'android'), function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss("#theDiv a").click()
      .acceptAlert();
  });

  partials['browser.dismissAlert'] =
    '<div id="theDiv"><a>click me</a></div>\n';
  it('browser.dismissAlert', skip('chrome', 'ios', 'android'), function() {
    return browser
      .execute( prepareJs(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   alert("coffee is running out");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n')
      )
      .elementByCss("#theDiv a").click()
      .dismissAlert();
  });

});
