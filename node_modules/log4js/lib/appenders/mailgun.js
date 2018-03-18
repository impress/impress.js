"use strict";
var layouts = require('../layouts');
var layout;
var config;
var mailgun;

function mailgunAppender(_config, _layout) {

    config = _config;
    layout = _layout || layouts.basicLayout;

    return function (loggingEvent) {

        var data = {
            from: _config.from,
            to: _config.to,
            subject: _config.subject,
            text: layout(loggingEvent, config.timezoneOffset)
        };

        mailgun.messages().send(data, function (error, body) {
            if (error !== null) console.error("log4js.mailgunAppender - Error happened", error);
        });
    };
}

function configure(_config) {
    config = _config;

    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }

    mailgun = require('mailgun-js')({
        apiKey: _config.apikey,
        domain: _config.domain
    });

    return mailgunAppender(_config, layout);
}

exports.appender = mailgunAppender;
exports.configure = configure;
