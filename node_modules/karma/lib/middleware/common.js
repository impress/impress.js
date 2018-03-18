/**
 * This module contains some common helpers shared between middlewares
 */

var mime = require('mime')
var log = require('../logger').create('web-server')
var helper = require('../helper')
var _ = helper._

var PromiseContainer = function () {
  var promise

  this.then = function (success, error) {
    return promise.then(success).catch(error)
  }

  this.set = function (newPromise) {
    promise = newPromise
  }
}

var serve404 = function (response, path) {
  log.warn('404: ' + path)
  response.writeHead(404)
  return response.end('NOT FOUND')
}

var createServeFile = function (fs, directory, config) {
  var cache = Object.create(null)

  return function (filepath, response, transform, content, doNotCache) {
    var responseData

    if (directory) {
      filepath = directory + filepath
    }

    if (!content && cache[filepath]) {
      content = cache[filepath]
    }

    if (config && config.customHeaders && config.customHeaders.length > 0) {
      config.customHeaders.forEach(function (header) {
        var regex = new RegExp(header.match)
        if (regex.test(filepath)) {
          log.debug('setting header: ' + header.name + ' for: ' + filepath)
          response.setHeader(header.name, header.value)
        }
      })
    }

    // serve from cache
    if (content && !doNotCache) {
      response.setHeader('Content-Type', mime.lookup(filepath, 'text/plain'))

      // call custom transform fn to transform the data
      responseData = transform && transform(content) || content

      response.writeHead(200)

      log.debug('serving (cached): ' + filepath)
      return response.end(responseData)
    }

    return fs.readFile(filepath, function (error, data) {
      if (error) {
        return serve404(response, filepath)
      }

      if (!doNotCache) {
        cache[filepath] = data.toString()
      }

      response.setHeader('Content-Type', mime.lookup(filepath, 'text/plain'))

      // call custom transform fn to transform the data
      responseData = transform && transform(data.toString()) || data

      response.writeHead(200)

      log.debug('serving: ' + filepath)
      return response.end(responseData)
    })
  }
}

var setNoCacheHeaders = function (response) {
  response.setHeader('Cache-Control', 'no-cache')
  response.setHeader('Pragma', 'no-cache')
  response.setHeader('Expires', (new Date(0)).toUTCString())
}

var setHeavyCacheHeaders = function (response) {
  response.setHeader('Cache-Control', 'public, max-age=31536000')
}

var initializeMimeTypes = function (config) {
  if (config && config.mime) {
    _.forEach(config.mime, function (value, key) {
      var map = {}
      map[key] = value
      mime.define(map)
    })
  }
}

// PUBLIC API
exports.PromiseContainer = PromiseContainer
exports.createServeFile = createServeFile
exports.setNoCacheHeaders = setNoCacheHeaders
exports.setHeavyCacheHeaders = setHeavyCacheHeaders
exports.initializeMimeTypes = initializeMimeTypes
exports.serve404 = serve404
