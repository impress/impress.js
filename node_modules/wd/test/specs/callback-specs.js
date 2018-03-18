var nock = require('nock');
require('../helpers/setup');


describe("async callback tests", function() {
  var server, browser;

  before(function(done) {
    server = nock('http://127.0.0.1:5555').filteringRequestBody(/.*/, '*');
    server.log(console.log);
    server.post('/wd/hub/session', '*').reply(303, "OK", {
      'Location': '/wd/hub/session/1234'
    });

    browser = wd.remote({
      port: 5555
    });
    browser.init({}, function(err) {
      should.not.exist(err);
      done(null);
    });
  });

  describe("simplecallback with empty return", function() {
    it("should get url", function(done) {
      server.post('/wd/hub/session/1234/url', '*').reply(200, "");
      browser.get("www.google.com", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });

  describe("simplecallback with 200 OK", function() {
    it("should get url", function(done) {
      server.post('/wd/hub/session/1234/url', '*').reply(200, "OK");
      browser.get("www.google.com", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });

  describe("simplecallback with empty JSON data", function() {
    it("should get url", function(done) {
      server.post('/wd/hub/session/1234/url', '*').reply(200, '{"sessionId":"1234","status":0,"value":{}}');
      browser.get("www.google.com", function(err) {
        should.not.exist(err);
        done(null);
      });
    });
  });
});

describe("promise tests", function() {
  // all the tests below should be resolved, so the resolved handler
  // calls done() to pass and the rejected handler calls done(err) to fail

  var server, browser;
  before(function(done) {
    server = nock('http://127.0.0.1:5555').filteringRequestBody(/.*/, '*');
    server.log(console.log);
    server.post('/wd/hub/session', '*').reply(303, "OK", {
      'Location': '/wd/hub/session/1234'
    });
    browser = wd.promiseChainRemote({
      port: 5555
    });
    browser.init({}).then(
      function() { done(null); },
      function(err) { done(err); });

  });
  describe("simplepromise empty returns", function() {
    describe("simplepromsie with empty return", function() {
      it("should get url", function(done) {
        server.post('/wd/hub/session/1234/url', '*').reply(200, "");
        browser.get("www.google.com").then(
          function() { done(null); },
          function(err) { done(err); });
      });
    });
    describe("simplepromise with 200 OK", function() {
      it("should get url", function(done) {
        server.post('/wd/hub/session/1234/url', '*').reply(200, "OK");
        browser.get("www.google.com").then(
          function() { done(null); },
          function(err) { done(err); });
      });
    });
    describe("simplepromise with empty JSON data", function() {
      it("should get url", function(done) {
        server.post('/wd/hub/session/1234/url', '*').reply(200, '{"sessionId":"1234","status":0,"value":{}}');
        browser.get("www.google.com").then(
          function() { done(null); },
          function(err) { done(err); });
      });
    });
  });
});
