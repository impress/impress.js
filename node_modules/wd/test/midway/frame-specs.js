
require('../helpers/setup');

describe('frame ' + env.ENV_DESC, function() {
  var partials = {};

  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  it('browser.frame', function() {
    return browser
      .get( env.MIDWAY_ROOT_URL + "/frame-test/index.html")
      .elementsByTagName('frame').should.eventually.have.length(3)
      .frame(0)
      .elementsByTagName('body').text().should.eventually.include("Menu!")
      .frame()
      .elementsByTagName('frame').then(function(frames) {
        frames.should.have.length(3);
        return browser
          .frame(frames[1])
          .elementsByTagName('body').text().should.eventually.include("Welcome!");
      })
      .frame()
      .elementsByTagName('frame').then(function(frames) {
        return browser.getAttribute(frames[2],'id').then(function(id) {
          browser
            .frame(id)
            .elementsByTagName('body').text().should.eventually.include("Banner!");
        });
      });
  });

});
