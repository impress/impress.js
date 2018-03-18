/**
* logFaces appender sends JSON formatted log events to logFaces server UDP receivers.
* Events contain the following properties:
*  - application name (taken from configuration)
*  - host name (taken from underlying os)
*  - time stamp
*  - level
*  - logger name (e.g. category)
*  - thread name (current process id)
*  - message text
*/

"use strict";
var dgram = require('dgram'),
    layouts = require('../layouts'),
    os = require('os'),
    util = require('util');

try{
 	var process = require('process');
}
catch(error){
   //this module is optional as it may not be available
 	//in older versions of node.js, so ignore if it failes to load
}

function logFacesAppender (config, layout) {
  var lfsSock = dgram.createSocket('udp4');
  var localhost = "";

  if(os && os.hostname())
     localhost = os.hostname().toString();

   var pid = "";
   if(process && process.pid)
      pid = process.pid;

  return function log(loggingEvent) {
    var lfsEvent = {
      a: config.application || "",                      // application name
      h: localhost,                                     // this host name
      t: loggingEvent.startTime.getTime(),              // time stamp
      p: loggingEvent.level.levelStr,                   // level (priority)
      g: loggingEvent.categoryName,                     // logger name
      r: pid,                                           // thread (process id)
      m: layout(loggingEvent)                           // message text
    };

    var buffer = new Buffer(JSON.stringify(lfsEvent));
    var lfsHost = config.remoteHost || "127.0.0.1";
    var lfsPort = config.port || 55201;
    lfsSock.send(buffer, 0, buffer.length, lfsPort, lfsHost, function(err, bytes) {
       if(err) {
         console.error("log4js.logFacesAppender send to %s:%d failed, error: %s",
                        config.host, config.port, util.inspect(err));
       }
    });
  };
}

function configure(config) {
	var layout;
	if (config.layout)
		layout = layouts.layout(config.layout.type, config.layout);
    else
       layout = layouts.layout("pattern", {"type": "pattern", "pattern": "%m"});
   return logFacesAppender(config, layout);
}

exports.appender = logFacesAppender;
exports.configure = configure;
