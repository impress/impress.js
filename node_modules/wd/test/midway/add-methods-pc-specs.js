require('../helpers/setup');

describe('add-methods - promise-chain' + env.ENV_DESC, function() {

  var browser;
  var partials = {};

  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  var extraAsyncMethods = {
    sleepAndElementById: function(id, cb) {
      var _this = this;
      _this.sleep(200, function(err) {
        if(err) { return cb(err); }
        _this.elementById(id, cb);
      });
    },
    sleepAndText: function(el, cb) {
      var _this = this;
      _this.sleep(200, function(err) {
        if(err) { return cb(err); }
        _this.text(el, cb);
      });
    },
    elementByCssWhenReady: function(selector, timeout, cb) {
      var _this = this;
      _this.waitForElementByCss(selector, timeout, function(err) {
        if(err) { return cb(err); }
        _this.elementByCss(selector, cb);
      });
    }
  };

  var extraElementAsyncMethods = {
    textTwice: function(cb) {
      var _this = this;
      var result = '';
      _this.text(function(err, text) {
        if(err) { return cb(err); }
        result += text;
        _this.text(function(err, text) {
          if(err) { return cb(err); }
          result += text;
          cb(null, result);
        });
      });
    },
  };

  var extraPromiseChainMethods = {
    sleepAndElementById: function(id) {
      return this
        .sleep(200)
        .elementById(id);
    } ,
    sleepAndText: function(el) {
      return this
        .sleep(200)
        .text(el);
    }
  };

  var extraElementPromiseChainMethods = {
    textTwice: function() {
      var _this = this;
      var result = '';
      return _this
        .text().then(function(text) {
          result += text;
          return _this;
        }).text().then(function(text) {
          result += text;
          return result;
        });
    }
  };

  var extraPromiseNoChainMethods = {
    sleepAndElementById: function(id) {
      var _this = this;
      return this
        .sleep(200)
        .then(function() {
          return _this.elementById(id);
        });

    } ,
    sleepAndText: function(el) {
      var _this = this;
      return this
        .sleep(200)
        .then(function() {
          return _this.text(el);
        });
    }
  };

  var extraElementPromiseNoChainMethods = {
    textTwice: function() {
      var _this = this;
      var result = '';
      return _this.text()
        .then(function(text) {
          result += text;
        }).then(function() {
          return _this.text();
        }).then(function(text) {
          result += text;
          return result;          
        });
    }
  };

  var allExtraMethodNames = _.union(
    _(extraAsyncMethods).keys().value(),
    _(extraPromiseChainMethods).keys().value(),
    _(extraPromiseNoChainMethods).keys().value()
  );

  var noExtraMethodCheck = function() {
    _(allExtraMethodNames).each(function(name) {
      should.not.exist(wd.Webdriver.prototype[name]);
      should.not.exist(wd.PromiseWebdriver.prototype[name]);
      should.not.exist(wd.PromiseChainWebdriver.prototype[name]);
    }).value();
  };

  beforeEach(function() {
    noExtraMethodCheck();
  });

  afterEach(function() {
    _(allExtraMethodNames).each(function(name) {
      wd.removeMethod(name);
    }).value();
    noExtraMethodCheck();
  });

  beforeEach(function() {
    return browser.getSessionId().then(function(sessionId) {
      browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
      browser.configureLogging();
      browser.attach(sessionId);
    });
  });

  partials['wd.addPromisedMethod (chain)'] =
    '<div id="theDiv">Hello World!</div>';
  it('wd.addPromisedMethod (chain)', function() {
    _(extraPromiseChainMethods).each(function(method, name) {
      wd.addPromiseChainMethod(name, method);
    }).value();
    return browser
      .sleepAndElementById('theDiv')
      .should.be.fulfilled
      .sleepAndText()
      .should.be.fulfilled
      .sleepAndElementById('theDiv')
      .sleepAndText().should.eventually.include("Hello World!");
  });

  partials['wd.addElementPromisedMethod (chain)'] =
    '<div id="theDiv">\n' +
    '  <div id="div1">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '  </div>\n' +
    '  <div id="div2">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '    <span>three</span>\n' +
    '  </div>\n' +
    '</div>\n';
  it('wd.addElementPromisedMethod (chain)', function() {
    _(extraElementPromiseChainMethods).each(function(method, name) {
      wd.addElementPromiseChainMethod(name, method);
    }).value();
    return browser
      .elementById('div1')
      .textTwice()
      .should.become('one twoone two');
  });

  partials['wd.addPromisedMethod (no-chain)'] =
    '<div id="theDiv">Hello World!</div>';
  it('wd.addPromisedMethod (no-chain)', function() {
    _(extraPromiseNoChainMethods).each(function(method, name) {
      wd.addPromiseMethod(name, method);
    }).value();
    return browser
      .sleepAndElementById('theDiv')
      .should.be.fulfilled
      .sleepAndText()
      .should.be.fulfilled
      .sleepAndElementById('theDiv')
      .sleepAndText().should.eventually.include("Hello World!");
  });

  partials['wd.addElementPromisedMethod (no-chain)'] =
    '<div id="theDiv">\n' +
    '  <div id="div1">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '  </div>\n' +
    '  <div id="div2">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '    <span>three</span>\n' +
    '  </div>\n' +
    '</div>\n';
  it('wd.addElementPromisedMethod (no-chain)', function() {
    _(extraElementPromiseNoChainMethods).each(function(method, name) {
      wd.addElementPromiseMethod(name, method);
    }).value();
    return browser
      .elementById('div1')
      .textTwice()
      .should.become('one twoone two');
  });

  partials['wd.addAsyncMethod'] =
    '<div id="theDiv">Hello World!</div>';
  it('wd.addAsyncMethod', function() {
    _(extraAsyncMethods).each(function(method, name) {
      wd.addAsyncMethod(name, method);
    }).value();
    return browser
      // .sleepAndElementById('theDiv')
      //   .should.be.fulfilled
      // .sleepAndText()
      //   .should.be.fulfilled
      // .sleepAndElementById('theDiv')
      // .sleepAndText().should.eventually.include("Hello World!")
      .elementByCssWhenReady('#theDiv', 500).text()
        .should.become("Hello World!");
  });

  partials['wd.addElementAsyncMethod'] =
    '<div id="theDiv">\n' +
    '  <div id="div1">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '  </div>\n' +
    '  <div id="div2">\n' +
    '    <span>one</span>\n' +
    '    <span>two</span>\n' +
    '    <span>three</span>\n' +
    '  </div>\n' +
    '</div>\n';
  it('wd.addElementAsyncMethod', function() {
    _(extraElementAsyncMethods).each(function(method, name) {
      wd.addElementAsyncMethod(name, method);
    }).value();
    return browser
      .elementById('div1')
      .textTwice()
      .should.become('one twoone two');
  });
});

