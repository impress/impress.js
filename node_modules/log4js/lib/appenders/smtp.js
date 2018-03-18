"use strict";

var layouts = require("../layouts");
var mailer = require("nodemailer");
var os = require('os');

var logEventBuffer = [];
var subjectLayout;
var layout;

var unsentCount = 0;
var shutdownTimeout;

var sendInterval;
var sendTimer;

var config;

function sendBuffer() {
    if (logEventBuffer.length > 0) {

        var transportOpts = getTransportOptions(config);
        var transport = mailer.createTransport(transportOpts);
        var firstEvent = logEventBuffer[0];
        var body = "";
        var count = logEventBuffer.length;
        while (logEventBuffer.length > 0) {
            body += layout(logEventBuffer.shift(), config.timezoneOffset) + "\n";
        }

        var msg = {
            to: config.recipients,
            subject: config.subject || subjectLayout(firstEvent),
            headers: {"Hostname": os.hostname()}
        };

        if (true === config.attachment.enable) {
            msg[config.html ? "html" : "text"] = config.attachment.message;
            msg.attachments = [
                {
                    filename: config.attachment.filename,
                    contentType: 'text/x-log',
                    content: body
                }
            ];
        } else {
            msg[config.html ? "html" : "text"] = body;
        }

        if (config.sender) {
            msg.from = config.sender;
        }
        transport.sendMail(msg, function (error) {
            if (error) {
                console.error("log4js.smtpAppender - Error happened", error);
            }
            transport.close();
            unsentCount -= count;
        });
    }
}

function getTransportOptions() {
    var transportOpts = null;
    if (config.SMTP) {
        transportOpts = config.SMTP;
    } else if (config.transport) {
        var plugin = config.transport.plugin || 'smtp';
        var transportModule = 'nodemailer-' + plugin + '-transport';
        var transporter = require(transportModule);
        transportOpts = transporter(config.transport.options);
    }

    return transportOpts;
}

function scheduleSend() {
    if (!sendTimer) {
        sendTimer = setTimeout(function () {
            sendTimer = null;
            sendBuffer();
        }, sendInterval);
    }
}

/**
 * SMTP Appender. Sends logging events using SMTP protocol. 
 * It can either send an email on each event or group several 
 * logging events gathered during specified interval.
 *
 * @param _config appender configuration data
 *    config.sendInterval time between log emails (in seconds), if 0
 *    then every event sends an email
 *    config.shutdownTimeout time to give up remaining emails (in seconds; defaults to 5).
 * @param _layout a function that takes a logevent and returns a string (defaults to basicLayout).
 */
function smtpAppender(_config, _layout) {
    config = _config;

    if (!config.attachment) {
        config.attachment = {};
    }

    config.attachment.enable = !!config.attachment.enable;
    config.attachment.message = config.attachment.message || "See logs as attachment";
    config.attachment.filename = config.attachment.filename || "default.log";
    layout = _layout || layouts.basicLayout;
    subjectLayout = layouts.messagePassThroughLayout;
    sendInterval = config.sendInterval * 1000 || 0;

    shutdownTimeout = ('shutdownTimeout' in config ? config.shutdownTimeout : 5) * 1000;

    return function (loggingEvent) {
        unsentCount++;
        logEventBuffer.push(loggingEvent);
        if (sendInterval > 0) {
            scheduleSend();
        } else {
            sendBuffer();
        }
    };
}

function configure(_config) {
    config = _config;
    if (_config.layout) {
        layout = layouts.layout(_config.layout.type, _config.layout);
    }
    return smtpAppender(_config, layout);
}

function shutdown(cb) {
    if (shutdownTimeout > 0) {
        setTimeout(function () {
            if (sendTimer)
                clearTimeout(sendTimer);
            sendBuffer();
        }, shutdownTimeout);
    }
    (function checkDone() {
      if (unsentCount > 0) {
        setTimeout(checkDone, 100);
      } else {
        cb();
      }
    })();
}

exports.name = "smtp";
exports.appender = smtpAppender;
exports.configure = configure;
exports.shutdown = shutdown;
