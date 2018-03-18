var fs = require('graceful-fs')

var pkg = JSON.parse(fs.readFileSync(__dirname + '/../package.json').toString())

exports.VERSION = pkg.version

exports.DEFAULT_PORT = process.env.PORT || 9876
exports.DEFAULT_HOSTNAME = process.env.IP || 'localhost'

// log levels
exports.LOG_DISABLE = 'OFF'
exports.LOG_ERROR = 'ERROR'
exports.LOG_WARN = 'WARN'
exports.LOG_INFO = 'INFO'
exports.LOG_DEBUG = 'DEBUG'

// Default patterns for the pattern layout.
exports.COLOR_PATTERN = '%[%d{DATE}:%p [%c]: %]%m'
exports.NO_COLOR_PATTERN = '%d{DATE}:%p [%c]: %m'

// Default console appender
exports.CONSOLE_APPENDER = {
  type: 'console',
  layout: {
    type: 'pattern',
    pattern: exports.COLOR_PATTERN
  }
}

exports.EXIT_CODE = '\x1FEXIT'
