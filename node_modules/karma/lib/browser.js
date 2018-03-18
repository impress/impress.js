var helper = require('./helper')
var events = require('./events')
var logger = require('./logger')

var Result = require('./browser_result')

// The browser is ready to execute tests.
var READY = 1

// The browser is executing the tests.
var EXECUTING = 2

// The browser is not executing, but temporarily disconnected (waiting for reconnecting).
var READY_DISCONNECTED = 3

// The browser is executing the tests, but temporarily disconnect (waiting for reconnecting).
var EXECUTING_DISCONNECTED = 4

// The browser got permanently disconnected (being removed from the collection and destroyed).
var DISCONNECTED = 5

var Browser = function (id, fullName, /* capturedBrowsers */ collection, emitter, socket, timer,
  /* config.browserDisconnectTimeout */ disconnectDelay,
  /* config.browserNoActivityTimeout */ noActivityTimeout) {
  var name = helper.browserFullNameToShort(fullName)
  var log = logger.create(name)
  var activeSockets = [socket]
  var activeSocketsIds = function () {
    return activeSockets.map(function (s) {
      return s.id
    }).join(', ')
  }

  var self = this
  var pendingDisconnect
  var disconnect = function (reason) {
    self.state = DISCONNECTED
    self.disconnectsCount++
    log.warn('Disconnected (%d times)' + (reason || ''), self.disconnectsCount)
    collection.remove(self)
  }

  var noActivityTimeoutId
  var refreshNoActivityTimeout = noActivityTimeout ? function () {
    clearNoActivityTimeout()
    noActivityTimeoutId = timer.setTimeout(function () {
      self.lastResult.totalTimeEnd()
      self.lastResult.disconnected = true
      disconnect(', because no message in ' + noActivityTimeout + ' ms.')
      emitter.emit('browser_complete', self)
    }, noActivityTimeout)
  } : function () {}

  var clearNoActivityTimeout = noActivityTimeout ? function () {
    if (noActivityTimeoutId) {
      timer.clearTimeout(noActivityTimeoutId)
      noActivityTimeoutId = null
    }
  } : function () {}

  this.id = id
  this.fullName = fullName
  this.name = name
  this.state = READY
  this.lastResult = new Result()
  this.disconnectsCount = 0

  this.init = function () {
    collection.add(this)

    events.bindAll(this, socket)

    log.info('Connected on socket %s with id %s', socket.id, id)

    // TODO(vojta): move to collection
    emitter.emit('browsers_change', collection)

    emitter.emit('browser_register', this)
  }

  this.isReady = function () {
    return this.state === READY
  }

  this.toString = function () {
    return this.name
  }

  this.onKarmaError = function (error) {
    if (this.isReady()) {
      return
    }

    this.lastResult.error = true
    emitter.emit('browser_error', this, error)

    refreshNoActivityTimeout()
  }

  this.onInfo = function (info) {
    if (this.isReady()) {
      return
    }

    // TODO(vojta): remove
    if (helper.isDefined(info.dump)) {
      emitter.emit('browser_log', this, info.dump, 'dump')
    }

    if (helper.isDefined(info.log)) {
      emitter.emit('browser_log', this, info.log, info.type)
    }

    refreshNoActivityTimeout()
  }

  this.onStart = function (info) {
    this.lastResult = new Result()
    this.lastResult.total = info.total

    if (info.total === null) {
      log.warn('Adapter did not report total number of specs.')
    }

    emitter.emit('browser_start', this, info)
    refreshNoActivityTimeout()
  }

  this.onComplete = function (result) {
    if (this.isReady()) {
      return
    }

    this.state = READY
    this.lastResult.totalTimeEnd()

    if (!this.lastResult.success) {
      this.lastResult.error = true
    }

    emitter.emit('browsers_change', collection)
    emitter.emit('browser_complete', this, result)

    clearNoActivityTimeout()
  }

  this.onDisconnect = function (_, disconnectedSocket) {
    activeSockets.splice(activeSockets.indexOf(disconnectedSocket), 1)

    if (activeSockets.length) {
      log.debug('Disconnected %s, still have %s', disconnectedSocket.id, activeSocketsIds())
      return
    }

    if (this.state === READY) {
      disconnect()
    } else if (this.state === EXECUTING) {
      log.debug('Disconnected during run, waiting %sms for reconnecting.', disconnectDelay)
      this.state = EXECUTING_DISCONNECTED

      pendingDisconnect = timer.setTimeout(function () {
        self.lastResult.totalTimeEnd()
        self.lastResult.disconnected = true
        disconnect()
        emitter.emit('browser_complete', self)
      }, disconnectDelay)

      clearNoActivityTimeout()
    }
  }

  this.reconnect = function (newSocket) {
    if (this.state === EXECUTING_DISCONNECTED) {
      this.state = EXECUTING
      log.debug('Reconnected on %s.', newSocket.id)
    } else if (this.state === EXECUTING || this.state === READY) {
      log.debug('New connection %s (already have %s)', newSocket.id, activeSocketsIds())
    } else if (this.state === DISCONNECTED) {
      this.state = READY
      log.info('Connected on socket %s with id %s', newSocket.id, this.id)
      collection.add(this)

      // TODO(vojta): move to collection
      emitter.emit('browsers_change', collection)

      emitter.emit('browser_register', this)
    }

    var exists = activeSockets.some(function (s) {
      return s.id === newSocket.id
    })
    if (!exists) {
      activeSockets.push(newSocket)
      events.bindAll(this, newSocket)
    }

    if (pendingDisconnect) {
      timer.clearTimeout(pendingDisconnect)
    }

    refreshNoActivityTimeout()
  }

  this.onResult = function (result) {
    if (result.length) {
      return result.forEach(this.onResult, this)
    }

    // ignore - probably results from last run (after server disconnecting)
    if (this.isReady()) {
      return
    }

    this.lastResult.add(result)

    emitter.emit('spec_complete', this, result)
    refreshNoActivityTimeout()
  }

  this.serialize = function () {
    return {
      id: this.id,
      name: this.name,
      isReady: this.state === READY
    }
  }

  this.execute = function (config) {
    activeSockets.forEach(function (socket) {
      socket.emit('execute', config)
    })

    this.state = EXECUTING
    refreshNoActivityTimeout()
  }
}

Browser.STATE_READY = READY
Browser.STATE_EXECUTING = EXECUTING
Browser.STATE_READY_DISCONNECTED = READY_DISCONNECTED
Browser.STATE_EXECUTING_DISCONNECTED = EXECUTING_DISCONNECTED
Browser.STATE_DISCONNECTED = DISCONNECTED

module.exports = Browser
