"use strict";

var layouts = require('../layouts');

function stderrAppender(layout, timezoneOffset) {
  layout = layout || layouts.colouredLayout;
  return function(loggingEvent) {
    process.stderr.write(layout(loggingEvent, timezoneOffset) + '\n');
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return stderrAppender(layout, config.timezoneOffset);
}

exports.appender = stderrAppender;
exports.configure = configure;
