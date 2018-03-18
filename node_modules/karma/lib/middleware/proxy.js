var url = require('url')
var httpProxy = require('http-proxy')

var log = require('../logger').create('proxy')
var _ = require('../helper')._

var parseProxyConfig = function (proxies, config) {
  var endsWithSlash = function (str) {
    return str.substr(-1) === '/'
  }

  if (!proxies) {
    return []
  }

  return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
    if (typeof proxyConfiguration === 'string') {
      proxyConfiguration = {target: proxyConfiguration}
    }
    var proxyUrl = proxyConfiguration.target
    var proxyDetails = url.parse(proxyUrl)
    var pathname = proxyDetails.pathname

    // normalize the proxies config
    // should we move this to lib/config.js ?
    if (endsWithSlash(proxyPath) && !endsWithSlash(proxyUrl)) {
      log.warn('proxy "%s" normalized to "%s"', proxyUrl, proxyUrl + '/')
      proxyUrl += '/'
      pathname += '/'
    }

    if (!endsWithSlash(proxyPath) && endsWithSlash(proxyUrl)) {
      log.warn('proxy "%s" normalized to "%s"', proxyPath, proxyPath + '/')
      proxyPath += '/'
    }

    if (pathname === '/' && !endsWithSlash(proxyUrl)) {
      pathname = ''
    }

    var hostname = proxyDetails.hostname || config.hostname
    var protocol = proxyDetails.protocol || config.protocol
    var port = proxyDetails.port || config.port ||
      (proxyDetails.protocol === 'https:' ? '443' : '80')
    var https = proxyDetails.protocol === 'https:'

    var changeOrigin = 'changeOrigin' in proxyConfiguration ? proxyConfiguration.changeOrigin : false
    var proxy = httpProxy.createProxyServer({
      target: {
        host: hostname,
        port: port,
        https: https,
        protocol: protocol
      },
      xfwd: true,
      changeOrigin: changeOrigin,
      secure: config.proxyValidateSSL
    })

    proxy.on('error', function proxyError (err, req, res) {
      if (err.code === 'ECONNRESET' && req.socket.destroyed) {
        log.debug('failed to proxy %s (browser hung up the socket)', req.url)
      } else {
        log.warn('failed to proxy %s (%s)', req.url, err.message)
      }

      res.destroy()
    })

    return {
      path: proxyPath,
      baseUrl: pathname,
      host: hostname,
      port: port,
      https: https,
      proxy: proxy
    }
  }), 'path').reverse()
}

/**
 * Returns a handler which understands the proxies and its redirects, along with the proxy to use
 * @param proxies An array of proxy record objects
 * @param urlRoot The URL root that karma is mounted on
 * @return {Function} handler function
 */
var createProxyHandler = function (proxies, urlRoot) {
  if (!proxies.length) {
    var nullProxy = function createNullProxy (request, response, next) {
      return next()
    }
    nullProxy.upgrade = function upgradeNullProxy () {}
    return nullProxy
  }

  var middleware = function createProxy (request, response, next) {
    var proxyRecord = _.find(proxies, function (p) {
      return request.url.indexOf(p.path) === 0
    })

    if (!proxyRecord) {
      return next()
    }

    log.debug('proxying request - %s to %s:%s', request.url, proxyRecord.host, proxyRecord.port)
    request.url = request.url.replace(proxyRecord.path, proxyRecord.baseUrl)
    proxyRecord.proxy.web(request, response)
  }

  middleware.upgrade = function upgradeProxy (request, socket, head) {
    // special-case karma's route to avoid upgrading it
    if (request.url.indexOf(urlRoot) === 0) {
      log.debug('NOT upgrading proxyWebSocketRequest %s', request.url)
      return
    }

    var proxyRecord = _.find(proxies, function (p) {
      return request.url.indexOf(p.path) === 0
    })

    if (!proxyRecord) {
      return
    }

    log.debug('upgrade proxyWebSocketRequest %s to %s:%s',
      request.url, proxyRecord.host, proxyRecord.port)
    request.url = request.url.replace(proxyRecord.path, proxyRecord.baseUrl)
    proxyRecord.proxy.ws(request, socket, head)
  }

  return middleware
}

exports.create = function (/* config */config, /* config.proxies */proxies) {
  return createProxyHandler(parseProxyConfig(proxies, config), config.urlRoot)
}
