"use strict";

var hipchat = require('hipchat-notifier');
var layouts = require('../layouts');

exports.name = 'hipchat';
exports.appender  = hipchatAppender;
exports.configure = hipchatConfigure;

/**
  @invoke as

  log4js.configure({
    "appenders": [
      {
        "type" : "hipchat",
        "hipchat_token": "< User token with Notification Privileges >",
        "hipchat_room": "< Room ID or Name >",
        // optionl
        "hipchat_from": "[ additional from label ]",
        "hipchat_notify": "[ notify boolean to bug people ]",
        "hipchat_host" : "api.hipchat.com"
      }
    ]
  });

  var logger = log4js.getLogger("hipchat");
  logger.warn("Test Warn message");

  @invoke
 */

function hipchatNotifierResponseCallback(err, response, body){
  if(err) {
    throw err;
  }
}

function hipchatAppender(config) {

	var notifier = hipchat.make(config.hipchat_room, config.hipchat_token);

  // @lint W074 This function's cyclomatic complexity is too high. (10)
  return function(loggingEvent){

    var notifierFn;

    notifier.setRoom(config.hipchat_room);
    notifier.setFrom(config.hipchat_from || '');
    notifier.setNotify(config.hipchat_notify || false);

    if(config.hipchat_host) {
      notifier.setHost(config.hipchat_host);
    }

    switch (loggingEvent.level.toString()) {
      case "TRACE":
      case "DEBUG":
        notifierFn = "info";
        break;
      case "WARN":
        notifierFn = "warning";
        break;
      case "ERROR":
      case "FATAL":
        notifierFn = "failure";
        break;
      default:
        notifierFn = "success";
    }

    // @TODO, re-work in timezoneOffset ?
    var layoutMessage = config.layout(loggingEvent);

    // dispatch hipchat api request, do not return anything
    //  [overide hipchatNotifierResponseCallback]
    notifier[notifierFn](layoutMessage, config.hipchat_response_callback ||
      hipchatNotifierResponseCallback);
  };
}

function hipchatConfigure(config) {
	var layout;

	if (!config.layout) {
		config.layout = layouts.messagePassThroughLayout;
	}

	return hipchatAppender(config, layout);
}
