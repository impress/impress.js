/**
 * Resize plugin
 *
 * Rescale the presentation after a window resize.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 * Released under the MIT license.
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.5.3
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 *
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    // Throttling function calls, by Remy Sharp
    // http://remysharp.com/2010/07/21/throttling-function-calls/
    var throttle = function( fn, delay ) {
        var timer = null;
        return function() {
            var context = this, args = arguments;
            window.clearTimeout( timer );
            timer = window.setTimeout( function() {
                fn.apply( context, args );
            }, delay );
        };
    };

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {
        var api = event.detail.api;

        // Rescale presentation when window is resized
        window.addEventListener( "resize", throttle( function() {

            // Force going to active step again, to trigger rescaling
            api.goto( document.querySelector( ".step.active" ), 500 );
        }, 250 ), false );
    }, false );

} )( document, window );

