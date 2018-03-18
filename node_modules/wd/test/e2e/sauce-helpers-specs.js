/* global sauceJobTitle, mergeDesired */

require('../helpers/setup');

// Testing sauce specific method, it doesn't work
// in regular selenium
if(env.SAUCE){

  describe('sauce-helpers ' + env.ENV_DESC, function() {
    this.timeout(env.TIMEOUT);

    var browser;
    var markPassed = false;
    var desired;

    before(function() {
      browser = wd.promiseChainRemote(env.REMOTE_CONFIG);
      var sauceExtra = {
        name: sauceJobTitle(this.runnable().parent.title),
        tags: ['e2e']
      };
      desired = mergeDesired(env.DESIRED, env.SAUCE? sauceExtra : null );

      return browser
        .configureLogging()
        .init(desired)
        .get('http://admc.io/wd/test-pages/guinea-pig.html')
        .title().should.eventually.include("WD");
    });

    after(function() {
      return browser
        .quit().then(function() {
          if(!markPassed) { return(browser.sauceJobStatus(markPassed)); }
        });
    });


    it("should update job", function() {

      return browser.sauceJobUpdate({
        name: desired.name + "(updated)",
        tags: _.union(desired.tags, ['sauce'])
      });
    });

    it("should mark job passed", function() {
      return browser.sauceJobStatus(true).then(function() {
        markPassed = true;
      });
    });
  });

}


