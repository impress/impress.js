require('../helpers/setup');

var path = require('path');

describe('element ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['element.text'] =
    '<div id="theDiv">I am some text</div>';
  it('element.text', function() {
    return browser.elementById("theDiv").then(function(el) {
      el.text().should.eventually.include("I am some text");
    });
  });

  partials['element.textPresent'] =
    '<div id="theDiv">I am some text</div>';
  it('element.textPresent', function() {
    return browser.elementById("theDiv").then(function(el) {
      return Q.all([
        el.textPresent("some text").should.eventually.be.ok,
        el.textPresent("wrong text").should.eventually.not.be.ok
      ]);
    });
  });

  partials['element.click'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.click', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.click(function() {\n' +
        '   a.html("clicked");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv a').text().should.become('not clicked')
      .elementByCss('#theDiv a').then(function(el) {
        return el.click();
      })
      .elementByCss('#theDiv a').text().should.become('clicked');
  });

  partials['element.doubleClick'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.doubleClick', function() {
    return browser
      .execute(
        'jQuery( function() {\n' +
        ' a = $(\'#theDiv a\');\n' +
        ' a.dblclick(function() {\n' +
        '   a.html("doubleclicked");\n' +
        '   return false;\n' +
        ' });\n' +
        '});\n'
      )
      .elementByCss('#theDiv a').text().should.become('not clicked')
      .elementByCss('#theDiv a').then(function(el) {
        return el.doubleClick();
      })
      .elementByCss('#theDiv a').text().should.become('doubleclicked');
  });

  partials['element.moveTo'] =
    '<div id="theDiv"><a href="#">not clicked</a></div>';
  it('element.moveTo', function() {
    return browser
      .elementByCss('#theDiv a').then(function(el) {
        return el.moveTo();
      })
      .elementByCss('#theDiv a').then(function(el) {
        return el.moveTo(10, 10);
      });
      // todo: write better tests using hover
  });

  partials['element.getTagName'] =
    '<div id="theDiv">\n' +
    '  <input type="text">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('element.getTagName', function() {
    return browser
      .elementByCss("#theDiv input").then(function(el) {
        return el.getTagName().should.become('input');
      })
      .elementByCss("#theDiv a").then(function(el) {
        return el.getTagName().should.become('a');
      });
  });

  partials['element.isDisplayed'] =
    '<div id="theDiv">\n' +
    '  <input class="displayed" type="text" value="Hello">\n' +
    '  <input class="hidden" type="hidden" value="Hello">\n' +
    '</div>\n';
  it('element.isDisplayed', function() {
    return browser
      .elementByCss("#theDiv .displayed").then(function(el) {
        return Q.all([
            el.isDisplayed().should.eventually.be.ok,
            el.displayed().should.eventually.be.ok,
          ]);
      })
      .elementByCss("#theDiv .hidden").then(function(el) {
        return el.isDisplayed().should.eventually.not.be.ok;
      });
  });

  partials['element.isEnabled'] =
    '<div id="theDiv">\n' +
    '  <input class="enabled" type="text" value="Hello">\n' +
    '  <input class="disabled" type="text" value="Hello" disabled>\n' +
    '</div>\n';
  it('element.isEnabled', function() {
    return browser
      .elementByCss("#theDiv .enabled").then(function(el) {
        return Q.all([
            el.isEnabled().should.eventually.be.ok,
            el.enabled().should.eventually.be.ok,
          ]);
      })
      .elementByCss("#theDiv .disabled").then(function(el) {
        return el.isEnabled().should.eventually.not.be.ok;
      });
  });

  partials['element.getComputedCss'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('element.getComputedCss', function() {
    return browser
      .elementByCss("#theDiv a").then(function(el) {
        return Q.all([
            el.getComputedCss('color')
              .should.eventually.have.length.above(0),
            el.getComputedCSS('color')
              .should.eventually.have.length.above(0)
          ]);
      })
      ;
  });

  it('element.equals', function() {
    return Q.all([
      browser.elementByTagName("body"),
      browser.elementByXPath("//body")
    ]).then(function(els) {
      return els[0].equals(els[1]).should.eventually.be.ok;
    });
  });

  partials['element.getAttribute'] =
    '<div id="theDiv" att="42">Attribute</div>\n';
  it('element.getAttribute', function() {
    return browser
      .elementById("theDiv").then(function(el) {
        return el.getAttribute("att").should.become("42");
      });
  });

  partials['element.getValue'] =
    '<div id="theDiv" value="qwerty">Value</div>\n';
  it('element.getValue', function() {
    return browser
      .elementById("theDiv").then(function(el) {
        return el.getValue().should.become("qwerty");
      });
  });

  partials['element.type'] =
    '<div id="theDiv"><input></input></div>\n';
  it('element.type', function() {
    return browser
      .elementByCss("#theDiv input").getValue().should.become("")
      .elementByCss("#theDiv input").then(function(el) {
        return el
          .type('hello')
          .getValue()
          .should.become("hello");
      });
  });

  partials['element.keys'] =
    '<div id="theDiv"><input></input></div>\n';
  it('element.keys', function() {
    return browser
      .elementByCss("#theDiv input").getValue().should.become("")
      .elementByCss("#theDiv input").then(function(el) {
        return el.click().keys('hello').getValue().should.become("hello");
      });
  });


  if(!env.SAUCE) {
    // weird stuff with typing on Sauce at the moment, commenting
    // until browser has been upgraded.
    partials['element.sendKeys'] =
      '<div id="theDiv">\n' +
      '  <textarea></textarea>\n' +
      '  <input></input>\n' +
      '</div>\n';
    it('element.sendKeys', function() {
      return browser
        .elementByCss("#theDiv textarea").then(function(el) {
          var sequence = [
            function() { return el.sendKeys("keys").getValue().should.become("keys"); },
            function() { return el.sendKeys([100136872.21, {}])
              .getValue().should.become("keys100136872.21" + {}.toString()); }
          ];
          return sequence.reduce(Q.when, new Q());
        })
        .elementByCss("#theDiv input").then(function(el) {
          var filePath = path.resolve("test/mocha.opts");
          return el.sendKeys(filePath).getValue().then(function(val) {
            val.should.include('mocha.opts');
            // check that the path was transformed, as the file was uploaded
            val.should.not.include(filePath);
          });
        });
    });
  }

  partials['element.clear'] =
    '<div id="theDiv"><textarea>Not clear</textarea></div>\n';
  it('element.clear', function() {
    return browser
      .elementByCss("#theDiv textarea").then(function(el) {
        var sequence = [
          function() { return el.getValue().should.become("Not clear"); },
          function() { return el.clear().getValue().should.become(""); }
        ];
        return sequence.reduce(Q.when, new Q());
      });
  });

  partials['element.elementByTagName'] =
    '<div id="theDiv"><a href="#">a link</a></div>\n' +
    '<div id="theDiv2"><textarea></textarea></div>\n';
  it('element.elementByTagName', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el.elementByTagName("a").text().should.become("a link");
      })
      .elementById("theDiv").then(function(el) {
        return el.elementByTagName("textarea").should.be.rejectedWith(/status: 7/);
      })
      ;
  });

  partials['element.elementsByTagName'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a link 1</a>\n' +
    '  <a href="#">a link 2</a>\n' +
    '  <a href="#">a link 3</a>\n' +
    '</div>\n' +
    '<div id="theDiv2"><textarea></textarea></div>\n';
  it('element.elementsByTagName', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el.elementsByTagName("a").should.eventually.have.length(3);
      })
      .elementById("theDiv").then(function(el) {
        return el.elementsByTagName("textarea").should.eventually.deep.equal([]);
      });
  });

  partials['element.sleep'] =
    '<div id="theDiv"></div>\n' +
  it('element.sleep', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el
          .sleep(100).should.be.fulfilled
          .sleep(100).should.be.fulfilled;
      });
  });

  partials['element.noop'] =
    '<div id="theDiv"></div>\n' +
  it('element.noop', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el
          .noop().should.be.fulfilled
          .sleep(100).should.be.fulfilled
          .noop().should.be.fulfilled;
      });
  });

  partials['element.chain (promise)'] =
    '<div id="theDiv"></div>\n' +
  it('element.chain (promise)', function() {
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el
          .chain().should.be.fulfilled
          .chain()
          .sleep(100).should.be.fulfilled;
      });
  });

  partials['element.resolve'] =
    '<div id="theDiv"></div>\n' +
  it('element.resolve', function() {
    var deferred = Q.defer();
    setTimeout(function() {
      deferred.resolve('123');
    }, 250);
    return browser
      .setImplicitWaitTimeout(0)
      .elementById("theDiv").then(function(el) {
        return el
          .resolve(deferred.promise)
          .noop()
          .resolve(deferred.promise)
          .should.become('123');
      });
  });
});
