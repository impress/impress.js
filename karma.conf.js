// Karma configuration
// Generated on Thu Feb 28 2019 16:31:36 GMT+0100 (Central European Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],

    plugins: ['karma-firefox-launcher', 'karma-chrome-launcher', 'karma-qunit'],

    // list of files / patterns to load in the browser
    files: [
      'test/helpers.js',
      'test/core_tests.js',
      'test/non_default.js',
      'src/plugins/navigation/navigation_tests.js',
      'test/core_tests_presentation.html',
      'test/non_default.html',
      'js/impress.js',
      'node_modules/syn/dist/global/syn.js'
    ],

    proxies: {
    "/test/": "/base/test/",
    "/dist/": "/base/dist/",
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
    browsers: ['Firefox', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
