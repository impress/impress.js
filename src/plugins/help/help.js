/**
 * Help popup plugin
 *
 * Example:
 *
 *     <!-- Show a help popup at start, or if user presses "H" -->
 *     <div id="impress-help"></div>
 *
 * For developers:
 *
 * Typical use for this plugin, is for plugins that support some keypress, to add a line
 * to the help popup produced by this plugin. For example "P: Presenter console".
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
/* global window, document */

( function( document, window ) {
    "use strict";
    var rows = [];
    var timeoutHandle;

    var triggerEvent = function( el, eventName, detail ) {
        var event = document.createEvent( "CustomEvent" );
        event.initCustomEvent( eventName, true, true, detail );
        el.dispatchEvent( event );
    };

    var renderHelpDiv = function() {
        var helpDiv = document.getElementById( "impress-help" );
        if ( helpDiv ) {
            var html = [];
            for ( var row in rows ) {
                for ( var arrayItem in row ) {
                    html.push( rows[ row ][ arrayItem ] );
                }
            }
            if ( html ) {
                helpDiv.innerHTML = "<table>\n" + html.join( "\n" ) + "</table>\n";
            }
        }
    };

    var toggleHelp = function() {
        var helpDiv = document.getElementById( "impress-help" );
        if ( !helpDiv ) {
            return;
        }

        if ( helpDiv.style.display === "block" ) {
            helpDiv.style.display = "none";
        } else {
            helpDiv.style.display = "block";
            window.clearTimeout( timeoutHandle );
        }
    };

    document.addEventListener( "keyup", function( event ) {

        if ( event.keyCode === 72 || event.keyCode === 191 ) { // "h" || "?"
            event.preventDefault();
            toggleHelp();
        }
    }, false );

    // API
    // Other plugins can add help texts, typically if they support an action on a keypress.
    /**
     * Add a help text to the help popup.
     *
     * :param: e.detail.command  Example: "H"
     * :param: e.detail.text     Example: "Show this help."
     * :param: e.detail.row      Row index from 0 to 9 where to place this help text. Example: 0
     */
    document.addEventListener( "impress:help:add", function( e ) {

        // The idea is for the sender of the event to supply a unique row index, used for sorting.
        // But just in case two plugins would ever use the same row index, we wrap each row into
        // its own array. If there are more than one entry for the same index, they are shown in
        // first come, first serve ordering.
        var rowIndex = e.detail.row;
        if ( typeof rows[ rowIndex ] !== "object" || !rows[ rowIndex ].isArray ) {
            rows[ rowIndex ] = [];
        }
        rows[ e.detail.row ].push( "<tr><td><strong>" + e.detail.command + "</strong></td><td>" +
                                   e.detail.text + "</td></tr>" );
        renderHelpDiv();
    } );

    document.addEventListener( "impress:init", function( e ) {
        renderHelpDiv();

        // At start, show the help for 7 seconds.
        var helpDiv = document.getElementById( "impress-help" );
        if ( helpDiv ) {
            helpDiv.style.display = "block";
            timeoutHandle = window.setTimeout( function() {
                var helpDiv = document.getElementById( "impress-help" );
                helpDiv.style.display = "none";
            }, 7000 );

            // Regster callback to empty the help div on teardown
            var api = e.detail.api;
            api.lib.gc.pushCallback( function() {
                window.clearTimeout( timeoutHandle );
                helpDiv.style.display = "";
                helpDiv.innerHTML = "";
                rows = [];
            } );
        }

        // Use our own API to register the help text for "h"
        triggerEvent( document, "impress:help:add",
                      { command: "H", text: "Show this help", row: 0 } );
    } );

} )( document, window );

