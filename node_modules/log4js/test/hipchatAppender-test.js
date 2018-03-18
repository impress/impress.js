"use strict";
var vows = require('vows'),
    assert = require('assert'),
    log4js = require('../lib/log4js'),
    sandbox = require('sandboxed-module');

function setupLogging(category, options) {
  var lastRequest = {};

  var fakeRequest = function(args, level){
    lastRequest.notifier = this;
    lastRequest.body = args[0];
    lastRequest.callback = args[1];
    lastRequest.level = level;
  };

  var fakeHipchatNotifier = {
    'make': function(room, token, from, host, notify){
      return {
        'room': room,
        'token': token,
        'from': from || '',
        'host': host || 'api.hipchat.com',
        'notify': notify || false,
        'setRoom': function(val){ this.room = val; },
        'setFrom': function(val){ this.from = val; },
        'setHost': function(val){ this.host = val; },
        'setNotify': function(val){ this.notify = val; },
        'info': function(){ fakeRequest.call(this, arguments, 'info'); },
        'warning': function(){ fakeRequest.call(this, arguments, 'warning'); },
        'failure': function(){ fakeRequest.call(this, arguments, 'failure'); },
        'success': function(){ fakeRequest.call(this, arguments, 'success'); }
      };
    }
  };

  var hipchatModule = sandbox.require('../lib/appenders/hipchat', {
    requires: {
      'hipchat-notifier': fakeHipchatNotifier
    }
  });
  log4js.clearAppenders();
  log4js.addAppender(hipchatModule.configure(options), category);

  return {
    logger: log4js.getLogger(category),
    lastRequest: lastRequest
  };
}

vows.describe('HipChat appender').addBatch({
  'when logging to HipChat v2 API': {
    topic: function() {
      var customCallback = function(err, res, body){ return 'works'; };

      var setup = setupLogging('myCategory', {
         "type": "hipchat",
         "hipchat_token": "User_Token_With_Notification_Privs",
         "hipchat_room": "Room_ID_Or_Name",
         "hipchat_from": "Log4js_Test",
         "hipchat_notify": true,
         "hipchat_host": "hipchat.your-company.tld",
         "hipchat_response_callback": customCallback
      });
      setup.logger.warn('Log event #1');
      return setup;
    },
    'a request to hipchat_host should be sent': function (topic) {
      assert.equal(topic.lastRequest.notifier.host, "hipchat.your-company.tld");
      assert.equal(topic.lastRequest.notifier.notify, true);
      assert.equal(topic.lastRequest.body, 'Log event #1');
      assert.equal(topic.lastRequest.level, 'warning');
    },
    'a custom callback to the HipChat response is supported': function(topic) {
      assert.equal(topic.lastRequest.callback(), 'works');
    }
  },
  'when missing options': {
    topic: function() {
      var setup = setupLogging('myLogger', {
          "type": "hipchat",
      });
      setup.logger.error('Log event #2');
      return setup;
    },
    'it sets some defaults': function (topic) {
      assert.equal(topic.lastRequest.notifier.host, "api.hipchat.com");
      assert.equal(topic.lastRequest.notifier.notify, false);
      assert.equal(topic.lastRequest.body, 'Log event #2');
      assert.equal(topic.lastRequest.level, 'failure');
    }
  },
  'when basicLayout is provided': {
    topic: function() {
      var setup = setupLogging('myLogger', {
          "type": "hipchat",
          "layout": log4js.layouts.basicLayout
      });
      setup.logger.debug('Log event #3');
      return setup;
    },
    'it should include the timestamp': function (topic) {

      // basicLayout adds [TIMESTAMP] [LEVEL] category - message
      // e.g. [2016-06-10 11:50:53.819] [DEBUG] myLogger - Log event #23

      assert.match(topic.lastRequest.body, /^\[[^\]]+\] \[[^\]]+\].*Log event \#3$/);
      assert.equal(topic.lastRequest.level, 'info');
    }
  }

}).export(module);
