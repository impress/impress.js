/**
 * Support for swipe and tap on touch devices
 *
 * This plugin implements navigation for plugin devices, via swiping up/down,
 * or tapping on the up/down edges of the screen.
 *
 * This is a modified "touch" plugin for impress.js, 2020: Arsenii Lyzenko
 * (@pticagovorun)
 *
 *
 * MIT License
 */
/* global document, window */
( function( document, window ) {
    "use strict";

    // Touch handler to detect swiping up and down based on window size.
    // If the difference in Y change is bigger than 1/20 of the screen height,
    // we simply call an appropriate API function to complete the transition.
    var startY = 0;
    var lastY = 0;
    var lastDY = 0;
    var threshold = window.innerHeight / 20;

    document.addEventListener( "touchstart", function( event ) {
        lastY = startY = event.touches[ 0 ].clientY;
    } );

    document.addEventListener( "touchmove", function( event ) {
         var y = event.touches[ 0 ].clientY;
         var diff = y - startY;

         // To be used in touchend
         lastDY = lastY - y;
         lastY = y;

         window.impress().swipe( diff / window.innerHeight );
     } );

     document.addEventListener( "touchend", function() {
         var totalDiff = lastY - startY;
         if ( Math.abs( totalDiff ) > window.innerHeight / 5 && ( totalDiff * lastDY ) <= 0 ) {
             if ( totalDiff > window.innerHeight / 5 && lastDY <= 0 ) {
                 window.impress().prev();
             } else if ( totalDiff < -window.innerHeight / 5 && lastDY >= 0 ) {
                 window.impress().next();
             }
         } else if ( Math.abs( lastDY ) > threshold ) {
             if ( lastDY < -threshold ) {
                 window.impress().prev();
             } else if ( lastDY > threshold ) {
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
