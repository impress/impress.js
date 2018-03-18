var Promise = require('bluebird')
var Batch = require('batch')

var helper = require('./helper')
var log = require('./logger').create('launcher')

var baseDecorator = require('./launchers/base').decoratorFactory
var captureTimeoutDecorator = require('./launchers/capture_timeout').decoratorFactory
var retryDecorator = require('./launchers/retry').decoratorFactory
var processDecorator = require('./launchers/process').decoratorFactory

// TODO(vojta): remove once nobody uses it
var baseBrowserDecoratorFactory = function (baseLauncherDecorator, captureTimeoutLauncherDecorator,
  retryLauncherDecorator, processLauncherDecorator) {
  return function (launcher) {
    baseLauncherDecorator(launcher)
    captureTimeoutLauncherDecorator(launcher)
    retryLauncherDecorator(launcher)
    processLauncherDecorator(launcher)
  }
}

var Launcher = function (emitter, injector) {
  var browsers = []
  var lastStartTime

  var getBrowserById = function (id) {
    for (var i = 0; i < browsers.length; i++) {
      if (browsers[i].id === id) {
        return browsers[i]
      }
    }

    return null
  }

  this.launch = function (names, protocol, hostname, port, urlRoot, concurrency) {
    var url = protocol + '//' + hostname + ':' + port + urlRoot
    var batch = new Batch()
    batch.concurrency(concurrency)

    lastStartTime = Date.now()

    names.forEach(function (name) {
      var locals = {
        id: ['value', Launcher.generateId()],
        name: ['value', name],
        baseLauncherDecorator: ['factory', baseDecorator],
        captureTimeoutLauncherDecorator: ['factory', captureTimeoutDecorator],
        retryLauncherDecorator: ['factory', retryDecorator],
        processLauncherDecorator: ['factory', processDecorator],
        baseBrowserDecorator: ['factory', baseBrowserDecoratorFactory]
      }

      // TODO(vojta): determine script from name
      if (name.indexOf('/') !== -1) {
        name = 'Script'
      }

      try {
        var browser = injector.createChild([locals], ['launcher:' + name]).get('launcher:' + name)
      } catch (e) {
        if (e.message.indexOf('No provider for "launcher:' + name + '"') !== -1) {
          log.warn('Can not load "%s", it is not registered!\n  ' +
            'Perhaps you are missing some plugin?', name)
        } else {
          log.warn('Can not load "%s"!\n  ' + e.stack, name)
        }

        return
      }

      // TODO(vojta): remove in v1.0 (BC for old launchers)
      if (!browser.forceKill) {
        browser.forceKill = function () {
          var self = this

          return new Promise(function (resolve) {
            self.kill(resolve)
          })
        }

        browser.restart = function () {
          var self = this
          this.kill(function () {
            self.start(url)
          })
        }
      }

      batch.push(function (done) {
        log.info('Starting browser %s', helper.isDefined(browser.displayName) ? browser.displayName : browser.name)

        browser.start(url)
        browser.on('browser_process_failure', function () {
          done(browser.error)
        })

        browser.on('done', function () {
          // We are not done if there was an error as first the retry takes
          // place which we catch with `browser_process_failure` if it fails
          if (browser.error) return

          done(null, browser)
        })
      })

      browsers.push(browser)
    })

    batch.end(function (err) {
      log.debug('Finished all browsers')

      if (err) {
        log.error(err)
      }
    })

    return browsers
  }

  this.launch.$inject = [
    'config.browsers',
    'config.protocol',
    'config.hostname',
    'config.port',
    'config.urlRoot',
    'config.concurrency'
  ]

  this.kill = function (id, callback) {
    var browser = getBrowserById(id)
    callback = callback || function () {}

    if (!browser) {
      process.nextTick(callback)
      return false
    }

    browser.forceKill().then(callback)
    return true
  }

  this.restart = function (id) {
    var browser = getBrowserById(id)

    if (!browser) {
      return false
    }

    browser.restart()
    return true
  }

  this.killAll = function (callback) {
    log.debug('Disconnecting all browsers')

    var remaining = 0
    var finish = function () {
      remaining--
      if (!remaining && callback) {
        callback()
      }
    }

    if (!browsers.length) {
      return process.nextTick(callback)
    }

    browsers.forEach(function (browser) {
      remaining++
      browser.forceKill().then(finish)
    })
  }

  this.areAllCaptured = function () {
    return !browsers.some(function (browser) {
      return !browser.isCaptured()
    })
  }

  this.markCaptured = function (id) {
    browsers.forEach(function (browser) {
      if (browser.id === id) {
        browser.markCaptured()
        log.debug('%s (id %s) captured in %d secs', browser.name, browser.id,
          (Date.now() - lastStartTime) / 1000)
      }
    })
  }

  // register events
  emitter.on('exit', this.killAll)
}

Launcher.$inject = ['emitter', 'injector']

Launcher.generateId = function () {
  return '' + Math.floor(Math.random() * 100000000)
}

// PUBLISH
exports.Launcher = Launcher
