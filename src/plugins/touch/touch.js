/**
 * Support for swipe and tap on touch devices
 *
 * This plugin implements navigation for plugin devices, via swiping left/right,
 * or tapping on the left/right edges of the screen.
 *
 *
 *
 * Copyright 2015: Andrew Dunai (@and3rson)
 * Modified to a plugin, 2016: Henrik Ingo (@henrikingo)
 *
 * MIT License
 */
/* global document, window */
( function( document, window ) {
    "use strict";

    // Touch handler to detect swiping left and right, up and down based on
    // window size.
    // If the difference in X or Y change is bigger than 1/20 of the screen
    // width or height, we simply call an appropriate API function to complete
    // the transition.
    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastY = 0;
    var lastDX = 0;
    var lastDY = 0;
    var thresholdX = window.innerWidth / 20;
    var thresholdY = window.innerHeight / 20;

    var triggerKeyboardEvent = function( el, eventName, detail ) {
        var event = new KeyboardEvent( eventName, detail );
        el.dispatchEvent( event );
    };

    document.addEventListener( "touchstart", function( event ) {
        lastX = startX = event.touches[ 0 ].clientX;
        lastY = startY = event.touches[ 0 ].clientY;
    } );

    document.addEventListener( "touchmove", function( event ) {
         var x = event.touches[ 0 ].clientX;
         var y = event.touches[ 0 ].clientY;
         var diffX = x - startX;
         var diffY = y - startY;

         // To be used in touchend
         lastDX = lastX - x;
         lastDY = lastY - y;
         lastX = x;
         lastY = y;

         window.impress().swipe( diffX / window.innerWidth );
     } );

     document.addEventListener( "touchend", function( event ) {
         var root = event.target;
         var totalDiffX = lastX - startX;
         var totalDiffY = lastY - startY;
         if ( Math.abs( totalDiffX ) > window.innerWidth / 5 && ( totalDiffX * lastDX ) <= 0 ) {
             if ( totalDiffX > window.innerWidth / 5 && lastDX <= 0 ) {
                 window.impress().prev();
             } else if ( totalDiffX < -window.innerWidth / 5 && lastDX >= 0 ) {
                 window.impress().next();
             }
         } else if ( Math.abs( lastDX ) > thresholdX ) {
             if ( lastDX < -thresholdX ) {
                 window.impress().prev();
             } else if ( lastDX > thresholdX ) {
                 window.impress().next();
             }
         } else if ( Math.abs( totalDiffY ) > window.innerHeight / 5 && ( totalDiffY * lastDY ) <= 0 ) {
             var detailUp = {'bubbles':true, 'cancelable':true, 'key':'ArrowUp', 'keyCode':38};   // ArrowUp
             var detailDown = {'bubbles':true, 'cancelable':true, 'key':'ArrowDown', 'keyCode':40};   // ArrowDown

             if ( totalDiffY > window.innerHeight / 5 && lastDY <= 0 ) {
                 triggerKeyboardEvent(root, 'keydown', detailUp);
                 triggerKeyboardEvent(root, 'keyup', detailUp);
             } else if ( totalDiffY < -window.innerHeight / 5 && lastDY >= 0 ) {
                 triggerKeyboardEvent(root, 'keydown', detailDown);
                 triggerKeyboardEvent(root, 'keyup', detailDown);
             }
         } else if ( Math.abs( lastDY ) > thresholdY ) {
             if ( lastDY < -thresholdY ) {
                 triggerKeyboardEvent(root, 'keydown', detailUp);
                 triggerKeyboardEvent(root, 'keyup', detailUp);
             } else if ( lastDY > thresholdY ) {
                 triggerKeyboardEvent(root, 'keydown', detailDown);
                 triggerKeyboardEvent(root, 'keyup', detailDown);
             }

         } else {

             // No movement - move (back) to the current slide
             window.impress().goto( document.querySelector( "#impress .step.active" ) );
         }
     } );

     document.addEventListener( "touchcancel", function() {

             // Move (back) to the current slide
             window.impress().goto( document.querySelector( "#impress .step.active" ) );
     } );

} )( document, window );
