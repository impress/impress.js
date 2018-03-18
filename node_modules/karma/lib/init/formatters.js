var fs = require('graceful-fs')
var util = require('util')

var JS_TEMPLATE_PATH = __dirname + '/../../config.tpl.js'
var COFFEE_TEMPLATE_PATH = __dirname + '/../../config.tpl.coffee'
var JS_REQUIREJS_TEMPLATE_PATH = __dirname + '/../../requirejs.config.tpl.js'
var COFFEE_REQUIREJS_TEMPLATE_PATH = __dirname + '/../../requirejs.config.tpl.coffee'
var COFFEE_REGEXP = /\.coffee$/
var LIVE_TEMPLATE_PATH = __dirname + '/../../config.tpl.ls'
var LIVE_REGEXP = /\.ls$/

var isCoffeeFile = function (filename) {
  return COFFEE_REGEXP.test(filename)
}

var isLiveFile = function (filename) {
  return LIVE_REGEXP.test(filename)
}

var JavaScriptFormatter = function () {
  var quote = function (value) {
    return "'" + value + "'"
  }

  var quoteNonIncludedPattern = function (value) {
    return util.format('{pattern: %s, included: false}', quote(value))
  }

  var pad = function (str, pad) {
    return str.replace(/\n/g, '\n' + pad).replace(/\s+$/gm, '')
  }

  var formatQuottedList = function (list) {
    return list.map(quote).join(', ')
  }

  this.TEMPLATE_FILE_PATH = JS_TEMPLATE_PATH
  this.REQUIREJS_TEMPLATE_FILE = JS_REQUIREJS_TEMPLATE_PATH

  this.formatFiles = function (includedFiles, onlyServedFiles) {
    var files = includedFiles.map(quote)

    onlyServedFiles.forEach(function (onlyServedFile) {
      files.push(quoteNonIncludedPattern(onlyServedFile))
    })

    files = files.map(function (file) {
      return '\n      ' + file
    })

    return files.join(',')
  }

  this.formatPreprocessors = function (preprocessors) {
    var lines = []
    Object.keys(preprocessors).forEach(function (pattern) {
      lines.push('  ' + quote(pattern) + ': [' + formatQuottedList(preprocessors[pattern]) + ']')
    })

    return pad('{\n' + lines.join(',\n') + '\n}', '    ')
  }

  this.formatFrameworks = formatQuottedList

  this.formatBrowsers = formatQuottedList

  this.formatAnswers = function (answers) {
    return {
      DATE: new Date(),
      BASE_PATH: answers.basePath,
      FRAMEWORKS: this.formatFrameworks(answers.frameworks),
      FILES: this.formatFiles(answers.files, answers.onlyServedFiles),
      EXCLUDE: this.formatFiles(answers.exclude, []),
      AUTO_WATCH: answers.autoWatch ? 'true' : 'false',
      BROWSERS: this.formatBrowsers(answers.browsers),
      PREPROCESSORS: this.formatPreprocessors(answers.preprocessors)
    }
  }

  this.generateConfigFile = function (answers) {
    var template = fs.readFileSync(this.TEMPLATE_FILE_PATH).toString()
    var replacements = this.formatAnswers(answers)

    return template.replace(/%(.*)%/g, function (a, key) {
      return replacements[key]
    })
  }

  this.writeConfigFile = function (path, answers) {
    fs.writeFileSync(path, this.generateConfigFile(answers))
  }

  this.generateRequirejsConfigFile = function () {
    var template = fs.readFileSync(this.REQUIREJS_TEMPLATE_FILE).toString()
    return template
  }

  this.writeRequirejsConfigFile = function (path) {
    fs.writeFileSync(path, this.generateRequirejsConfigFile())
  }
}

var CoffeeFormatter = function () {
  JavaScriptFormatter.call(this)

  this.TEMPLATE_FILE_PATH = COFFEE_TEMPLATE_PATH
  this.REQUIREJS_TEMPLATE_FILE = COFFEE_REQUIREJS_TEMPLATE_PATH
}

var LiveFormatter = function () {
  JavaScriptFormatter.call(this)

  this.TEMPLATE_FILE_PATH = LIVE_TEMPLATE_PATH
}

exports.JavaScript = JavaScriptFormatter
exports.Coffee = CoffeeFormatter
exports.Live = LiveFormatter

exports.createForPath = function (path) {
  if (isCoffeeFile(path)) {
    return new CoffeeFormatter()
  }

  if (isLiveFile(path)) {
    return new LiveFormatter()
  }

  return new JavaScriptFormatter()
}
