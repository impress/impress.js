var events = require('events')
var util = require('util')

var helper = require('./helper')

var bindAllEvents = function (object, context) {
  context = context || this

  var bindMethod = function (method) {
    context.on(helper.camelToSnake(method.substr(2)), function () {
      var args = Array.prototype.slice.call(arguments, 0)
      args.push(context)
      object[method].apply(object, args)
    })
  }

  for (var method in object) {
    if (helper.isFunction(object[method]) && method.substr(0, 2) === 'on') {
      bindMethod(method)
    }
  }
}

var bufferEvents = function (emitter, eventsToBuffer) {
  var listeners = []
  var eventsToReply = []
  var genericListener = function () {
    eventsToReply.push(Array.prototype.slice.call(arguments))
  }

  eventsToBuffer.forEach(function (eventName) {
    var listener = genericListener.bind(null, eventName)
    listeners.push(listener)
    emitter.on(eventName, listener)
  })

  return function () {
    if (!eventsToReply) {
      return
    }

    // remove all buffering listeners
    listeners.forEach(function (listener, i) {
      emitter.removeListener(eventsToBuffer[i], listener)
    })

    // reply
    eventsToReply.forEach(function (args) {
      events.EventEmitter.prototype.emit.apply(emitter, args)
    })

    // free-up
    listeners = eventsToReply = null
  }
}

// TODO(vojta): log.debug all events
var EventEmitter = function () {
  this.bind = bindAllEvents

  this.emitAsync = function (name) {
    // TODO(vojta): allow passing args
    // TODO(vojta): ignore/throw if listener call done() multiple times
    var pending = this.listeners(name).length
    var deferred = helper.defer()
    var done = function () {
      if (!--pending) {
        deferred.resolve()
      }
    }

    this.emit(name, done)

    if (!pending) {
      deferred.resolve()
    }

    return deferred.promise
  }
}

util.inherits(EventEmitter, events.EventEmitter)

// PUBLISH
exports.EventEmitter = EventEmitter
exports.bindAll = bindAllEvents
exports.bufferEvents = bufferEvents
