
require('../helpers/setup');

describe('chaining scope ' + env.ENV_DESC, function() {
  var htmlPage = 
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


  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['chaining scope using default'] = htmlPage;
  it('chaining scope using default', function() {
    return browser
      .elementsByTagName('span').should.eventually.have.length(5)
      .elementById('div1')
      .elementsByTagName('span').should.eventually.have.length(5)
      .elementById('div1')
      .elementsByTagName('>','span').should.eventually.have.length(2)
      .elementById('div1')
      .elementsByTagName('<','span').should.eventually.have.length(5);
  });

  it('getting/settting browser.defaultChainingScope', function() {
    return browser.chain()
      .then(function() { browser.defaultChainingScope.should.equal('browser'); })
      .then(function() { browser.defaultChainingScope = 'element'; })
      .then(function() { browser.defaultChainingScope.should.equal('element'); });
  });

  partials['chaining scope with defaultChainingScope=element'] = htmlPage;
  it('chaining scope with defaultChainingScope=element', function() {
    return browser.chain()
      .then(function() { browser.defaultChainingScope = 'element'; })
      .elementById('div1')
      .elementsByTagName('span').should.eventually.have.length(2);
  });


});
