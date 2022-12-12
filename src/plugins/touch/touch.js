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

    // Touch handler to detect swiping left and right based on window size.
    // If the difference in X change is bigger than 1/20 of the screen width,
    // we simply call an appropriate API function to complete the transition.
    var startX = 0;
    var lastX = 0;
    var lastDX = 0;
    var threshold = window.innerWidth / 20;

    document.addEventListener( "touchstart", function( event ) {
        lastX = startX = event.touches[ 0 ].clientX;
    } );

    document.addEventListener( "touchmove", function( event ) {
         var x = event.touches[ 0 ].clientX;
         var diff = x - startX;

         // To be used in touchend
         lastDX = lastX - x;
         lastX = x;

         window.impress().swipe( diff / window.innerWidth );
     } );

     document.addEventListener( "touchend", function() {
         var totalDiff = lastX - startX;
         if ( Math.abs( totalDiff ) > window.innerWidth / 5 && ( totalDiff * lastDX ) <= 0 ) {
             if ( totalDiff > window.innerWidth / 5 && lastDX <= 0 ) {
                 window.impress().prev();
             } else if ( totalDiff < -window.innerWidth / 5 && lastDX >= 0 ) {
                 window.impress().next();
             }
         } else if ( Math.abs( lastDX ) > threshold ) {
             if ( lastDX < -threshold ) {
                 window.impress().prev();
             } else if ( lastDX > threshold ) {
                 window.impress().next();
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
