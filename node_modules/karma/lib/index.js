// index module

var constants = require('./constants')
var Server = require('./server')
var runner = require('./runner')
var launcher = require('./launcher')

// TODO: remove in 1.0
var oldServer = {
  start: function (cliOptions, done) {
    console.error('WARN `start` method is deprecated since 0.13. It will be removed in 0.14. Please use \n' +
      '  server = new Server(config, [done])\n' +
      '  server.start()\n' +
      'instead.')
    var server = new Server(cliOptions, done)
    server.start()
  }
}

module.exports = {
  VERSION: constants.VERSION,
  Server: Server,
  runner: runner,
  launcher: launcher,
  server: oldServer
}
