// Karma configuration
// Generated on Thu Feb 28 2019 16:31:36 GMT+0100 (Central European Standard Time)
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],

    plugins: ['karma-firefox-launcher', 'karma-chrome-launcher', 'karma-qunit'],

    // List of files / patterns to load in the browser
    files: [
      // The QUnit tests
      "test/helpers.js",
      "test/core_tests.js",
      "test/non_default.js",
      "src/plugins/navigation/navigation_tests.js",
      // Presentation files, for the iframe
      {pattern: "test/*.html", watched: true, served: true, included: false},
      {pattern: "test/plugins/*/*.html", watched: true, served: true, included: false},
      // JS files for iframe
      {pattern: "js/impress.js", watched: true, served: true, included: false},
      {pattern: "node_modules/syn/dist/global/syn.js", watched: false, served: true, included: false}
    ],

    proxies: {
    "/test/": "/base/test/",
    "/js/": "/base/js/",
    "/node_modules/": "/base/node_modules/"
  },
    
    client: {
      clearContext: false,
      qunit: {
        showUI: true
      }
    },

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['FirefoxHeadless', 'Chrome_without_security'],

    customLaunchers: {
      Chrome_without_security: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
