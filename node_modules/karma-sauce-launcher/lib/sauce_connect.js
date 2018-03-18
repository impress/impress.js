var q = require('q')
var launchSauceConnect = require('sauce-connect-launcher')

var SauceConnect = function (emitter, logger) {
  var log = logger.create('launcher.sauce')
  var alreadyRunningDefered
  var alreadyRunningProces

  this.start = function (connectOptions, done) {
    connectOptions.logger = log.debug.bind(log)

    // TODO(vojta): if different username/accessKey, start a new process
    if (alreadyRunningDefered) {
      log.debug('Sauce Connect is already running or starting')
      return alreadyRunningDefered.promise
    }

    alreadyRunningDefered = q.defer()
    launchSauceConnect(connectOptions, function (err, p) {
      if (err) {
        return alreadyRunningDefered.reject(err)
      }

      alreadyRunningProces = p
      alreadyRunningDefered.resolve()
    })

    return alreadyRunningDefered.promise
  }

  emitter.on('exit', function (done) {
    if (alreadyRunningProces) {
      log.info('Shutting down Sauce Connect')
      alreadyRunningProces.close(done)
      alreadyRunningProces = null
    } else {
      done()
    }
  })
}

module.exports = SauceConnect
