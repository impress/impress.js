"use strict";
var vows = require('vows')
  , assert = require('assert')
  , log4js = require('../lib/log4js')
  , sandbox = require('sandboxed-module')
  ;

function setupLogging(category, options) {
  var msgs = [];

  var fakeLoggly = {
    createClient: function(options) {
      return {
        config: options,
        log: function(msg, tags) {
          msgs.push({
            msg: msg,
            tags: tags
          });
        }
      };
    }
  };

  var fakeLayouts = {
    layout: function(type, config) {
      this.type = type;
      this.config = config;
      return log4js.layouts.messagePassThroughLayout;
    },
    basicLayout: log4js.layouts.basicLayout,
    messagePassThroughLayout: log4js.layouts.messagePassThroughLayout
  };

  var fakeConsole = {
    errors: [],
    error: function(msg, value) {
      this.errors.push({ msg: msg, value: value });
    }
  };

  var logglyModule = sandbox.require('../lib/appenders/loggly', {
    requires: {
      'loggly': fakeLoggly,
      '../layouts': fakeLayouts
    },
    globals: {
      console: fakeConsole
    }
  });

  log4js.addAppender(logglyModule.configure(options), category);

  return {
    logger: log4js.getLogger(category),
    loggly: fakeLoggly,
    layouts: fakeLayouts,
    console: fakeConsole,
    results: msgs
  };
}

log4js.clearAppenders();

function setupTaggedLogging() {
  return setupLogging('loggly', {
    token: 'your-really-long-input-token',
    subdomain: 'your-subdomain',
    tags: ['loggly-tag1', 'loggly-tag2', 'loggly-tagn']
  });
}

vows.describe('log4js logglyAppender').addBatch({
  'with minimal config': {
    topic: function() {
      var setup = setupTaggedLogging();
      setup.logger.log('trace', 'Log event #1', 'Log 2', { tags: ['tag1', 'tag2'] });
      return setup;
    },
    'has a results.length of 1': function(topic) {
      assert.equal(topic.results.length, 1);
    },
    'has a result msg with both args concatenated': function(topic) {
      assert.equal(topic.results[0].msg.msg, 'Log event #1 Log 2');
    },
    'has a result tags with the arg that contains tags': function(topic) {
      assert.deepEqual(topic.results[0].tags, ['tag1', 'tag2']);
    }
  }
}).addBatch({
  'config with object with tags and other keys': {
    topic: function() {
      var setup = setupTaggedLogging();

      // ignore this tags object b/c there are 2 keys
      setup.logger.log('trace', 'Log event #1', { other: 'other', tags: ['tag1', 'tag2'] });
      return setup;
    },
    'has a results.length of 1': function(topic) {
      assert.equal(topic.results.length, 1);
    },
    'has a result msg with the args concatenated': function(topic) {
      assert.equal(topic.results[0].msg.msg,
        'Log event #1 { other: \'other\', tags: [ \'tag1\', \'tag2\' ] }');
    },
    'has a result tags with the arg that contains no tags': function(topic) {
      assert.deepEqual(topic.results[0].tags, []);
    }
  }
}).export(module);
