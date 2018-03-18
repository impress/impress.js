var fsAccess = require('fs-access')
var path = require('path')
var which = require('which')

function isJSFlags (flag) {
  return flag.indexOf('--js-flags=') === 0
}

function sanitizeJSFlags (flag) {
  var test = /--js-flags=(['"])/.exec(flag)
  if (!test) {
    return flag
  }
  var escapeChar = test[1]
  var endExp = new RegExp(escapeChar + '$')
  var startExp = new RegExp('--js-flags=' + escapeChar)
  return flag.replace(startExp, '--js-flags=').replace(endExp, '')
}

var ChromeBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this)

  var flags = args.flags || []
  var userDataDir = args.chromeDataDir || this._tempDir

  this._getOptions = function (url) {
    // Chrome CLI options
    // http://peter.sh/experiments/chromium-command-line-switches/
    flags.forEach(function (flag, i) {
      if (isJSFlags(flag)) {
        flags[i] = sanitizeJSFlags(flag)
      }
    })

    return [
      '--user-data-dir=' + userDataDir,
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--disable-background-timer-throttling',
      // on macOS, disable-background-timer-throttling is not enough
      // and we need disable-renderer-backgrounding too
      // see https://github.com/karma-runner/karma-chrome-launcher/issues/123
      '--disable-renderer-backgrounding',
      '--disable-device-discovery-notifications'
    ].concat(flags, [url])
  }
}

// Return location of chrome.exe file for a given Chrome directory (available: "Chrome", "Chrome SxS").
function getChromeExe (chromeDirName) {
  // Only run these checks on win32
  if (process.platform !== 'win32') {
    return null
  }
  var windowsChromeDirectory, i, prefix
  var suffix = '\\Google\\' + chromeDirName + '\\Application\\chrome.exe'
  var prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]

  for (i = 0; i < prefixes.length; i++) {
    prefix = prefixes[i]
    try {
      windowsChromeDirectory = path.join(prefix, suffix)
      fsAccess.sync(windowsChromeDirectory)
      return windowsChromeDirectory
    } catch (e) {}
  }

  return windowsChromeDirectory
}

var ChromiumBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this)

  var flags = args.flags || []
  var userDataDir = args.chromeDataDir || this._tempDir

  this._getOptions = function (url) {
    // Chromium CLI options
    // http://peter.sh/experiments/chromium-command-line-switches/
    flags.forEach(function (flag, i) {
      if (isJSFlags(flag)) {
        flags[i] = sanitizeJSFlags(flag)
      }
    })

    return [
      '--user-data-dir=' + userDataDir,
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--disable-background-timer-throttling'
    ].concat(flags, [url])
  }
}

// Return location of Chromium's chrome.exe file.
function getChromiumExe (chromeDirName) {
  // Only run these checks on win32
  if (process.platform !== 'win32') {
    return null
  }
  var windowsChromiumDirectory, i, prefix
  var suffix = '\\Chromium\\Application\\chrome.exe'
  var prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']]

  for (i = 0; i < prefixes.length; i++) {
    prefix = prefixes[i]
    try {
      windowsChromiumDirectory = path.join(prefix, suffix)
      fsAccess.sync(windowsChromiumDirectory)
      return windowsChromiumDirectory
    } catch (e) {}
  }

  return windowsChromiumDirectory
}

function getBin (commands) {
  // Don't run these checks on win32
  if (process.platform !== 'linux') {
    return null
  }
  var bin, i
  for (i = 0; i < commands.length; i++) {
    try {
      if (which.sync(commands[i])) {
        bin = commands[i]
        break
      }
    } catch (e) {}
  }
  return bin
}

function getChromeDarwin (defaultPath) {
  if (process.platform !== 'darwin') {
    return null
  }

  try {
    var homePath = path.join(process.env.HOME, defaultPath)
    fsAccess.sync(homePath)
    return homePath
  } catch (e) {
    return defaultPath
  }
}

ChromeBrowser.prototype = {
  name: 'Chrome',

  DEFAULT_CMD: {
    linux: getBin(['google-chrome', 'google-chrome-stable']),
    darwin: getChromeDarwin('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    win32: getChromeExe('Chrome')
  },
  ENV_CMD: 'CHROME_BIN'
}

ChromeBrowser.$inject = ['baseBrowserDecorator', 'args']

function headlessGetOptions (url, args, parent) {
  return parent.call(this, url, args).concat(['--headless', '--disable-gpu', '--remote-debugging-port=9222'])
}

var ChromeHeadlessBrowser = function (baseBrowserDecorator, args) {
  ChromeBrowser.apply(this, arguments)

  var parentOptions = this._getOptions
  this._getOptions = function (url) {
    return headlessGetOptions.call(this, url, args, parentOptions)
  }
}

ChromeHeadlessBrowser.prototype = {
  name: 'ChromeHeadless',

  DEFAULT_CMD: {
    linux: getBin(['google-chrome', 'google-chrome-stable']),
    darwin: getChromeDarwin('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    win32: getChromeExe('Chrome')
  },
  ENV_CMD: 'CHROME_BIN'
}

ChromeHeadlessBrowser.$inject = ['baseBrowserDecorator', 'args']

function canaryGetOptions (url, args, parent) {
  // disable crankshaft optimizations, as it causes lot of memory leaks (as of Chrome 23.0)
  var flags = args.flags || []
  var augmentedFlags
  var customFlags = '--nocrankshaft --noopt'

  flags.forEach(function (flag) {
    if (isJSFlags(flag)) {
      augmentedFlags = sanitizeJSFlags(flag) + ' ' + customFlags
    }
  })

  return parent.call(this, url).concat([augmentedFlags || '--js-flags=' + customFlags])
}

var ChromeCanaryBrowser = function (baseBrowserDecorator, args) {
  ChromeBrowser.apply(this, arguments)

  var parentOptions = this._getOptions
  this._getOptions = function (url) {
    return canaryGetOptions.call(this, url, args, parentOptions)
  }
}

ChromeCanaryBrowser.prototype = {
  name: 'ChromeCanary',

  DEFAULT_CMD: {
    linux: getBin(['google-chrome-canary', 'google-chrome-unstable']),
    darwin: getChromeDarwin('/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'),
    win32: getChromeExe('Chrome SxS')
  },
  ENV_CMD: 'CHROME_CANARY_BIN'
}

ChromeCanaryBrowser.$inject = ['baseBrowserDecorator', 'args']

var ChromeCanaryHeadlessBrowser = function (baseBrowserDecorator, args) {
  ChromeCanaryBrowser.apply(this, arguments)

  var parentOptions = this._getOptions
  this._getOptions = function (url) {
    return headlessGetOptions.call(this, url, args, parentOptions)
  }
}

ChromeCanaryHeadlessBrowser.prototype = {
  name: 'ChromeCanaryHeadless',

  DEFAULT_CMD: {
    linux: getBin(['google-chrome-canary', 'google-chrome-unstable']),
    darwin: getChromeDarwin('/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'),
    win32: getChromeExe('Chrome SxS')
  },
  ENV_CMD: 'CHROME_CANARY_BIN'
}

ChromeCanaryHeadlessBrowser.$inject = ['baseBrowserDecorator', 'args']

ChromiumBrowser.prototype = {
  name: 'Chromium',

  DEFAULT_CMD: {
    // Try chromium-browser before chromium to avoid conflict with the legacy
    // chromium-bsu package previously known as 'chromium' in Debian and Ubuntu.
    linux: getBin(['chromium-browser', 'chromium']),
    darwin: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    win32: getChromiumExe()
  },
  ENV_CMD: 'CHROMIUM_BIN'
}

ChromiumBrowser.$inject = ['baseBrowserDecorator', 'args']

var ChromiumHeadlessBrowser = function (baseBrowserDecorator, args) {
  ChromiumBrowser.apply(this, arguments)

  var parentOptions = this._getOptions
  this._getOptions = function (url) {
    return headlessGetOptions.call(this, url, args, parentOptions)
  }
}

ChromiumHeadlessBrowser.prototype = {
  name: 'ChromiumHeadless',

  DEFAULT_CMD: {
    // Try chromium-browser before chromium to avoid conflict with the legacy
    // chromium-bsu package previously known as 'chromium' in Debian and Ubuntu.
    linux: getBin(['chromium-browser', 'chromium']),
    darwin: '/Applications/Chromium.app/Contents/MacOS/Chromium',
    win32: getChromiumExe()
  },
  ENV_CMD: 'CHROMIUM_BIN'
}

var DartiumBrowser = function () {
  ChromeBrowser.apply(this, arguments)

  var checkedFlag = '--checked'
  var dartFlags = process.env.DART_FLAGS || ''
  var flags = dartFlags.split(' ')
  if (flags.indexOf(checkedFlag) === -1) {
    flags.push(checkedFlag)
    process.env.DART_FLAGS = flags.join(' ')
  }
}

DartiumBrowser.prototype = {
  name: 'Dartium',
  DEFAULT_CMD: {},
  ENV_CMD: 'DARTIUM_BIN'
}

DartiumBrowser.$inject = ['baseBrowserDecorator', 'args']

// PUBLISH DI MODULE
module.exports = {
  'launcher:Chrome': ['type', ChromeBrowser],
  'launcher:ChromeHeadless': ['type', ChromeHeadlessBrowser],
  'launcher:ChromeCanary': ['type', ChromeCanaryBrowser],
  'launcher:ChromeCanaryHeadless': ['type', ChromeCanaryHeadlessBrowser],
  'launcher:Chromium': ['type', ChromiumBrowser],
  'launcher:ChromiumHeadless': ['type', ChromiumHeadlessBrowser],
  'launcher:Dartium': ['type', DartiumBrowser]
}

module.exports.test = {
  isJSFlags: isJSFlags,
  sanitizeJSFlags: sanitizeJSFlags,
  headlessGetOptions: headlessGetOptions,
  canaryGetOptions: canaryGetOptions
}
