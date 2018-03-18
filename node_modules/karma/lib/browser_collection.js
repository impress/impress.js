var EXECUTING = require('./browser').STATE_EXECUTING
var Result = require('./browser_result')

var Collection = function (emitter, browsers) {
  browsers = browsers || []

  this.add = function (browser) {
    browsers.push(browser)
    emitter.emit('browsers_change', this)
  }

  this.remove = function (browser) {
    var index = browsers.indexOf(browser)

    if (index === -1) {
      return false
    }

    browsers.splice(index, 1)
    emitter.emit('browsers_change', this)

    return true
  }

  this.getById = function (browserId) {
    for (var i = 0; i < browsers.length; i++) {
      if (browsers[i].id === browserId) {
        return browsers[i]
      }
    }

    return null
  }

  this.setAllToExecuting = function () {
    browsers.forEach(function (browser) {
      browser.state = EXECUTING
    })

    emitter.emit('browsers_change', this)
  }

  this.areAllReady = function (nonReadyList) {
    nonReadyList = nonReadyList || []

    browsers.forEach(function (browser) {
      if (!browser.isReady()) {
        nonReadyList.push(browser)
      }
    })

    return nonReadyList.length === 0
  }

  this.serialize = function () {
    return browsers.map(function (browser) {
      return browser.serialize()
    })
  }

  this.getResults = function () {
    var results = browsers.reduce(function (previous, current) {
      previous.success += current.lastResult.success
      previous.failed += current.lastResult.failed
      previous.error = previous.error || current.lastResult.error
      previous.disconnected = previous.disconnected || current.lastResult.disconnected
      return previous
    }, {success: 0, failed: 0, error: false, disconnected: false, exitCode: 0})

    // compute exit status code
    results.exitCode = results.failed || results.error || results.disconnected ? 1 : 0

    return results
  }

  // TODO(vojta): can we remove this? (we clear the results per browser in onBrowserStart)
  this.clearResults = function () {
    browsers.forEach(function (browser) {
      browser.lastResult = new Result()
    })
  }

  this.clone = function () {
    return new Collection(emitter, browsers.slice())
  }

  // Array APIs
  this.map = function (callback, context) {
    return browsers.map(callback, context)
  }

  this.forEach = function (callback, context) {
    return browsers.forEach(callback, context)
  }

  // this.length
  Object.defineProperty(this, 'length', {
    get: function () {
      return browsers.length
    }
  })
}
Collection.$inject = ['emitter']

module.exports = Collection
