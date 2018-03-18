require('../helpers/setup');

describe('attach ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  it('attach', function() {
    return browser
      .getSessionId()
      .then(function(sessionId) {
        var browser2 = wd.promiseChainRemote(env.REMOTE_CONFIG);
        return browser2
          .attach(sessionId)
          .title().should.eventually.include('WD Tests')
          .getSessionId().should.become(sessionId);
      });
  });

  it('detach', function() {
    return browser
      .getSessionId()
      .then(function(sessionId) {
        var browser2 = wd.promiseChainRemote(env.REMOTE_CONFIG);
        return browser2
          .attach(sessionId)
          .getSessionId().should.become(sessionId)
          .detach()
          .getSessionId().should.become(null);
      });
  });

});
