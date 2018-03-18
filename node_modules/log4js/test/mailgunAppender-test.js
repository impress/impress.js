"use strict";
var vows = require('vows');
var assert = require('assert');
var log4js = require('../lib/log4js');
var sandbox = require('sandboxed-module');

function setupLogging(category, options) {
    var msgs = [];

    var mailgunCredentials = {
        apiKey: options.apikey,
        domain: options.domain
    };

    var fakeMailgun = function (conf) {
        return {
            messages: function () {
                return {
                    config: options,
                    send: function (data, callback) {
                        msgs.push(data);
                        callback(false, {status:"OK"});
                    }
                };
            }
        };
    };

    var fakeLayouts = {
        layout: function (type, config) {
            this.type = type;
            this.config = config;
            return log4js.layouts.messagePassThroughLayout;
        },
        basicLayout: log4js.layouts.basicLayout,
        messagePassThroughLayout: log4js.layouts.messagePassThroughLayout
    };

    var fakeConsole = {
        errors: [],
        logs: [],
        error: function (msg, value) {
            this.errors.push({msg: msg, value: value});
        },
        log: function (msg, value) {
            this.logs.push({msg: msg, value: value});
        }
    };


    var mailgunModule = sandbox.require('../lib/appenders/mailgun', {
        requires: {
            'mailgun-js': fakeMailgun,
            '../layouts': fakeLayouts
        },
        globals: {
            console: fakeConsole
        }
    });


    log4js.addAppender(mailgunModule.configure(options), category);

    return {
        logger: log4js.getLogger(category),
        mailer: fakeMailgun,
        layouts: fakeLayouts,
        console: fakeConsole,
        mails: msgs,
        credentials: mailgunCredentials
    };
}

function checkMessages(result) {
    for (var i = 0; i < result.mails.length; ++i) {
        assert.equal(result.mails[i].from, 'sender@domain.com');
        assert.equal(result.mails[i].to, 'recepient@domain.com');
        assert.equal(result.mails[i].subject, 'This is subject');
        assert.ok(new RegExp('.+Log event #' + (i + 1)).test(result.mails[i].text));
    }
}

log4js.clearAppenders();

vows.describe('log4js mailgunAppender').addBatch({
    'mailgun setup': {
        topic: setupLogging('mailgun setup', {
                apikey: 'APIKEY',
                domain: 'DOMAIN',
                from: 'sender@domain.com',
                to: 'recepient@domain.com',
                subject: 'This is subject'
        }),
        'mailgun credentials should match': function(result){
            assert.equal(result.credentials.apiKey, 'APIKEY');
            assert.equal(result.credentials.domain, 'DOMAIN');
        }
    },

    'basic usage': {
        topic: function(){
            var setup = setupLogging('basic usage', {
                apikey: 'APIKEY',
                domain: 'DOMAIN',
                from: 'sender@domain.com',
                to: 'recepient@domain.com',
                subject: 'This is subject'
            });

            setup.logger.info("Log event #1");
            return setup;
        },
        'there should be one message only': function (result) {
            assert.equal(result.mails.length, 1);
        },
        'message should contain proper data': function (result) {
            checkMessages(result);
        }
    },
    'config with layout': {
        topic: function () {
            var setup = setupLogging('config with layout', {
                layout: {
                    type: "tester"
                }
            });
            return setup;
        },
        'should configure layout': function (result) {
            assert.equal(result.layouts.type, 'tester');
        }
    },
    'error when sending email': {
        topic: function () {
            var setup = setupLogging('separate email for each event', {
                apikey: 'APIKEY',
                domain: 'DOMAIN',
                from: 'sender@domain.com',
                to: 'recepient@domain.com',
                subject: 'This is subject'
            });

            setup.mailer.messages = function () {
                    return {
                        send: function (msg, cb) {
                            cb({msg: "log4js.mailgunAppender - Error happened"}, null);
                        }
                    };
            };

            setup.logger.info("This will break");
            return setup.console;
        },
        'should be logged to console': function (cons) {
            assert.equal(cons.errors.length, 1);
            assert.equal(cons.errors[0].msg, 'log4js.mailgunAppender - Error happened');
        }
    },
    'separate email for each event': {
        topic: function () {
            var self = this;
            var setup = setupLogging('separate email for each event', {
                apikey: 'APIKEY',
                domain: 'DOMAIN',
                from: 'sender@domain.com',
                to: 'recepient@domain.com',
                subject: 'This is subject'
            });
            setTimeout(function () {
                setup.logger.info('Log event #1');
            }, 0);
            setTimeout(function () {
                setup.logger.info('Log event #2');
            }, 500);
            setTimeout(function () {
                setup.logger.info('Log event #3');
            }, 1100);
            setTimeout(function () {
                self.callback(null, setup);
            }, 3000);
        },
        'there should be three messages': function (result) {
            assert.equal(result.mails.length, 3);
        },
        'messages should contain proper data': function (result) {
            checkMessages(result);
        }
    }

}).export(module);
