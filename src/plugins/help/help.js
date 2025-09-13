/**
 * Help popup plugin
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

    var body = document.querySelector( "body" );

    // This querySelector is used to keep compatibility with templates using div#impress-help
    var helpDiv = document.querySelector( "#impress-help" ) || document.createElement( "div" );
    body.appendChild( helpDiv );

    var fullHelpDiv = document.createElement( "div" );
    var fullHelpStyle = {
        display: "none",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        color: "#FFF",
        opacity: 0.8,
        textAlign: "center",
        padding: "3em"
    };

    body.appendChild( fullHelpDiv );

    var css = function( elem, style ) {
        for ( var p in style ) {
            elem.style[ p ] = style[ p ];
        }
    };
    css( fullHelpDiv, fullHelpStyle );

    var renderDiv = function( elem, shortOnly ) {
        if ( elem ) {
            var html = [];
            for ( var row in rows ) {
                for ( var arrayItem in row ) {
                    var item = rows[ row ][ arrayItem ];
                    if ( item ) {
                        if ( ( shortOnly && item.short ) || !shortOnly ) {
                            html.push( item.row );
                        }
                    }
                }
            }
            if ( html ) {
                elem.innerHTML = "<table style='width: 100%'>\n" + html.join( "\n" ) + "</table>\n";
            }
        }
    };

    var renderHelpDiv = function() {
        renderDiv( helpDiv, true );
        renderDiv( fullHelpDiv, false );
    };

    var toggle = function( elem ) {
        if ( !elem ) {
            return;
        }

        if ( elem.style.display === "block" ) {
            elem.style.display = "none";
        } else {
            elem.style.display = "block";
            if ( elem === helpDiv ) {
                window.clearTimeout( timeoutHandle );
            } else {

                // Hides helpDiv when fullHelpDiv is shown
                helpDiv.style.display = "none";
                window.clearTimeout( timeoutHandle );
            }
        }
    };

    document.addEventListener( "keyup", function( event ) {

        if ( event.keyCode === 72 || event.keyCode === 191 ) { // "h" || "?"
            event.preventDefault();
            toggle( helpDiv );
        } else if ( event.key === "F1" ) {
            event.preventDefault();
            toggle( fullHelpDiv );
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
     * :param: e.detail.short    If this help must appear in the short help. Example: true
     */
    document.addEventListener( "impress:help:add", function( e ) {

        // The idea is for the sender of the event to supply a unique row index, used for sorting.
        // But just in case two plugins would ever use the same row index, we wrap each row into
        // its own array. If there are more than one entry for the same index, they are shown in
        // first come, first serve ordering.
        var rowIndex = e.detail.row;
        var short = e.detail.short;
        rows[ rowIndex ] = rows[ rowIndex ] || [];
        rows[ e.detail.row ].push( {
            row: "<tr><td><strong>" + e.detail.command + "</strong></td><td>" +
                                   e.detail.text + "</td></tr>",
            short: !!short
        } );
        renderHelpDiv();
    } );

    document.addEventListener( "impress:init", function( e ) {
        var api = e.detail.api;
        var gc = api.lib.gc;
        var util = api.lib.util;

        renderHelpDiv();

        // At start, show the help for 7 seconds.
        if ( helpDiv ) {
            helpDiv.style.display = "block";
            timeoutHandle = window.setTimeout( function() {
                helpDiv.style.display = "none";
            }, 7000 );

            // Regster callback to empty the help div on teardown
            gc.pushCallback( function() {
                window.clearTimeout( timeoutHandle );
                helpDiv.remove();
                fullHelpDiv.remove();
                rows = [];
            } );
        }

        // Use our own API to register the help text for "h"
        util.triggerEvent( document, "impress:help:add",
                      { command: "H", text: "Show/hide this help", row: 0, short: true } );
        util.triggerEvent( document, "impress:help:add",
                      { command: "F1", text: "Show/hide full help", row: 999, short: true } );
    } );

} )( document, window );

