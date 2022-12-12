/**
 * Fullscreen plugin
 *
 * Press F5 to enter fullscreen and ESC to exit fullscreen mode.
 *
 * Copyright 2019 @giflw
 * Released under the MIT license.
 */
/* global document */

( function( document ) {
    "use strict";

    function enterFullscreen() {
        var elem = document.documentElement;
        if ( !document.fullscreenElement ) {
            elem.requestFullscreen();
        }
    }

    function exitFullscreen() {
        if ( document.fullscreenElement ) {
            document.exitFullscreen();
        }
    }

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {
        var api = event.detail.api;
        var root = event.target;
        var gc = api.lib.gc;
        var util = api.lib.util;

        gc.addEventListener( document, "keydown", function( event ) {

            // 116 (F5) is sent by presentation remote controllers
            if ( event.code === "F5" ) {
                event.preventDefault();
                enterFullscreen();
                util.triggerEvent( root.querySelector( ".active" ), "impress:steprefresh" );
            }

            // 27 (Escape) is sent by presentation remote controllers
            if ( event.key === "Escape" || event.key === "F5" ) {
                event.preventDefault();
                exitFullscreen();
                util.triggerEvent( root.querySelector( ".active" ), "impress:steprefresh" );
            }
        }, false );

        util.triggerEvent( document, "impress:help:add",
            { command: "F5 / ESC", text: "Fullscreen: Enter / Exit", row: 200 } );

    }, false );

} )( document );

