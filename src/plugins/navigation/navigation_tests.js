/*
 * Copyright 2016 Henrik Ingo (@henrikingo)
 *
 * Released under the MIT license. See LICENSE file.
 */
/* global QUnit, loadIframe, initPresentation, document, window */

QUnit.module( "Navigation plugin" );

QUnit.test( "Navigation Plugin", function( assert ) {
  window.console.log( "Begin navigation plugin" );
  var done = assert.async();

  loadIframe( "test/core_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;
      var iframeWin = iframe.contentWindow;

      var wait = 5; // Milliseconds

      var step1 = iframeDoc.querySelector( "div#step-1" );
      var step2 = iframeDoc.querySelector( "div#step-2" );
      var step3 = iframeDoc.querySelector( "div#step-3" );
      var step4 = iframeDoc.querySelector( "div#fourth" );
      var root  = iframeDoc.querySelector( "div#impress" );

      var i = 0;
      var sequence = [ { left: step1,
                         entered: step2,
                         next: function() { return iframeWin.syn.type( "bodyid", " " ); },
                         text: "space (2->3)" },
                       { left: step2,
                         entered: step3,
                         next: function() { return iframeWin.syn.type( "bodyid", "[right]" ); },
                         text: "[right] (3->4)" },
                       { left: step3,
                         entered: step4,
                         next: function() { return iframeWin.syn.type( "bodyid", "\t" ); },
                         text: "tab (4->1)" },
                       { left: step4,
                         entered: step1,
                         next: function() { return iframeWin.syn.type( "bodyid", "[down]" ); },
                         text: "[down] (1->2)" },
                       { left: step1,
                         entered: step2,
                         next: function() { return iframeWin.syn.type( "bodyid", "[page-down]" ); },
                         text: "[page-down] (2->3)" },
                       { left: step2,
                         entered: step3,
                         next: function() { return iframeWin.syn.type( "bodyid", "[page-up]" ); },
                         text: "[page-up] (3->2)" },
                       { left: step3,
                         entered: step2,
                         next: function() { return iframeWin.syn.type( "bodyid", "[left]" ); },
                         text: "[left] (2->1)" },
                       { left: step2,
                         entered: step1,
                         next: function() { return iframeWin.syn.type( "bodyid", "[up]" ); },
                         text: "[up] (1->4)" },
                       { left: step1,
                         entered: step4,
                         next: function() { return iframeWin.syn.click( "step-2", {} ); },
                         text: "click on 2 (4->2)" },
                       { left: step4,
                         entered: step2,
                         next: function() { return iframeWin.syn.click( "linktofourth", {} ); },
                         text: "click on link with href to id=fourth (2->4)" },
                       { left: step2,
                         entered: step4,
                         next: function() { return iframeWin.impress().goto( 0 ); },
                         text: "Return to first step with goto(0)." },
                       { left: step4,
                         entered: step1,
                         next: false }
      ];

      var readyCount = 0;
      var readyForNext = function() {
        readyCount++;
        if ( readyCount % 2 === 0 ) {
          if ( sequence[ i ].next ) {
            assert.ok( sequence[ i ].next(), sequence[ i ].text );
            i++;
          } else {
            window.console.log( "End navigation plugin" );
            done();
          }
        }
      };

      // Things to check on impress:stepenter event -----------------------------//
      var assertStepEnter = function( event ) {
        assert.equal( event.target, sequence[ i ].entered,
                      event.target.id + " triggered impress:stepenter event." );
        readyForNext();
      };

      var assertStepEnterWrapper = function( event ) {
        window.setTimeout( function() { assertStepEnter( event ); }, wait );
      };
      root.addEventListener( "impress:stepenter", assertStepEnterWrapper );

      // Things to check on impress:stepleave event -----------------------------//
      var assertStepLeave = function( event ) {
        assert.equal( event.target, sequence[ i ].left,
                      event.target.id + " triggered impress:stepleave event." );
        readyForNext();
      };

      var assertStepLeaveWrapper = function( event ) {
        window.setTimeout( function() { assertStepLeave( event ); }, wait );
      };
      root.addEventListener( "impress:stepleave", assertStepLeaveWrapper );

      assert.ok( iframeWin.impress().next(), "next() called and returns ok (1->2)" );
    } ); // InitPresentation()
  } ); // LoadIframe()
} );

QUnit.test( "Navigation Plugin - No-op tests", function( assert ) {
  window.console.log( "Begin navigation no-op" );
  var done = assert.async();

  loadIframe( "test/core_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;
      var iframeWin = iframe.contentWindow;

      var wait = 5; // Milliseconds

      var root  = iframeDoc.querySelector( "div#impress" );

      // This should never happen -----------------------------//
      var assertStepEnter = function( event ) {
        assert.ok( false,
                   event.target.id + " triggered impress:stepenter event." );
      };

      var assertStepEnterWrapper = function( event ) {
        window.setTimeout( function() { assertStepEnter( event ); }, wait );
      };
      root.addEventListener( "impress:stepenter", assertStepEnterWrapper );

      // This should never happen -----------------------------//
      var assertStepLeave = function( event ) {
        assert.ok( false,
                   event.target.id + " triggered impress:stepleave event." );
      };

      var assertStepLeaveWrapper = function( event ) {
        window.setTimeout( function() { assertStepLeave( event ); }, wait );
      };
      root.addEventListener( "impress:stepleave", assertStepLeaveWrapper );

      // These are no-op actions, we're already in step-1 -----------------------//
      //assert.ok( iframeWin.syn.click( "step-1", {} ),
      //           "Click on step that is currently active, should do nothing." );
      assert.ok( iframeWin.syn.click( "linktofirst", {} ),
                 "Click on link pointing to step that is currently active, should do nothing." );

      // After delay, if no event triggers are called. We're done.
      window.setTimeout( function() {
          window.console.log( "End navigation no-op" ); done();
      }, 3000 );
    } ); // InitPresentation()
  } ); // LoadIframe()
} );
