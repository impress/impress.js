/* jshint node: true */

"use strict";

// Browsers to run on Sauce Labs platforms.
var sauceBrowsers = [
  [ "chrome", "53", "Windows 10" ],
  [ "chrome", "52", "Windows 10" ],
  [ "firefox", "48", "Windows 10" ],
  [ "firefox", "47", "Windows 10" ],
  [ "microsoftedge", "13", "Windows 10" ],
  [ "internet explorer", "11", "Windows 10" ],
  [ "safari", "9", "OS X 10.11" ],
  [ "safari", "8", "OS X 10.10" ]
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

    // The list of files / patterns to load in the browser.
    files: [
      "test/bootstrap.js",
      "js/impress.js",
      "test/core_tests.js"
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
    captureTimeout: 120000,
    customLaunchers: sauceBrowsers,

    // Browsers to launch.
    browsers: Object.keys( sauceBrowsers )
  } );
};
