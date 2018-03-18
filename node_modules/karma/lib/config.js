var path = require('path')

var logger = require('./logger')
var log = logger.create('config')
var helper = require('./helper')
var constant = require('./constants')

var COFFEE_SCRIPT_AVAILABLE = false
var LIVE_SCRIPT_AVAILABLE = false

// Coffee is required here to enable config files written in coffee-script.
// It's not directly used in this file.
try {
  require('coffee-script').register()
  COFFEE_SCRIPT_AVAILABLE = true
} catch (e) {}

// LiveScript is required here to enable config files written in LiveScript.
// It's not directly used in this file.
try {
  require('LiveScript')
  LIVE_SCRIPT_AVAILABLE = true
} catch (e) {}

var Pattern = function (pattern, served, included, watched, nocache) {
  this.pattern = pattern
  this.served = helper.isDefined(served) ? served : true
  this.included = helper.isDefined(included) ? included : true
  this.watched = helper.isDefined(watched) ? watched : true
  this.nocache = helper.isDefined(nocache) ? nocache : false
}

var UrlPattern = function (url) {
  Pattern.call(this, url, false, true, false, false)
}

var createPatternObject = function (pattern) {
  if (pattern && helper.isString(pattern)) {
    return helper.isUrlAbsolute(pattern) ? new UrlPattern(pattern) : new Pattern(pattern)
  }

  if (helper.isObject(pattern)) {
    if (pattern.pattern && helper.isString(pattern.pattern)) {
      return helper.isUrlAbsolute(pattern.pattern)
        ? new UrlPattern(pattern.pattern)
        : new Pattern(
          pattern.pattern,
          pattern.served,
          pattern.included,
          pattern.watched,
          pattern.nocache)
    }

    log.warn('Invalid pattern %s!\n\tObject is missing "pattern" property.', pattern)
    return new Pattern(null, false, false, false, false)
  }

  log.warn('Invalid pattern %s!\n\tExpected string or object with "pattern" property.', pattern)
  return new Pattern(null, false, false, false, false)
}

var normalizeUrlRoot = function (urlRoot) {
  var normalizedUrlRoot = urlRoot

  if (normalizedUrlRoot.charAt(0) !== '/') {
    normalizedUrlRoot = '/' + normalizedUrlRoot
  }

  if (normalizedUrlRoot.charAt(normalizedUrlRoot.length - 1) !== '/') {
    normalizedUrlRoot = normalizedUrlRoot + '/'
  }

  if (normalizedUrlRoot !== urlRoot) {
    log.warn('urlRoot normalized to "%s"', normalizedUrlRoot)
  }

  return normalizedUrlRoot
}

var normalizeConfig = function (config, configFilePath) {
  var basePathResolve = function (relativePath) {
    if (helper.isUrlAbsolute(relativePath)) {
      return relativePath
    }

    if (!helper.isDefined(config.basePath) || !helper.isDefined(relativePath)) {
      return ''
    }
    return path.resolve(config.basePath, relativePath)
  }

  var createPatternMapper = function (resolve) {
    return function (objectPattern) {
      objectPattern.pattern = resolve(objectPattern.pattern)

      return objectPattern
    }
  }

  if (helper.isString(configFilePath)) {
    // resolve basePath
    config.basePath = path.resolve(path.dirname(configFilePath), config.basePath)

    // always ignore the config file itself
    config.exclude.push(configFilePath)
  } else {
    config.basePath = path.resolve(config.basePath || '.')
  }

  config.files = config.files.map(createPatternObject).map(createPatternMapper(basePathResolve))
  config.exclude = config.exclude.map(basePathResolve)

  // normalize paths on windows
  config.basePath = helper.normalizeWinPath(config.basePath)
  config.files = config.files.map(createPatternMapper(helper.normalizeWinPath))
  config.exclude = config.exclude.map(helper.normalizeWinPath)

  // normalize urlRoot
  config.urlRoot = normalizeUrlRoot(config.urlRoot)

  // force protocol to end with ':'
  config.protocol = (config.protocol || 'http').split(':')[0] + ':'
  if (config.protocol.match(/https?:/) === null) {
    log.warn('"%s" is not a supported protocol, defaulting to "http:"',
      config.protocol)
    config.protocol = 'http:'
  }

  if (config.proxies && config.proxies.hasOwnProperty(config.urlRoot)) {
    log.warn('"%s" is proxied, you should probably change urlRoot to avoid conflicts',
      config.urlRoot)
  }

  if (config.singleRun && config.autoWatch) {
    log.debug('autoWatch set to false, because of singleRun')
    config.autoWatch = false
  }

  if (!config.singleRun && config.browserDisconnectTolerance) {
    log.debug('browserDisconnectTolerance set to 0, because of singleRun')
    config.browserDisconnectTolerance = 0
  }

  if (helper.isString(config.reporters)) {
    config.reporters = config.reporters.split(',')
  }

  if (config.client && config.client.args && !Array.isArray(config.client.args)) {
    throw new Error('Invalid configuration: client.args must be an array of strings')
  }

  if (config.browsers && Array.isArray(config.browsers) === false) {
    throw new TypeError('Invalid configuration: browsers option must be an array')
  }

  var defaultClient = config.defaultClient || {}
  Object.keys(defaultClient).forEach(function (key) {
    var option = config.client[key]
    config.client[key] = helper.isDefined(option) ? option : defaultClient[key]
  })

  // normalize preprocessors
  var preprocessors = config.preprocessors || {}
  var normalizedPreprocessors = config.preprocessors = Object.create(null)

  Object.keys(preprocessors).forEach(function (pattern) {
    var normalizedPattern = helper.normalizeWinPath(basePathResolve(pattern))

    normalizedPreprocessors[normalizedPattern] = helper.isString(preprocessors[pattern])
      ? [preprocessors[pattern]] : preprocessors[pattern]
  })

  // define custom launchers/preprocessors/reporters - create an inlined plugin
  var module = Object.create(null)
  var hasSomeInlinedPlugin = false
  var types = ['launcher', 'preprocessor', 'reporter']

  types.forEach(function (type) {
    var definitions = config['custom' + helper.ucFirst(type) + 's'] || {}

    Object.keys(definitions).forEach(function (name) {
      var definition = definitions[name]

      if (!helper.isObject(definition)) {
        return log.warn('Can not define %s %s. Definition has to be an object.', type, name)
      }

      if (!helper.isString(definition.base)) {
        return log.warn('Can not define %s %s. Missing base %s.', type, name, type)
      }

      var token = type + ':' + definition.base
      var locals = {
        args: ['value', definition]
      }

      module[type + ':' + name] = ['factory', function (injector) {
        var plugin = injector.createChild([locals], [token]).get(token)
        if (type === 'launcher' && helper.isDefined(definition.displayName)) {
          plugin.displayName = definition.displayName
        }
        return plugin
      }]
      hasSomeInlinedPlugin = true
    })
  })

  if (hasSomeInlinedPlugin) {
    config.plugins.push(module)
  }

  return config
}

var Config = function () {
  var config = this

  this.LOG_DISABLE = constant.LOG_DISABLE
  this.LOG_ERROR = constant.LOG_ERROR
  this.LOG_WARN = constant.LOG_WARN
  this.LOG_INFO = constant.LOG_INFO
  this.LOG_DEBUG = constant.LOG_DEBUG

  this.set = function (newConfig) {
    Object.keys(newConfig).forEach(function (key) {
      config[key] = newConfig[key]
    })
  }

  // DEFAULT CONFIG
  this.frameworks = []
  this.protocol = 'http:'
  this.port = constant.DEFAULT_PORT
  this.hostname = constant.DEFAULT_HOSTNAME
  this.httpsServerConfig = {}
  this.basePath = ''
  this.files = []
  this.exclude = []
  this.logLevel = constant.LOG_INFO
  this.colors = true
  this.autoWatch = true
  this.autoWatchBatchDelay = 250
  this.restartOnFileChange = false
  this.usePolling = process.platform === 'darwin' || process.platform === 'linux'
  this.reporters = ['progress']
  this.singleRun = false
  this.browsers = []
  this.captureTimeout = 60000
  this.proxies = {}
  this.proxyValidateSSL = true
  this.preprocessors = {}
  this.urlRoot = '/'
  this.reportSlowerThan = 0
  this.loggers = [constant.CONSOLE_APPENDER]
  this.transports = ['polling', 'websocket']
  this.forceJSONP = false
  this.plugins = ['karma-*']
  this.defaultClient = this.client = {
    args: [],
    useIframe: true,
    captureConsole: true,
    clearContext: true
  }
  this.browserDisconnectTimeout = 2000
  this.browserDisconnectTolerance = 0
  this.browserNoActivityTimeout = 10000
  this.concurrency = Infinity
  this.failOnEmptyTestSuite = true
  this.retryLimit = 2
}

var CONFIG_SYNTAX_HELP = '  module.exports = function(config) {\n' +
  '    config.set({\n' +
  '      // your config\n' +
  '    });\n' +
  '  };\n'

var parseConfig = function (configFilePath, cliOptions) {
  var configModule
  if (configFilePath) {
    log.debug('Loading config %s', configFilePath)

    try {
      configModule = require(configFilePath)
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(configFilePath) !== -1) {
        log.error('File %s does not exist!', configFilePath)
      } else {
        log.error('Invalid config file!\n  ' + e.stack)

        var extension = path.extname(configFilePath)
        if (extension === '.coffee' && !COFFEE_SCRIPT_AVAILABLE) {
          log.error('You need to install CoffeeScript.\n' +
            '  npm install coffee-script --save-dev')
        } else if (extension === '.ls' && !LIVE_SCRIPT_AVAILABLE) {
          log.error('You need to install LiveScript.\n' +
            '  npm install LiveScript --save-dev')
        }
      }
      return process.exit(1)
    }
    if (!helper.isFunction(configModule)) {
      log.error('Config file must export a function!\n' + CONFIG_SYNTAX_HELP)
      return process.exit(1)
    }
  } else {
    log.debug('No config file specified.')
    // if no config file path is passed, we define a dummy config module.
    configModule = function () {}
  }

  var config = new Config()
  config.set(cliOptions)

  try {
    configModule(config)
  } catch (e) {
    log.error('Error in config file!\n', e)
    return process.exit(1)
  }

  // merge the config from config file and cliOptions (precedence)
  config.set(cliOptions)

  // configure the logger as soon as we can
  logger.setup(config.logLevel, config.colors, config.loggers)

  return normalizeConfig(config, configFilePath)
}

// PUBLIC API
exports.parseConfig = parseConfig
exports.Pattern = Pattern
exports.createPatternObject = createPatternObject
exports.Config = Config
