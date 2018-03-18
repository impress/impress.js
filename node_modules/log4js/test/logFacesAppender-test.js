"use strict";
var vows = require('vows'),
    assert = require('assert'),
    log4js = require('../lib/log4js'),
    sandbox = require('sandboxed-module');

function setupLogging(category, options) {
  var udpSent = {};

  var fakeDgram = {
    createSocket: function (type) {
      return {
        send: function(buffer, offset, length, port, host, callback) {
          udpSent.date = new Date();
          udpSent.host = host;
          udpSent.port = port;
          udpSent.length = length;
          udpSent.offset = 0;
          udpSent.buffer = buffer;
          callback(undefined, length);
        }
      };
    }
  };

  var lfsModule = sandbox.require('../lib/appenders/logFacesAppender', {
    requires: {
      'dgram': fakeDgram
    }
  });
  log4js.clearAppenders();
  log4js.addAppender(lfsModule.configure(options), category);

  return {
    logger: log4js.getLogger(category),
    results: udpSent
  };
}

vows.describe('logFaces UDP appender').addBatch({
  'when logging to logFaces UDP receiver': {
    topic: function() {
      var setup = setupLogging('myCategory', {
         "type": "logFacesAppender",
         "application": "LFS-TEST",
         "remoteHost": "127.0.0.1",
         "port": 55201,
         "layout": {
           "type": "pattern",
           "pattern": "%m"
         }
      });

      setup.logger.warn('Log event #1');
      return setup;
    },
    'an UDP packet should be sent': function (topic) {
      assert.equal(topic.results.host, "127.0.0.1");
      assert.equal(topic.results.port, 55201);
      assert.equal(topic.results.offset, 0);
      var json = JSON.parse(topic.results.buffer.toString());
      assert.equal(json.a, 'LFS-TEST');
      assert.equal(json.m, 'Log event #1');
      assert.equal(json.g, 'myCategory');
      assert.equal(json.p, 'WARN');

      // Assert timestamp, up to hours resolution.
      var date = new Date(json.t);
      assert.equal(
        date.toISOString().substring(0, 14),
        topic.results.date.toISOString().substring(0, 14)
      );
    }
  },

  'when missing options': {
    topic: function() {
      var setup = setupLogging('myLogger', {
          "type": "logFacesAppender",
      });
      setup.logger.error('Log event #2');
      return setup;
    },
    'it sets some defaults': function (topic) {
      assert.equal(topic.results.host, "127.0.0.1");
      assert.equal(topic.results.port, 55201);

      var json = JSON.parse(topic.results.buffer.toString());
      assert.equal(json.a, "");
      assert.equal(json.m, 'Log event #2');
      assert.equal(json.g, 'myLogger');
      assert.equal(json.p, 'ERROR');
    }
  }

}).export(module);
