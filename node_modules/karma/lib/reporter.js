var util = require('util')
var log = require('./logger').create('reporter')
var MultiReporter = require('./reporters/multi')
var baseReporterDecoratorFactory = require('./reporters/base').decoratorFactory
var SourceMapConsumer = require('source-map').SourceMapConsumer
var WeakMap = require('core-js/es6/weak-map')

var createErrorFormatter = function (basePath, emitter, SourceMapConsumer) {
  var lastServedFiles = []

  emitter.on('file_list_modified', function (files) {
    lastServedFiles = files.served
  })

  var findFile = function (path) {
    for (var i = 0; i < lastServedFiles.length; i++) {
      if (lastServedFiles[i].path === path) {
        return lastServedFiles[i]
      }
    }
    return null
  }

  var URL_REGEXP = new RegExp('(?:https?:\\/\\/[^\\/]*)?\\/?' +
    '(base|absolute)' + // prefix
    '((?:[A-z]\\:)?[^\\?\\s\\:]*)' + // path
    '(\\?\\w*)?' + // sha
    '(\\:(\\d+))?' + // line
    '(\\:(\\d+))?' + // column
    '', 'g')

  var getSourceMapConsumer = (function () {
    var cache = new WeakMap()
    return function (sourceMap) {
      if (!cache.has(sourceMap)) {
        cache.set(sourceMap, new SourceMapConsumer(sourceMap))
      }
      return cache.get(sourceMap)
    }
  }())

  return function (msg, indentation) {
    // remove domain and timestamp from source files
    // and resolve base path / absolute path urls into absolute path
    msg = (msg || '').replace(URL_REGEXP, function (_, prefix, path, __, ___, line, ____, column) {
      if (prefix === 'base') {
        path = basePath + path
      }

      var file = findFile(path)

      if (file && file.sourceMap) {
        line = parseInt(line || '0', 10)

        column = parseInt(column, 10)

        // When no column is given and we default to 0, it doesn't make sense to only search for smaller
        // or equal columns in the sourcemap, let's search for equal or greater columns.
        var bias = column ? SourceMapConsumer.GREATEST_LOWER_BOUND : SourceMapConsumer.LEAST_UPPER_BOUND

        try {
          var original = getSourceMapConsumer(file.sourceMap)
            .originalPositionFor({line: line, column: (column || 0), bias: bias})

          var formattedColumn = column ? util.format(':%s', column) : ''
          return util.format('%s:%d%s <- %s:%d:%d', path, line, formattedColumn, original.source,
            original.line, original.column)
        } catch (e) {
          log.warn('SourceMap position not found for trace: %s', msg)
        // Fall back to non-source-mapped formatting.
        }
      }

      var result = path + (line ? ':' + line : '') + (column ? ':' + column : '')
      return result || prefix
    })

    // indent every line
    if (indentation) {
      msg = indentation + msg.replace(/\n/g, '\n' + indentation)
    }

    return msg + '\n'
  }
}

var createReporters = function (names, config, emitter, injector) {
  var errorFormatter = createErrorFormatter(config.basePath, emitter, SourceMapConsumer)
  var reporters = []

  // TODO(vojta): instantiate all reporters through DI
  names.forEach(function (name) {
    if (['dots', 'progress'].indexOf(name) !== -1) {
      var Cls = require('./reporters/' + name + (config.colors ? '_color' : ''))
      return reporters.push(new Cls(errorFormatter, config.reportSlowerThan))
    }

    var locals = {
      baseReporterDecorator: ['factory', baseReporterDecoratorFactory],
      formatError: ['value', errorFormatter]
    }

    try {
      reporters.push(injector.createChild([locals], ['reporter:' + name]).get('reporter:' + name))
    } catch (e) {
      if (e.message.indexOf('No provider for "reporter:' + name + '"') !== -1) {
        log.warn('Can not load "%s", it is not registered!\n  ' +
          'Perhaps you are missing some plugin?', name)
      } else {
        log.warn('Can not load "%s"!\n  ' + e.stack, name)
      }
    }
  })

  // bind all reporters
  reporters.forEach(function (reporter) {
    emitter.bind(reporter)
  })

  return new MultiReporter(reporters)
}

createReporters.$inject = ['config.reporters', 'config', 'emitter', 'injector']

// PUBLISH
exports.createReporters = createReporters
