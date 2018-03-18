"use strict";
var Slack = require('slack-node');
var layouts = require('../layouts');
var layout;

var slack, config;

function slackAppender(_config, _layout) {

    layout = _layout || layouts.basicLayout;

    return function (loggingEvent) {

        var data = {
            channel_id: _config.channel_id,
            text: layout(loggingEvent, _config.timezoneOffset),
            icon_url: _config.icon_url,
            username: _config.username
        };

        slack.api('chat.postMessage', {
            channel: data.channel_id,
            text: data.text,
            icon_url: data.icon_url,username: data.username}, function (err, response) {
            if (err) { throw err; }
        });

    };
}

function configure(_config) {

    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }

    slack = new Slack(_config.token);

    return slackAppender(_config, layout);
}

exports.name      = 'slack';
exports.appender = slackAppender;
exports.configure = configure;
