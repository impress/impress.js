var SocketIO = require('socket.io')
var di = require('di')
var util = require('util')
var Promise = require('bluebird')

var root = global || window || this

var cfg = require('./config')
var logger = require('./logger')
var constant = require('./constants')
var watcher = require('./watcher')
var plugin = require('./plugin')

var ws = require('./web-server')
var preprocessor = require('./preprocessor')
var Launcher = require('./launcher').Launcher
var FileList = require('./file-list')
var reporter = require('./reporter')
var helper = require('./helper')
var events = require('./events')
var EventEmitter = events.EventEmitter
var Executor = require('./executor')
var Browser = require('./browser')
var BrowserCollection = require('./browser_collection')
var EmitterWrapper = require('./emitter_wrapper')
var processWrapper = new EmitterWrapper(process)

function createSocketIoServer (webServer, executor, config) {
  var server = new SocketIO(webServer, {
    // avoid destroying http upgrades from socket.io to get proxied websockets working
    destroyUpgrade: false,
    path: config.urlRoot + 'socket.io/',
    transports: config.transports,
    forceJSONP: config.forceJSONP
  })

  // hack to overcome circular dependency
  executor.socketIoSockets = server.sockets

  return server
}

function setupLogger (level, colors) {
  var logLevel = logLevel || constant.LOG_INFO
  var logColors = helper.isDefined(colors) ? colors : true
  logger.setup(logLevel, logColors, [constant.CONSOLE_APPENDER])
}

// Constructor
var Server = function (cliOptions, done) {
  EventEmitter.call(this)

  setupLogger(cliOptions.logLevel, cliOptions.colors)

  this.log = logger.create()

  var config = cfg.parseConfig(cliOptions.configFile, cliOptions)

  var modules = [{
    helper: ['value', helper],
    logger: ['value', logger],
    done: ['value', done || process.exit],
    emitter: ['value', this],
    launcher: ['type', Launcher],
    config: ['value', config],
    preprocess: ['factory', preprocessor.createPreprocessor],
    fileList: ['type', FileList],
    webServer: ['factory', ws.create],
    socketServer: ['factory', createSocketIoServer],
    executor: ['type', Executor],
    // TODO(vojta): remove
    customFileHandlers: ['value', []],
    // TODO(vojta): remove, once karma-dart does not rely on it
    customScriptTypes: ['value', []],
    reporter: ['factory', reporter.createReporters],
    capturedBrowsers: ['type', BrowserCollection],
    args: ['value', {}],
    timer: ['value', {
      setTimeout: function () {
        return setTimeout.apply(root, arguments)
      },
      clearTimeout: function (timeoutId) {
        clearTimeout(timeoutId)
      }
    }]
  }]

  // Load the plugins
  modules = modules.concat(plugin.resolve(config.plugins))

  this._injector = new di.Injector(modules)
}

// Inherit from events.EventEmitter
util.inherits(Server, EventEmitter)

// Public Methods
// --------------

// Start the server
Server.prototype.start = function () {
  this._injector.invoke(this._start, this)
}

/**
 * Backward-compatibility with karma-intellij bundled with WebStorm.
 * Deprecated since version 0.13, to be removed in 0.14
 */
Server.start = function (cliOptions, done) {
  var server = new Server(cliOptions, done)
  server.start()
}

// Get properties from the injector
//
// token - String
Server.prototype.get = function (token) {
  return this._injector.get(token)
}

// Force a refresh of the file list
Server.prototype.refreshFiles = function () {
  if (!this._fileList) return Promise.resolve()

  return this._fileList.refresh()
}

// Private Methods
// ---------------

Server.prototype._start = function (config, launcher, preprocess, fileList, webServer,
                                    capturedBrowsers, socketServer, executor, done) {
  var self = this

  self._fileList = fileList

  config.frameworks.forEach(function (framework) {
    self._injector.get('framework:' + framework)
  })

  // A map of launched browsers.
  var singleRunDoneBrowsers = Object.create(null)

  // Passing fake event emitter, so that it does not emit on the global,
  // we don't care about these changes.
  var singleRunBrowsers = new BrowserCollection(new EventEmitter())

  // Some browsers did not get captured.
  var singleRunBrowserNotCaptured = false

  webServer.on('error', function (e) {
    if (e.code === 'EADDRINUSE') {
      self.log.warn('Port %d in use', config.port)
      config.port++
      webServer.listen(config.port)
    } else {
      throw e
    }
  })

  var afterPreprocess = function () {
    if (config.autoWatch) {
      self._injector.invoke(watcher.watch)
    }

    webServer.listen(config.port, function () {
      self.log.info('Karma v%s server started at %s//%s:%s%s', constant.VERSION,
        config.protocol, config.hostname, config.port, config.urlRoot)

      if (config.browsers && config.browsers.length) {
        self._injector.invoke(launcher.launch, launcher).forEach(function (browserLauncher) {
          singleRunDoneBrowsers[browserLauncher.id] = false
        })
      }
    })
  }

  fileList.refresh().then(afterPreprocess, afterPreprocess)

  self.on('browsers_change', function () {
    // TODO(vojta): send only to interested browsers
    socketServer.sockets.emit('info', capturedBrowsers.serialize())
  })

  self.on('browser_register', function (browser) {
    launcher.markCaptured(browser.id)

    // TODO(vojta): This is lame, browser can get captured and then
    // crash (before other browsers get captured).
    if (launcher.areAllCaptured()) {
      self.emit('browsers_ready')

      if (config.autoWatch) {
        executor.schedule()
      }
    }
  })

  var EVENTS_TO_REPLY = ['start', 'info', 'karma_error', 'result', 'complete']
  socketServer.sockets.on('connection', function (socket) {
    self.log.debug('A browser has connected on socket ' + socket.id)

    var replySocketEvents = events.bufferEvents(socket, EVENTS_TO_REPLY)

    socket.on('complete', function (data, ack) {
      ack()
    })

    socket.on('register', function (info) {
      var newBrowser
      var isRestart

      if (info.id) {
        newBrowser = capturedBrowsers.getById(info.id) || singleRunBrowsers.getById(info.id)
      }

      if (newBrowser) {
        isRestart = newBrowser.state === Browser.STATE_DISCONNECTED
        newBrowser.reconnect(socket)

        // We are restarting a previously disconnected browser.
        if (isRestart && config.singleRun) {
          newBrowser.execute(config.client)
        }
      } else {
        newBrowser = self._injector.createChild([{
          id: ['value', info.id || null],
          fullName: ['value', (helper.isDefined(info.displayName) ? info.displayName : info.name)],
          socket: ['value', socket]
        }]).instantiate(Browser)

        newBrowser.init()

        // execute in this browser immediately
        if (config.singleRun) {
          newBrowser.execute(config.client)
          singleRunBrowsers.add(newBrowser)
        }
      }

      replySocketEvents()
    })
  })

  var emitRunCompleteIfAllBrowsersDone = function () {
    // all browsers done
    var isDone = Object.keys(singleRunDoneBrowsers).reduce(function (isDone, id) {
      return isDone && singleRunDoneBrowsers[id]
    }, true)

    if (isDone) {
      var results = singleRunBrowsers.getResults()
      if (singleRunBrowserNotCaptured) {
        results.exitCode = 1
      } else if (results.success + results.failed === 0 && !config.failOnEmptyTestSuite) {
        results.exitCode = 0
        self.log.warn('Test suite was empty.')
      }
      self.emit('run_complete', singleRunBrowsers, results)
    }
  }

  if (config.singleRun) {
    self.on('browser_complete', function (completedBrowser) {
      if (completedBrowser.lastResult.disconnected &&
        completedBrowser.disconnectsCount <= config.browserDisconnectTolerance) {
        self.log.info('Restarting %s (%d of %d attempts)', completedBrowser.name,
          completedBrowser.disconnectsCount, config.browserDisconnectTolerance)
        if (!launcher.restart(completedBrowser.id)) {
          singleRunDoneBrowsers[completedBrowser.id] = true
          emitRunCompleteIfAllBrowsersDone()
        }
      } else {
        singleRunDoneBrowsers[completedBrowser.id] = true

        if (launcher.kill(completedBrowser.id)) {
          // workaround to supress "disconnect" warning
          completedBrowser.state = Browser.STATE_DISCONNECTED
        }

        emitRunCompleteIfAllBrowsersDone()
      }
    })

    self.on('browser_process_failure', function (browserLauncher) {
      singleRunDoneBrowsers[browserLauncher.id] = true
      singleRunBrowserNotCaptured = true

      emitRunCompleteIfAllBrowsersDone()
    })

    self.on('run_complete', function (browsers, results) {
      self.log.debug('Run complete, exiting.')
      disconnectBrowsers(results.exitCode)
    })

    self.emit('run_start', singleRunBrowsers)
  }

  if (config.autoWatch) {
    self.on('file_list_modified', function () {
      self.log.debug('List of files has changed, trying to execute')
      if (config.restartOnFileChange) {
        socketServer.sockets.emit('stop')
      }
      executor.schedule()
    })
  }

  var webServerCloseTimeout = 3000
  var disconnectBrowsers = function (code) {
    // Slightly hacky way of removing disconnect listeners
    // to suppress "browser disconnect" warnings
    // TODO(vojta): change the client to not send the event (if disconnected by purpose)
    var sockets = socketServer.sockets.sockets

    Object.keys(sockets).forEach(function (id) {
      var socket = sockets[id]
      socket.removeAllListeners('disconnect')
      if (!socket.disconnected) {
        // Disconnect asynchronously. Socket.io mutates the `sockets.sockets` array
        // underneath us so this would skip every other browser/socket.
        process.nextTick(socket.disconnect.bind(socket))
      }
    })

    var removeAllListenersDone = false
    var removeAllListeners = function () {
      // make sure we don't execute cleanup twice
      if (removeAllListenersDone) {
        return
      }
      removeAllListenersDone = true
      webServer.removeAllListeners()
      processWrapper.removeAllListeners()
      done(code || 0)
    }

    self.emitAsync('exit').then(function () {
      // don't wait forever on webServer.close() because
      // pending client connections prevent it from closing.
      var closeTimeout = setTimeout(removeAllListeners, webServerCloseTimeout)

      // shutdown the server...
      webServer.close(function () {
        clearTimeout(closeTimeout)
        removeAllListeners()
      })
    })
  }

  processWrapper.on('SIGINT', disconnectBrowsers)
  processWrapper.on('SIGTERM', disconnectBrowsers)

  // Handle all unhandled exceptions, so we don't just exit but
  // disconnect the browsers before exiting.
  processWrapper.on('uncaughtException', function (error) {
    self.log.error(error)
    disconnectBrowsers(1)
  })
}

// Export
// ------

module.exports = Server
