require('../helpers/setup');

describe('typing ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  var altKey = wd.SPECIAL_KEYS.Alt;
  var nullKey = wd.SPECIAL_KEYS.NULL;
  var returnKey = wd.SPECIAL_KEYS.Return;
  var enterKey = wd.SPECIAL_KEYS.Enter;

  var typingPartial =
    '<div id="theDiv">\n' +
    '<input></input>\n' +
    '<textarea></textarea>\n' +
    '</div>\n';

  partials['typing nothing'] = typingPartial;
  it('typing nothing', function() {
    return browser
      .elementByCss("#theDiv input").type("").getValue().should.become("")
      .elementByCss("#theDiv textarea").type("").getValue().should.become("");
  });

  partials['typing []'] = typingPartial;
  it('typing []', function() {
    return browser
      .elementByCss("#theDiv input").type([]).getValue().should.become("")
      .elementByCss("#theDiv textarea").type([]).getValue().should.become("");
  });

  partials['typing \'Hello\''] = typingPartial;
  it('typing \'Hello\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello')
        .getValue().should.become('Hello');
  });

  partials['typing [\'Hello\']'] = typingPartial;
  it('typing [\'Hello\']', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello']).getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello']).getValue().should.become('Hello');
  });

  if(!env.SAUCE) {
    // weird stuff with keying spaces on Sauce at the moment, commenting
    // until browser has been upgraded.
    partials['typing [\'Hello\',\' \',\'World\',\'!\']'] = typingPartial;
    it('typing [\'Hello\',\' \',\'World\',\'!\']', function() {
      return browser
        .elementByCss("#theDiv input").type(['Hello', ' ', 'World', '!'])
          .getValue().should.become('Hello World!')
        .elementByCss("#theDiv textarea").type(['Hello', ' ', 'World', '!'])
          .getValue().should.become('Hello World!');
    });
  }
  
  partials['typing \'Hello\\n\''] = typingPartial;
  it('typing \'Hello\\n\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello\n')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello\n')
        .getValue().should.become('Hello\n');
  });

  partials['typing \'\\r\''] = typingPartial;
  it('typing \'\\r\'', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello','\r'])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello','\r'])
        .getValue().should.become( env.DESIRED.browserName === 'firefox'?
          'Hello\n': 'Hello');
  });

  partials['typing [returnKey]'] = typingPartial;
  it('typing [returnKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', returnKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', returnKey])
        .getValue().should.become('Hello\n');
  });

  partials['typing [enterKey]'] = typingPartial;
  it('typing [enterKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', enterKey])
        .getValue().should.eventually.match(/Hello/)
      .elementByCss("#theDiv textarea").type(['Hello', enterKey])
        .getValue().should.eventually.match(/Hello/);
  });

  partials['typing [nullKey]'] = typingPartial;
  it('typing [nullKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', nullKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', nullKey])
        .getValue().should.become('Hello');
  });


  if(!env.SAUCE) { // alt key seems to have no effect
    partials['typing [altKey]'] = typingPartial;
    it('typing [altKey]', function() {
      return browser
        .elementByCss("#theDiv input").type([altKey, 'Hello', altKey])
          .getValue().then(function(val) {
            val.should.exist;
            val.should.not.equal('Hello');
          })
        .elementByCss("#theDiv textarea").type([altKey, 'Hello', altKey])
          .getValue().then(function(val) {
            val.should.exist;
            val.should.not.equal('Hello');
          });
    });
  }

});
