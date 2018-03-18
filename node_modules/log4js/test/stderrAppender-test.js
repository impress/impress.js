"use strict";
var assert = require('assert')
, vows = require('vows')
, layouts = require('../lib/layouts')
, sandbox = require('sandboxed-module');

vows.describe('../lib/appenders/stderr').addBatch({
  'appender': {
    topic: function() {
      var messages = []
      , fakeProcess = {
          stderr: {
            write: function(msg) { messages.push(msg); }
          }
      }
      , appenderModule = sandbox.require(
        '../lib/appenders/stderr',
        {
          globals: {
            'process': fakeProcess
          }
        }
      )
      , appender = appenderModule.appender(layouts.messagePassThroughLayout);

      appender({ data: ["blah"] });
      return messages;
    },

    'should output to stderr': function(messages) {
      assert.equal(messages[0], 'blah\n');
    }
  }

}).exportTo(module);
