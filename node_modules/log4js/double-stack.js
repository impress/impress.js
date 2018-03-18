var log4js = require('./lib/log4js');
log4js.configure({
    appenders: [
        {
            type: 'console'
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger();

logger.error(new Error("my error"));
