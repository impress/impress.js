'use strict';
var layouts = require('../layouts')
, loggly = require('loggly')
, os = require('os')
, passThrough = layouts.messagePassThroughLayout;


function isAnyObject(value) {
	return value !== null && (typeof value === 'object' || typeof value === 'function');
}

function numKeys(o) {
  var res = 0;
  for (var k in o) {
    if (o.hasOwnProperty(k)) res++;
  }
  return res;
}

/**
 * @param msg - array of args for logging.
 * @returns { deTaggedMsg: [], additionalTags: [] }
 */
function processTags(msgListArgs) {
  var msgList = (msgListArgs.length === 1 ? [msgListArgs[0]] : Array.apply(null, msgListArgs));

  return msgList.reduce(function (accum, element, currentIndex, array) {
    if (isAnyObject(element) && Array.isArray(element.tags) && numKeys(element) == 1) {
      accum.additionalTags = accum.additionalTags.concat(element.tags);
    } else {
      accum.deTaggedData.push(element);
    }
    return accum;
  }, { deTaggedData: [], additionalTags: [] });
}

/**
 * Loggly Appender. Sends logging events to Loggly using node-loggly, optionally adding tags.
 *
 * This appender will scan the msg from the logging event, and pull out any argument of the
 * shape `{ tags: [] }` so that it's possibleto add tags in a normal logging call.
 *
 * For example:
 *
 * logger.info({ tags: ['my-tag-1', 'my-tag-2'] }, 'Some message', someObj, ...)
 *
 * And then this appender will remove the tags param and append it to the config.tags.
 *
 * @param config object with loggly configuration data
 * {
 *   token: 'your-really-long-input-token',
 *   subdomain: 'your-subdomain',
 *   tags: ['loggly-tag1', 'loggly-tag2', .., 'loggly-tagn']
 * }
 * @param layout a function that takes a logevent and returns a string (defaults to objectLayout).
 */
function logglyAppender(config, layout) {
	var client = loggly.createClient(config);
  if(!layout) layout = passThrough;

  return function(loggingEvent) {
    var result = processTags(loggingEvent.data);
    var deTaggedData = result.deTaggedData;
    var additionalTags = result.additionalTags;

    // Replace the data property with the deTaggedData
    loggingEvent.data = deTaggedData;

    var msg = layout(loggingEvent);

		client.log({
			msg: msg,
			level: loggingEvent.level.levelStr,
			category: loggingEvent.categoryName,
			hostname: os.hostname().toString(),
		}, additionalTags);
  };
}

function configure(config) {
	var layout;
	if (config.layout) {
		layout = layouts.layout(config.layout.type, config.layout);
	}
	return logglyAppender(config, layout);
}

exports.name      = 'loggly';
exports.appender  = logglyAppender;
exports.configure = configure;
