/**
 * Mouse timeout plugin
 *
 * After 3 seconds of mouse inactivity, add the css class
 * `body.impress-mouse-timeout`. On `mousemove`, `click` or `touch`, remove the
 * class.
 *
 * The use case for this plugin is to use CSS to hide elements from the screen
 * and only make them visible when the mouse is moved. Examples where this
 * might be used are: the toolbar from the toolbar plugin, and the mouse cursor
 * itself.
 *
 * Example CSS:
 *
 *     body.impress-mouse-timeout {
 *         cursor: none;
 *     }
 *     body.impress-mouse-timeout div#impress-toolbar {
 *         display: none;
 *     }
 *
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
/* global window, document */
( function( document, window ) {
    "use strict";
    var timeout = 3;
    var timeoutHandle;

    var hide = function() {

        // Mouse is now inactive
        document.body.classList.add( "impress-mouse-timeout" );
    };

    var show = function() {
        if ( timeoutHandle ) {
            window.clearTimeout( timeoutHandle );
        }

        // Mouse is now active
        document.body.classList.remove( "impress-mouse-timeout" );

        // Then set new timeout after which it is considered inactive again
        timeoutHandle = window.setTimeout( hide, timeout * 1000 );
    };

    document.addEventListener( "impress:init", function( event ) {
        var api = event.detail.api;
        var gc = api.lib.gc;
        gc.addEventListener( document, "mousemove", show );
        gc.addEventListener( document, "click", show );
        gc.addEventListener( document, "touch", show );

        // Set first timeout
        show();

        // Unset all this on teardown
        gc.pushCallback( function() {
            window.clearTimeout( timeoutHandle );
            document.body.classList.remove( "impress-mouse-timeout" );
        } );
    }, false );

} )( document, window );
