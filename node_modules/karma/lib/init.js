var readline = require('readline')
var path = require('path')
var glob = require('glob')
var mm = require('minimatch')
var exec = require('child_process').exec

var helper = require('./helper')
var logger = require('./logger')
var constant = require('./constants')

var log = logger.create('init')

var StateMachine = require('./init/state_machine')
var COLOR_SCHEME = require('./init/color_schemes')
var formatters = require('./init/formatters')

// TODO(vojta): coverage
// TODO(vojta): html preprocessors
// TODO(vojta): SauceLabs
// TODO(vojta): BrowserStack

var logQueue = []
var printLogQueue = function () {
  while (logQueue.length) {
    logQueue.shift()()
  }
}

var NODE_MODULES_DIR = path.resolve(__dirname, '../..')

// Karma is not in node_modules, probably a symlink,
// use current working dir.
if (!/node_modules$/.test(NODE_MODULES_DIR)) {
  NODE_MODULES_DIR = path.resolve('node_modules')
}

var installPackage = function (pkgName) {
  // Do not install if already installed.
  try {
    require(NODE_MODULES_DIR + '/' + pkgName)
    return
  } catch (e) {}

  log.debug('Missing plugin "%s". Installing...', pkgName)

  var options = {
    cwd: path.resolve(NODE_MODULES_DIR, '..')
  }

  exec('npm install ' + pkgName + ' --save-dev', options, function (err, stdout, stderr) {
    // Put the logs into the queue and print them after answering current question.
    // Otherwise the log would clobber the interactive terminal.
    logQueue.push(function () {
      if (!err) {
        log.debug('%s successfully installed.', pkgName)
      } else if (/is not in the npm registry/.test(stderr)) {
        log.warn('Failed to install "%s". It is not in the NPM registry!\n' +
          '  Please install it manually.', pkgName)
      } else if (/Error: EACCES/.test(stderr)) {
        log.warn('Failed to install "%s". No permissions to write in %s!\n' +
          '  Please install it manually.', pkgName, options.cwd)
      } else {
        log.warn('Failed to install "%s"\n  Please install it manually.', pkgName)
      }
    })
  })
}

var validatePattern = function (pattern) {
  if (!glob.sync(pattern).length) {
    log.warn('There is no file matching this pattern.\n')
  }
}

var validateBrowser = function (name) {
  // TODO(vojta): check if the path resolves to a binary
  installPackage('karma-' + name.toLowerCase().replace('canary', '') + '-launcher')
}

var validateFramework = function (name) {
  installPackage('karma-' + name)
}

var validateRequireJs = function (useRequire) {
  if (useRequire) {
    validateFramework('requirejs')
  }
}

var questions = [{
  id: 'framework',
  question: 'Which testing framework do you want to use ?',
  hint: 'Press tab to list possible options. Enter to move to the next question.',
  options: ['jasmine', 'mocha', 'qunit', 'nodeunit', 'nunit', ''],
  validate: validateFramework
}, {
  id: 'requirejs',
  question: 'Do you want to use Require.js ?',
  hint: 'This will add Require.js plugin.\n' +
    'Press tab to list possible options. Enter to move to the next question.',
  options: ['no', 'yes'],
  validate: validateRequireJs,
  boolean: true
}, {
  id: 'browsers',
  question: 'Do you want to capture any browsers automatically ?',
  hint: 'Press tab to list possible options. Enter empty string to move to the next question.',
  options: ['Chrome', 'ChromeCanary', 'Firefox', 'Safari', 'PhantomJS', 'Opera', 'IE', ''],
  validate: validateBrowser,
  multiple: true
}, {
  id: 'files',
  question: 'What is the location of your source and test files ?',
  hint: 'You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".\n' +
    'Enter empty string to move to the next question.',
  multiple: true,
  validate: validatePattern
}, {
  id: 'exclude',
  question: 'Should any of the files included by the previous patterns be excluded ?',
  hint: 'You can use glob patterns, eg. "**/*.swp".\n' +
    'Enter empty string to move to the next question.',
  multiple: true,
  validate: validatePattern
}, {
  id: 'generateTestMain',
  question: 'Do you wanna generate a bootstrap file for RequireJS?',
  hint: 'This will generate test-main.js/coffee that configures RequireJS and starts the tests.',
  options: ['no', 'yes'],
  boolean: true,
  condition: function (answers) {
    return answers.requirejs
  }
}, {
  id: 'includedFiles',
  question: 'Which files do you want to include with <script> tag ?',
  hint: 'This should be a script that bootstraps your test by configuring Require.js and ' +
    'kicking __karma__.start(), probably your test-main.js file.\n' +
    'Enter empty string to move to the next question.',
  multiple: true,
  validate: validatePattern,
  condition: function (answers) {
    return answers.requirejs && !answers.generateTestMain
  }
}, {
  id: 'autoWatch',
  question: 'Do you want Karma to watch all the files and run the tests on change ?',
  hint: 'Press tab to list possible options.',
  options: ['yes', 'no'],
  boolean: true
}]

var getBasePath = function (configFilePath, cwd) {
  var configParts = path.dirname(configFilePath).split(path.sep)
  var cwdParts = cwd.split(path.sep)
  var base = []

  while (configParts.length && configParts[0] === cwdParts[0]) {
    configParts.shift()
    cwdParts.shift()
  }

  while (configParts.length) {
    var part = configParts.shift()
    if (part === '..') {
      base.unshift(cwdParts.pop())
    } else if (part !== '.') {
      base.unshift('..')
    }
  }

  return base.join(path.sep)
}

var processAnswers = function (answers, basePath, testMainFile) {
  var processedAnswers = {
    basePath: basePath,
    files: answers.files,
    onlyServedFiles: [],
    exclude: answers.exclude,
    autoWatch: answers.autoWatch,
    generateTestMain: answers.generateTestMain,
    browsers: answers.browsers,
    frameworks: [],
    preprocessors: {}
  }

  if (answers.framework) {
    processedAnswers.frameworks.push(answers.framework)
  }

  if (answers.requirejs) {
    processedAnswers.frameworks.push('requirejs')
    processedAnswers.files = answers.includedFiles || []
    processedAnswers.onlyServedFiles = answers.files

    if (answers.generateTestMain) {
      processedAnswers.files.push(testMainFile)
    }
  }

  var allPatterns = answers.files.concat(answers.includedFiles || [])
  if (allPatterns.some(function (pattern) {
    return mm(pattern, '**/*.coffee')
  })) {
    installPackage('karma-coffee-preprocessor')
    processedAnswers.preprocessors['**/*.coffee'] = ['coffee']
  }

  return processedAnswers
}

exports.init = function (config) {
  var useColors = true
  var logLevel = constant.LOG_INFO
  var colorScheme = COLOR_SCHEME.ON

  if (helper.isDefined(config.colors)) {
    colorScheme = config.colors ? COLOR_SCHEME.ON : COLOR_SCHEME.OFF
    useColors = config.colors
  }

  if (helper.isDefined(config.logLevel)) {
    logLevel = config.logLevel
  }

  logger.setup(logLevel, useColors)

  // need to be registered before creating readlineInterface
  process.stdin.on('keypress', function (s, key) {
    sm.onKeypress(key)
  })

  var rli = readline.createInterface(process.stdin, process.stdout)
  var sm = new StateMachine(rli, colorScheme)

  rli.on('line', sm.onLine.bind(sm))

  // clean colors
  rli.on('SIGINT', function () {
    sm.kill()
    process.exit(0)
  })

  sm.on('next_question', printLogQueue)

  sm.process(questions, function (answers) {
    var cwd = process.cwd()
    var configFile = config.configFile || 'karma.conf.js'
    var isCoffee = path.extname(configFile) === '.coffee'
    var testMainFile = isCoffee ? 'test-main.coffee' : 'test-main.js'
    var formatter = formatters.createForPath(configFile)
    var processedAnswers = processAnswers(answers, getBasePath(configFile, cwd), testMainFile)
    var configFilePath = path.resolve(cwd, configFile)
    var testMainFilePath = path.resolve(cwd, testMainFile)

    if (isCoffee) {
      installPackage('coffee-script')
    }

    if (processedAnswers.generateTestMain) {
      formatter.writeRequirejsConfigFile(testMainFilePath)
      console.log(colorScheme.success(
        'RequireJS bootstrap file generated at "' + testMainFilePath + '".\n'
      ))
    }

    formatter.writeConfigFile(configFilePath, processedAnswers)
    console.log(colorScheme.success('Config file generated at "' + configFilePath + '".\n'))
  })
}
