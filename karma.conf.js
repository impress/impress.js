module.exports = function( config ) {
  config.set( {

    // Base path, that will be used to resolve files and exclude
    basePath: "",

    // Frameworks to use
    frameworks: [ "qunit" ],

    proxies : {
      '/test/' : '/base/test/',
      '/js/'   : '/base/js/',
      '/node_modules/syn/dist/' : '/base/node_modules/syn/dist/'
    },
    
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

    // List of files to exclude
    exclude: [],

    // Test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: [ "progress" ],

    // Web server port
    port: 9876,

    // Enable / disable colors in the output (reporters and logs)
    colors: true,

    // Level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    //browsers: [ "Chrome" ],
    //browsers: [ "Firefox" ],
    browsers: [ "Chrome", "Firefox" ],

    client: {
      clearContext: false,
      qunit: {
        showUI: true,
        testTimeout: 120*1000
      }
    },

    // If browser does not capture, or produce output, in given timeout [ms], kill it
    captureTimeout: 60*1000,
    browserNoActivityTimeout: 60*1000,
    
    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  } );
};
