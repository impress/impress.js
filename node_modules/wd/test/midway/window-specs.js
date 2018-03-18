require('../helpers/setup');

// disabling because of random errors on sauce
describe('window ' + env.ENV_DESC, skip('explorer'), function() {

  beforeEach(function() {
    return browser.windowHandles().should.eventually.have.length.below(2);
  });

  var partials = {};
  var browser;
  require('./midway-base')(this, partials).then(function(_browser) { browser = _browser; });

  afterEach(function() {
    return browser
      .windowHandles().then(function(handles) {
        var seq = [];
        _(handles).each(function(handle, i) {
          if(i>0) {
            seq.push(function() { return browser.window(handle).close(); });
          }
        }).value();
        if(handles.length > 0) {
          seq.push(function() {return browser.window(handles[0]);});
        }
        return seq.reduce(Q.when, new Q());
      });
  });

  partials['browser.windowName'] = "";
  it('browser.windowName', function() {
    return browser
      .execute('window.name="window-1"')
      .windowName().should.become('window-1');
  });

  partials['browser.windowHandle'] = "";
  it('browser.windowHandle', function() {
    return browser
      .windowHandle()
      .should.eventually.have.length.above(0);
  });

  partials['browser.newWindow'] = "";
  it('browser.newWindow', function() {
    return browser.url(function(url) {
      return browser
        .newWindow( url.replace("window_num=1", "window_num=2"),'window-2');
    });
  });

  partials['browser.window'] = "";
  it('browser.window', function() {
    return Q.all([
        browser.url(),
        browser.windowHandle()
    ]).then(function(res) {
      var url = res[0];
      var handle1 = res[1];
      return browser
        .newWindow(url.replace("window_num=1", "window_num=2"), 'window-2')
        .window('window-2')
        .windowName().should.become('window-2')
        .window(handle1)
        .windowHandle().should.become(handle1);
    });
  });

  partials['browser.windowHandles'] = "";
  it('browser.windowHandles', function() {
    return browser
      .url()
      .then(function(url) {
        return browser
          .newWindow(url.replace("window_num=1", "window_num=2"), 'window-2')
          .windowHandles().should.eventually.have.length(2)
          .window('window-2')
          .close()
          .windowHandles().should.eventually.have.length(1);
      });
  });

  partials['browser.getWindowSize'] = "";
  it('browser.getWindowSize', function() {
    return browser
      .getWindowSize().then(function(size) {
        size.width.should.exist;
        size.height.should.exist;
      })
      .windowHandle().then(function(handle) {
        return browser
          .getWindowSize(handle).then(function(size) {
            size.width.should.exist;
            size.height.should.exist;
          });
      });
  });

  partials['browser.setWindowSize'] = "";
  it('browser.setWindowSize', skip('chrome'), function() {
    // bug with chrome
    return browser
      .getWindowSize().then(function(size) {
        return browser
          .setWindowSize(size.width - 10, size.height - 5)
          .getWindowSize().then(function(newSize) {
            newSize.width.should.be.within(size.width - 11, size.width - 9);
            newSize.height.should.be.within(size.height - 6, size.height - 4);
          })
          .windowHandle(function(handle) {
            return browser
              .setWindowSize(size.width - 15, size.height - 10, handle)
              .getWindowSize().then(function(newSize) {
                newSize.width.should.be.within(size.width - 16, size.width - 14);
                newSize.height.should.be.within(size.height - 11, size.height - 9);
              });
          });
      });
  });

  partials['browser.getWindowPosition'] = "";
  it('browser.getWindowPosition', function() {
    return browser
      .getWindowPosition().then(function(pos) {
        pos.x.should.exist;
        pos.y.should.exist;
      })
      .windowHandle().then(function(handle) {
        return browser
          .getWindowPosition(handle).then(function(pos) {
            pos.x.should.exist;
            pos.y.should.exist;
          });
      });
  });

  partials['browser.setWindowPosition'] = "";
  it('browser.setWindowPosition', function() {
    return browser
      .getWindowPosition().then(function(pos) {
        return browser
          // not working whithout handle
          .windowHandle(function(handle) {
            return browser
              .setWindowPosition(pos.width - 15, pos.height - 10, handle)
              .getWindowPosition().then(function(newPos) {
                newPos.width.should.equal(pos.width - 15);
                newPos.height.should.equal(pos.height - 10);
              });
          })
        ;

      });
  });

});
