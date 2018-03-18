/**
 * Strip host middleware is responsible for stripping hostname from request path
 * This to handle requests that uses (normally over proxies) an absoluteURI as request path
 */

var createStripHostMiddleware = function () {
  return function (request, response, next) {
    function stripHostFromUrl (url) {
      return url.replace(/^http[s]?:\/\/([a-z\-\.\:\d]+)\//, '/')
    }

    request.normalizedUrl = stripHostFromUrl(request.url) || request.url
    next()
  }
}

// PUBLIC API
exports.create = createStripHostMiddleware
