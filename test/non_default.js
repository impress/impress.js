/*
 * Copyright 2016 Henrik Ingo (@henrikingo)
 *
 * Released under the MIT license. See LICENSE file.
 */

/* global document, console, setTimeout, loadIframe, initPresentation, _impressSupported, QUnit */

QUnit.module( "Non Default Values" );

QUnit.test( "Initialize Impress.js", function( assert ) {
  console.log( "Begin init() test" );

  // Init triggers impress:init and impress:stepenter events, which we want to catch.
  var doneInit      = assert.async();
  var doneStepEnter = assert.async();
  var doneSync      = assert.async();

  loadIframe( "test/non_default.html", assert, function() {
    var iframe = document.getElementById( "presentation-iframe" );
    var iframeDoc = iframe.contentDocument;
    var iframeWin = iframe.contentWindow;
    var root  = iframeDoc.querySelector( "div#non-default-id" );

    // Catch events triggered by init()
    var assertInit = function() {
      assert.ok( true, "impress:init event triggered." );

      doneInit();
      console.log( "End init() test (async)" );
    };

    var assertInitWrapper = function() {
      setTimeout( function() { assertInit(); }, 10 );
    };
    root.addEventListener( "impress:init", assertInitWrapper );

    root.addEventListener( "impress:stepenter", function( event ) {
      assert.ok( true, "impress:stepenter event triggered." );
      var step1 = iframeDoc.querySelector( "div#step-1" );
      assert.equal( event.target, step1,
                    event.target.id + " triggered impress:stepenter event." );
      doneStepEnter();
    } );

    // Synchronous code and assertions
    assert.ok( iframeWin.impress,
               "impress declared in global scope" );
    assert.strictEqual( iframeWin.impress( "non-default-id" ).init(), undefined,
                        "impress().init() called with 'non-default-id'." );
    assert.strictEqual( iframeWin.impress( "non-default-id" ).init(), undefined,
                        "It's ok to call impress().init() a second time, it's a no-op." );

    // The asserts below are true immediately after impress().init() returns.
    // Therefore we test them here, not in an event handler.
    var notSupportedClass = iframeDoc.body.classList.contains( "impress-not-supported" );
    var yesSupportedClass = iframeDoc.body.classList.contains( "impress-supported" );
    if ( !_impressSupported() ) {
      assert.ok( notSupportedClass,
                 "body.impress-not-supported class still there." );
      assert.ok( !yesSupportedClass,
                 "body.impress-supported class was NOT added." );
    } else {
      assert.ok( !notSupportedClass,
                 "body.impress-not-supported class was removed." );
      assert.ok( yesSupportedClass,
                 "body.impress-supported class was added." );

      assert.ok( !iframeDoc.body.classList.contains( "impress-disabled" ),
                 "body.impress-disabled is removed." );
      assert.ok( iframeDoc.body.classList.contains( "impress-enabled" ),
                 "body.impress-enabled is added." );

      // Steps initialization
      var step1 = iframeDoc.querySelector( "div#step-1" );
      assert.equal( step1.style.position,
                    "absolute",
                    "Step position is 'absolute'." );

      assert.ok( step1.classList.contains( "active" ),
                 "Step 1 has active css class." );

    }
    doneSync();
    console.log( "End init() test (sync)" );
  } ); // LoadIframe()

} );

QUnit.test( "Non default root id, API tests", function( assert ) {
  console.log( "Begin api test" );
  var done = assert.async();
  loadIframe( "test/non_default.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;
      var iframeWin = iframe.contentWindow;

      var wait = 5; // Milliseconds

      var step1 = iframeDoc.querySelector( "div#step-1" );
      var step2 = iframeDoc.querySelector( "div#step-2" );
      var root  = iframeDoc.querySelector( "div#non-default-id" );

      // Things to check on impress:stepenter event -----------------------------//
      var assertStepEnter = function( event ) {
        assert.equal( event.target, step2,
                      event.target.id + " triggered impress:stepenter event." );
        assert.ok( event.target.classList.contains( "present" ),
                   event.target.id + " set present css class." );
        assert.ok( !event.target.classList.contains( "future" ),
                   event.target.id + " unset future css class." );
        assert.ok( !event.target.classList.contains( "past" ),
                   event.target.id + " unset past css class." );
        assert.equal( "#/" + event.target.id, iframeWin.location.hash,
                      "Hash is " + "#/" + event.target.id );

        done();
      };

      var assertStepEnterWrapper = function( event ) {
        setTimeout( function() { assertStepEnter( event ); }, wait );
      };
      root.addEventListener( "impress:stepenter", assertStepEnterWrapper );

      // Done with setup. Start testing! -----------------------------------------------//

      assert.strictEqual( iframeWin.impress( "non-default-id" ).goto(),
                        false,
                        "goto(<nothing>) fails, as it should." );

      // This starts executing the sequence above
      assert.ok( iframeWin.impress( "non-default-id" ).next(),
                 "impress('non-default-id').next() called and returns ok (1->2)" );

      // Things to check immediately after impress().goto() ---------------------------//
      assert.ok( step2.classList.contains( "active" ),
                 step2.id + " set active css class." );
      assert.ok( !step1.classList.contains( "active" ),
                 step1.id + " unset active css class." );

    }, "non-default-id" ); // InitPresentation()
  } ); // LoadIframe()
} );
