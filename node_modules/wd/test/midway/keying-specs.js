require('../helpers/setup');

describe('keying ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  var altKey = wd.SPECIAL_KEYS.Alt;
  var nullKey = wd.SPECIAL_KEYS.NULL;
  var returnKey = wd.SPECIAL_KEYS.Return;
  var enterKey = wd.SPECIAL_KEYS.Enter;

  var keyingPartial =
    '<div id="theDiv">\n' +
    '<input></input>\n' +
    '<textarea></textarea>\n' +
    '</div>\n';

  partials['keying nothing'] = keyingPartial;
  it('keying nothing', function() {
    return browser
      .elementByCss("#theDiv input").type("").getValue().should.become("")
      .elementByCss("#theDiv textarea").type("").getValue().should.become("");
  });

  partials['keying []'] = keyingPartial;
  it('keying []', function() {
    return browser
      .elementByCss("#theDiv input").type([]).getValue().should.become("")
      .elementByCss("#theDiv textarea").type([]).getValue().should.become("");
  });

  partials['keying \'Hello\''] = keyingPartial;
  it('keying \'Hello\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello')
        .getValue().should.become('Hello');
  });

  partials['keying [\'Hello\']'] = keyingPartial;
  it('keying [\'Hello\']', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello']).getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello']).getValue().should.become('Hello');
  });

  if(!env.SAUCE) {
    // weird stuff with keying spaces on Sauce at the moment, commenting
    // until browser has been upgraded.
    partials['keying [\'Hello\',\' \',\'World\',\'!\']'] = keyingPartial;
    it('keying [\'Hello\',\' \',\'World\',\'!\']', function() {
      return browser
        .elementByCss("#theDiv input").type(['Hello', ' ', 'World', '!'])
          .getValue().should.become('Hello World!')
        .elementByCss("#theDiv textarea").type(['Hello', ' ', 'World', '!'])
          .getValue().should.become('Hello World!');
    });
  }
  
  partials['keying \'Hello\\n\''] = keyingPartial;
  it('keying \'Hello\\n\'', function() {
    return browser
      .elementByCss("#theDiv input").type('Hello\n')
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type('Hello\n')
        .getValue().should.become('Hello\n');
  });

  partials['keying \'\\r\''] = keyingPartial;
  it('keying \'\\r\'', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello','\r'])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello','\r'])
        .getValue().should.become( env.DESIRED.browserName === 'firefox'?
          'Hello\n': 'Hello');
  });

  partials['keying [returnKey]'] = keyingPartial;
  it('keying [returnKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', returnKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', returnKey])
        .getValue().should.become('Hello\n');
  });

  partials['keying [enterKey]'] = keyingPartial;
  it('keying [enterKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', enterKey])
        .getValue().should.eventually.match(/Hello/)
      .elementByCss("#theDiv textarea").type(['Hello', enterKey])
        .getValue().should.eventually.match(/Hello/);
  });

  partials['keying [nullKey]'] = keyingPartial;
  it('keying [nullKey]', function() {
    return browser
      .elementByCss("#theDiv input").type(['Hello', nullKey])
        .getValue().should.become('Hello')
      .elementByCss("#theDiv textarea").type(['Hello', nullKey])
        .getValue().should.become('Hello');
  });


  if(!env.SAUCE) { // alt key seems to have no effect
    partials['keying [altKey]'] = keyingPartial;
    it('keying [altKey]', function() {
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
