/*
 * Copyright 2016 Henrik Ingo (@henrikingo)
 *
 * Released under the MIT license. See LICENSE file.
 */

/* global document, console, setTimeout, loadIframe, initPresentation, _impressSupported, QUnit */

QUnit.module( "Core Tests" );

QUnit.test( "Initialize Impress.js", function( assert ) {
  console.log( "Begin init() test" );

  // Init triggers impress:init and impress:stepenter events, which we want to catch.
  var doneInit      = assert.async();
  var doneStepEnter = assert.async();
  var doneSync      = assert.async();

  loadIframe( "test/core_tests_presentation.html", assert, function() {
    var iframe = document.getElementById( "presentation-iframe" );
    var iframeDoc = iframe.contentDocument;
    var iframeWin = iframe.contentWindow;
    var root  = iframeDoc.querySelector( "div#impress" );

    // Catch events triggered by init()
    var assertInit = function() {
      assert.ok( true, "impress:init event triggered." );

      var canvas = iframeDoc.querySelector( "div#impress > div" );

      // Delay and duration don't become set before the first transition actually happened
      assert.equal( canvas.style.transitionDelay,
                    "0ms",
                    "canvas.style.transitionDelay initialized correctly" );
      assert.equal( canvas.style.transitionDuration,
                    "0ms",
                    "canvas.style.transitionDuration initialized correctly" );

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
    assert.strictEqual( iframeWin.impress().init(), undefined,
                        "impress().init() called." );
    assert.strictEqual( iframeWin.impress().init(), undefined,
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

      var canvas = iframeDoc.querySelector( "div#impress > div" );
      assert.ok( !canvas.classList.contains( "step" ) && canvas.id === "",
                 "Additional 'canvas' div inserted between div#impress root and steps." );
      assert.equal( canvas.style.transform,
                    "rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(1000px, 0px, 0px)",
                    "canvas.style.transform initialized correctly" );
      assert.ok( canvas.style.transformOrigin === "left top 0px" ||
                 canvas.style.transformOrigin ===  "left top",
                    "canvas.style.transformOrigin initialized correctly" );
      assert.equal( canvas.style.transformStyle,
                    "preserve-3d",
                    "canvas.style.transformStyle initialized correctly" );
      assert.equal( canvas.style.transitionProperty,
                    "all",
                    "canvas.style.transitionProperty initialized correctly" );
      assert.equal( canvas.style.transitionTimingFunction,
                    "ease-in-out",
                    "canvas.style.transitionTimingFunction initialized correctly" );

      assert.equal( iframeDoc.documentElement.style.height,
                    "100%",
                    "documentElement.style.height is 100%" );

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

// Note: Here we focus on testing the core functionality of moving between
// steps, the css classes set and unset, and events triggered.
// TODO: more complex animations and check position, transitions, delays, etc...
QUnit.test( "Impress Core API", function( assert ) {
  console.log( "Begin core api test" );
  var done = assert.async();
  loadIframe( "test/core_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;
      var iframeWin = iframe.contentWindow;

      // Impress.js itself uses event listeners to manipulate most CSS classes.
      // Wait a short while before checking, to avoid race.
      // (See assertStepEnterWrapper and assertStepLeaveWrapper.)
      var wait = 5; // Milliseconds

      var step1 = iframeDoc.querySelector( "div#step-1" );
      var step2 = iframeDoc.querySelector( "div#step-2" );
      var step3 = iframeDoc.querySelector( "div#step-3" );
      var step4 = iframeDoc.querySelector( "div#fourth" );
      var root  = iframeDoc.querySelector( "div#impress" );

      // On impress:stepenter, we do some assertions on the "entered" object.
      // On impress:stepleave, we do some assertions on the "left" object.
      // Finally we call next() to initialize the next transition, and it starts all over again.
      var i = 0;
      var sequence = [ { left: step1,
                         entered: step2,
                         next: function() { return iframeWin.impress().goto( 2 ); },
                         text: "goto(<number>) called and returns ok (2->3)" },
                       { left: step2,
                         entered: step3,
                         next: function() { return iframeWin.impress().goto( "fourth" ); },
                         text: "goto(<string>) called and returns ok (3->4)" },
                       { left: step3,
                         entered: step4,
                         next: function() { return iframeWin.impress().next(); },
                         text: "next() wraps around to first step (4->1)" },
                       { left: step4,
                         entered: step1,
                         next: function() { return iframeWin.impress().prev(); },
                         text: "prev() wraps around to last step (1->4)" },
                       { left: step1,
                         entered: step4,
                         next: function() { return iframeWin.impress().prev(); },
                         text: "prev() called and returns ok (4->3)" },
                       { left: step4,
                         entered: step3,
                         next: function() { return iframeWin.impress().goto( 0 ); },
                         text: "End of test suite, return to first step with goto(0)." },
                       { left: step3,
                         entered: step1,
                         next: false } // False = end of sequence
      ];

      // When both assertStepEnter and assertStepLeave are done, we can go to next step in sequence.
      var readyCount = 0;
      var readyForNext = function() {
        readyCount++;
        if ( readyCount % 2 === 0 ) {
          if ( sequence[ i ].next ) {
            assert.ok( sequence[ i ].next(), sequence[ i ].text );
            i++;
            assertImmediately();
          } else {
            done();
            console.log( "End core api test" );
          }
        }
      };

      // Things to check on impress:stepenter event -----------------------------//
      var assertStepEnter = function( event ) {
        assert.equal( event.target, sequence[ i ].entered,
                      event.target.id + " triggered impress:stepenter event." );
        assert.ok( event.target.classList.contains( "present" ),
                   event.target.id + " set present css class." );
        assert.ok( !event.target.classList.contains( "future" ),
                   event.target.id + " unset future css class." );
        assert.ok( !event.target.classList.contains( "past" ),
                   event.target.id + " unset past css class." );
        assert.equal( "#/" + event.target.id, iframeWin.location.hash,
                      "Hash is " + "#/" + event.target.id );

        // Just by way of comparison, check transitionDuration again, in a non-init transition
        var canvas = iframeDoc.querySelector( "div#impress > div" );
        assert.equal( canvas.style.transitionDelay,
                      "0ms",
                      "canvas.style.transitionDelay set correctly" );
        assert.equal( canvas.style.transitionDuration,
                      "1000ms",
                      "canvas.style.transitionDuration set correctly" );

        readyForNext();
      };

      var assertStepEnterWrapper = function( event ) {
        setTimeout( function() { assertStepEnter( event ); }, wait );
      };
      root.addEventListener( "impress:stepenter", assertStepEnterWrapper );

      // Things to check on impress:stepleave event -----------------------------//
      var assertStepLeave = function( event ) {
        assert.equal( event.target, sequence[ i ].left,
                      event.target.id + " triggered impress:stepleave event." );
        assert.ok( !event.target.classList.contains( "present" ),
                   event.target.id + " unset present css class." );
        assert.ok( !event.target.classList.contains( "future" ),
                   event.target.id + " unset future css class." );
        assert.ok( event.target.classList.contains( "past" ),
                   event.target.id + " set past css class." );
        readyForNext();
      };

      var assertStepLeaveWrapper = function( event ) {
        setTimeout( function() { assertStepLeave( event ); }, wait );
      };
      root.addEventListener( "impress:stepleave", assertStepLeaveWrapper );

      // Things to check immediately after impress().goto() ---------------------------//
      var assertImmediately = function() {
        assert.ok( sequence[ i ].entered.classList.contains( "active" ),
                   sequence[ i ].entered.id + " set active css class." );
        assert.ok( !sequence[ i ].left.classList.contains( "active" ),
                   sequence[ i ].left.id + " unset active css class." );
      };

      // Done with setup. Start testing! -----------------------------------------------//
      // Do no-op tests first, then trigger the sequence of transitions we setup above. //

      assert.strictEqual( iframeWin.impress().goto( iframeDoc.querySelector( "div#impress" ) ),
                        false,
                        "goto() to a non-step element fails, as it should." );
      assert.strictEqual( iframeWin.impress().goto(),
                        false,
                        "goto(<nothing>) fails, as it should." );

      // This starts executing the sequence above
      assert.ok( iframeWin.impress().next(),
                 "next() called and returns ok (1->2)" );
    } ); // InitPresentation()
  } ); // LoadIframe()
} );
