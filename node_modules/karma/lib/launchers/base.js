var KarmaEventEmitter = require('../events').EventEmitter
var EventEmitter = require('events').EventEmitter
var Promise = require('bluebird')

var log = require('../logger').create('launcher')
var helper = require('../helper')

var BEING_CAPTURED = 1
var CAPTURED = 2
var BEING_KILLED = 3
var FINISHED = 4
var RESTARTING = 5
var BEING_FORCE_KILLED = 6

/**
 * Base launcher that any custom launcher extends.
 */
var BaseLauncher = function (id, emitter) {
  if (this.start) {
    return
  }

  // TODO(vojta): figure out how to do inheritance with DI
  Object.keys(EventEmitter.prototype).forEach(function (method) {
    this[method] = EventEmitter.prototype[method]
  }, this)
  KarmaEventEmitter.call(this)

  this.id = id
  this.state = null
  this.error = null

  var self = this
  var killingPromise
  var previousUrl

  this.start = function (url) {
    previousUrl = url

    this.error = null
    this.state = BEING_CAPTURED
    this.emit('start', url + '?id=' + this.id + (helper.isDefined(self.displayName) ? '&displayName=' + encodeURIComponent(self.displayName) : ''))
  }

  this.kill = function () {
    // Already killed, or being killed.
    if (killingPromise) {
      return killingPromise
    }

    killingPromise = this.emitAsync('kill').then(function () {
      self.state = FINISHED
    })

    this.state = BEING_KILLED

    return killingPromise
  }

  this.forceKill = function () {
    this.kill()
    this.state = BEING_FORCE_KILLED

    return killingPromise
  }

  this.restart = function () {
    if (this.state === BEING_FORCE_KILLED) {
      return
    }

    if (!killingPromise) {
      killingPromise = this.emitAsync('kill')
    }

    killingPromise.then(function () {
      if (self.state === BEING_FORCE_KILLED) {
        self.state = FINISHED
      } else {
        killingPromise = null
        log.debug('Restarting %s', self.name)
        self.start(previousUrl)
      }
    })

    self.state = RESTARTING
  }

  this.markCaptured = function () {
    if (this.state === BEING_CAPTURED) {
      this.state = CAPTURED
    }
  }

  this.isCaptured = function () {
    return this.state === CAPTURED
  }

  this.toString = function () {
    return this.name
  }

  this._done = function (error) {
    killingPromise = killingPromise || Promise.resolve()

    this.error = this.error || error
    this.emit('done')

    if (this.error && this.state !== BEING_FORCE_KILLED && this.state !== RESTARTING) {
      emitter.emit('browser_process_failure', this)
    }

    this.state = FINISHED
  }

  this.STATE_BEING_CAPTURED = BEING_CAPTURED
  this.STATE_CAPTURED = CAPTURED
  this.STATE_BEING_KILLED = BEING_KILLED
  this.STATE_FINISHED = FINISHED
  this.STATE_RESTARTING = RESTARTING
  this.STATE_BEING_FORCE_KILLED = BEING_FORCE_KILLED
}

BaseLauncher.decoratorFactory = function (id, emitter) {
  return function (launcher) {
    BaseLauncher.call(launcher, id, emitter)
  }
}

module.exports = BaseLauncher
