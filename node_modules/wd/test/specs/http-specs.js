require('../helpers/setup');

describe("wd", function() {

  describe("global http settings", function() {
    it("should be able to configure http", function(done) {
      wd.getHttpConfig().should.exists;
      var current = wd.getHttpConfig();
      wd.configureHttp({timeout: 60000, retries: 3, 'retryDelay': 15, baseUrl: 'http://example.com/' });
      wd.getHttpConfig().should.deep.equal(
        {timeout: 60000, retries: 3, 'retryDelay': 15,
          baseUrl: 'http://example.com/', proxy: undefined});
      wd.configureHttp({timeout: 'default'});
      wd.getHttpConfig().should.deep.equal(
        {timeout: undefined, retries: 3, 'retryDelay': 15, 
          baseUrl: 'http://example.com/', proxy: undefined});
      wd.configureHttp({retries: 'always'});
      wd.getHttpConfig().should.deep.equal(
        {timeout: undefined, retries: 0, 'retryDelay': 15,
          baseUrl: 'http://example.com/', proxy: undefined});
      wd.configureHttp({retries: 'never'});
      wd.getHttpConfig().should.deep.equal(
        {timeout: undefined, retries: -1, 'retryDelay': 15,
          baseUrl: 'http://example.com/', proxy: undefined});
      wd.configureHttp({proxy: 'http://proxy.com'});
      wd.getHttpConfig().should.deep.equal(
        {timeout: undefined, retries: -1, 'retryDelay': 15,
          baseUrl: 'http://example.com/', proxy: 'http://proxy.com'});
      wd.configureHttp(current);
      wd.getHttpConfig().should.deep.equal(current);
      done();
    });
  });
});
