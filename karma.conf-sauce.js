/* jshint node: true */

"use strict";

// Browsers to run on Sauce Labs platforms.
var sauceBrowsers = [
  [ "chrome", "53", "Windows 10" ],
  [ "chrome", "52", "Windows 10" ],
  [ "firefox", "48", "Windows 10" ],
  [ "firefox", "47", "Windows 10" ],
  [ "microsoftedge", "13", "Windows 10" ]
// These browsers have issues with the iframe based test approach. impress.js itself should work
// fine, it's just that the tests don't. We can figure out later whether there's some option that
// allows to access the DOM inside the iframe with javascript.
//  [ "internet explorer", "11", "Windows 10" ],
//  [ "safari", "9", "OS X 10.11" ],
//  [ "safari", "8", "OS X 10.10" ]
].reduce( function( object, platform ) {

  // Convert "internet explorer" -> "ie".
  var label = platform[ 0 ].split( " " );
  label = (
    label.length > 1 ? label.map( function( word ) { return word[ 0 ]; } ) : label
  ).join( "" ) +
  "_v" + platform[ 1 ];

  object[ label ] = {
    base: "SauceLabs",
    browserName: platform[ 0 ],
    version: platform[ 1 ],
    platform: platform[ 2 ]
  };
  return object;
}, {} );

module.exports = function( config ) {
  if ( !process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY ) {
    console.log( "Sauce environments not set --- Skipping" );
    return process.exit( 0 );
  }
  config.set( {
    basePath: "",
    browserDisconnectTolerance: 5,
    frameworks: [ "qunit" ],
    singleRun: true,

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


    // The number of sauce tests to start in parallel.
    concurrency: 1,

    // Test results reporter to use.
    reporters: [ "dots", "saucelabs" ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    sauceLabs: {
      build: "CIRCLE-CI #" + process.env.CIRCLE_BUILD_NUM,
      startConnect: true,
      tunnelIdentifier: process.env.CIRCLE_BUILD_NUM
    },

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
    customLaunchers: sauceBrowsers,

    // Browsers to launch.
    browsers: Object.keys( sauceBrowsers )
  } );
};
