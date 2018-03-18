require('../helpers/setup');

describe('chaining ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  partials['<browser chaining>'] =
    '<div id="theDiv">\n' +
    '  <div class="text">Hello World!</div>\n' +
    '  <input></input>\n' +
    '</div>\n';
  it('<browser chaining>', function() {
    return browser
      .elementByCss('#theDiv .text')
      .text()
      .should.become('Hello World!')
      .title()
      .elementByCss('#theDiv input')
      .type('Bonjour!')
      .getValue()
      .should.become('Bonjour!')
      .elementByCss('#theDiv input')
      .clear()
      .type('Hola')
      .type('!')
      .getValue()
      .should.become('Hola!');
  });

  partials['<element chaining>'] =
    '<div id="theDiv">\n' +
    '  <div class="text">Hello World!</div>\n' +
    '  <input></input>\n' +
    '</div>\n';
  it('<element chaining>', function() {
    return browser
      .elementByCss('#theDiv .text')
      .then(function(el) {
        return el
          .text()
          .should.become('Hello World!');
      })
      .elementByCss('#theDiv input')
      .then(function(el) {
        return el
          .type('Bonjour!')
          .getValue()
          .should.become('Bonjour!');
      })
      .elementByCss('#theDiv input')
      .then(function(el) {
        return el
          .clear()
          .type('Hola')
          .type('!')
          .getValue()
          .should.become('Hola!');
      });
  });

});
