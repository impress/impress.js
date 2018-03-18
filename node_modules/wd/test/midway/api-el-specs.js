require('../helpers/setup');

describe('api-el ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['browser.element'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.element', function() {
    var seq = [
      function() { 
        return browser.element("name", "theDiv").should.eventually.exist; },
      function() { 
        return browser.element("name", "theDiv2").should.be.rejectedWith(/status: 7/); },      
    ];
    return seq.reduce(Q.when, new Q());
    // return Q.all([
    //   browser.element("name", "theDiv").should.eventually.exist,
    //   browser.element("name", "theDiv2").should.be.rejectedWith(/status: 7/)
    // ]);
  });

  partials['browser.elementOrNull'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.elementOrNull', function() {
    return browser
      .elementOrNull("name", "theDiv").should.eventually.exist
      .elementOrNull("name", "theDiv2").should.eventually.be.a('null');
  });

  partials['browser.elementIfExists'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.elementIfExists', function() {
    return browser
      .elementIfExists("name", "theDiv").should.eventually.exist
      .elementIfExists("name", "theDiv2").should.eventually.be.a('undefined');
  });

  partials['browser.hasElement'] =
    '<div name="theDiv">Hello World!</div>';
  it('browser.hasElement', function() {
    return browser
      .hasElement("name", "theDiv").should.eventually.be.ok
      .hasElement("name", "theDiv2").should.eventually.not.be.ok;
  });

  partials['browser.waitForElement'] =
    '<div id="theDiv"></div>';
  it('browser.waitForElement', skip('ios', 'android'), function() {
    var startMs = Date.now();
    return browser
      .executeAsync( prepareJs(
        'var args = Array.prototype.slice.call( arguments, 0 );\n' +
        'var done = args[args.length -1];\n' +
        'setTimeout(function() {\n' +
        ' $("#theDiv").append("<div class=\\"child\\">a waitForElement child</div>");\n' +
        '}, arguments[0]);\n' +
        'done();\n' ),
        [env.BASE_TIME_UNIT]
      )
      .then(function() {
        // if selenium was too slow skip the test.
        if(Date.now() - startMs < env.BASE_TIME_UNIT){
          return browser.elementByCss("#theDiv .child")
            .should.be.rejectedWith(/status: 7/);
        }
      })
      .waitForElement("css selector", "#theDiv .child", 2 * env.BASE_TIME_UNIT)
      .should.be.fulfilled
      .then(function() {
        return browser
          .waitForElement("css selector", "#wrongsel .child", 0.1 * env.BASE_TIME_UNIT)
          .should.be.rejectedWith('Element condition wasn\'t satisfied!');
      });
  });

  partials['browser.waitForVisible'] =
    '<div id="theDiv"></div>';
  it('browser.waitForVisible', skip('ios', 'android'), function() {
    return browser
      .executeAsync( prepareJs(
        'var args = Array.prototype.slice.call( arguments, 0 );\n' +
        'var done = args[args.length -1];\n' +
        '$("#theDiv").append("<div class=\\"child\\">a waitForVisible child</div>");\n' +
        '$("#theDiv .child").hide();\n' +
        'setTimeout(function() {\n' +
        ' $("#theDiv .child").show();\n' +
        '}, arguments[0]);\n' +
        'done();\n' ),
        [env.BASE_TIME_UNIT]
      )
      .elementByCss("#theDiv .child").should.eventually.exist
      .waitForVisible("css selector", "#theDiv .child", 2 * env.BASE_TIME_UNIT)
        .should.be.fulfilled
      .then(function() {
        return browser
          .waitForVisible("css selector", "#wrongsel .child", 0.1 * env.BASE_TIME_UNIT)
          .should.be.rejectedWith(/Element didn\'t become visible/);

      });
  });

  partials['browser.elements'] =
    '<div>\n' +
    '  <div name="elementsByName">Hello World!</div>\n' +
    '  <div name="elementsByName">Hello World!</div>\n' +
    '  <div name="elementsByName">Hello World!</div>\n' +
    '</div>\n';
  it('browser.elements', function() {
    return browser
      .elements("name", "elementsByName").should.eventually.have.length(3)
      .elements("name", "elementsByName2").should.eventually.deep.equal([]);
  });


  partials['browser.getAttribute'] =
    '<div id="weatherDiv" weather="sunny">Hi</div>';
  it('browser.getAttribute', function() {
    return browser
      .elementById('weatherDiv').then(function(div) {
        return browser
          .getAttribute(div, 'weather').should.become("sunny")
          .getAttribute(div, 'timezone').should.eventually.be.a('null');
      })
      .elementById('weatherDiv').getAttribute('weather').should.become("sunny");
  });

  partials['browser.getTagName'] =
    '<div id="theDiv"><input type="text"><a href="#">a1</a></div>';
  it('browser.getTagName', function() {
    return browser
      .elementByCss('#theDiv input').then(function(el) {
        return browser.getTagName(el).should.eventually.match(/^input$/i);
      })
      .elementByCss('#theDiv a').getTagName().should.eventually.match(/^a$/i);
  });

  partials['browser.getValue'] =
    '<div id="theDiv">\n' +
    '  <input class="input-text" type="text" value="Hello getValueTest!">\n'  +
    '  <textarea>Hello getValueTest2!</textarea>\n' +
    '</div>';
  it('browser.getValue', function() {
    return browser
      .elementByCss('#theDiv input').then(function(el) {
        return browser.getValue(el).should.become('Hello getValueTest!');
      })
      .elementByCss('#theDiv input').getValue().should.become('Hello getValueTest!')
      .elementByCss('#theDiv textarea').then(function(el) {
        return browser.getValue(el).should.become('Hello getValueTest2!');
      })
      .elementByCss('#theDiv textarea').getValue().should.become('Hello getValueTest2!');
  });

  partials['browser.getComputedCss'] =
    '<div id="theDiv">\n' +
    '  <a href="#">a1</a>\n' +
    '</div>\n';
  it('browser.getComputedCss', function() {
    return browser
      .elementByCss('#theDiv a').then(function(el) {
        return browser
          .getComputedCss(el, 'color').should.eventually.match(/rgb/);
      }).elementByCss('#theDiv  a').getComputedCss('color')
        .should.eventually.match(/rgb/);
  });


  partials['browser.text'] =
    '<div id="theDiv"><div>text content</div></div>\n';
  it('browser.text', function() {
    return browser
      .elementByCss("#theDiv").then(function(div) {
        return browser
          .text(div).should.eventually.include("text content")
          .text(div).should.not.eventually.include("div")
          .text().then(function(res) {
            res.should.include("text content");
            res.should.include("WD Tests");
            res.should.not.include("div");
          })
          .text('body').then(function(res) {
            res.should.include("text content");
            res.should.include("WD Tests");
            res.should.not.include("div");
          })
          .text(null).then(function(res) {
            res.should.include("text content");
            res.should.include("WD Tests");
            res.should.not.include("div");
          });
      })
      .elementByCss("#theDiv")
      .text().should.eventually.include("text content");
  });

  partials['browser.textPresent'] =
    '<div id="theDiv">weather is sunny</div>\n';
  it('browser.textPresent', function() {
    return browser
      .elementByCss("#theDiv").then(function(el) {
        return browser
          .textPresent('sunny', el).should.eventually.be.ok
          .textPresent('raining', el).should.eventually.not.be.ok;
      })
      .elementByCss("#theDiv").textPresent('sunny').should.eventually.be.ok
      .elementByCss("#theDiv").textPresent('raining').should.eventually.not.be.ok;
  });

});
