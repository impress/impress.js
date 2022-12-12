/**
 * Skip Plugin
 *
 * Example:
 *
 *    <!-- This slide is disabled in presentations, when moving with next()
 *         and prev() commands, but you can still move directly to it, for
 *         example with a url (anything using goto()). -->
 *         <div class="step skip">
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */

/* global document, window */

( function( document, window ) {
    "use strict";
    var util;

    document.addEventListener( "impress:init", function( event ) {
        util = event.detail.api.lib.util;
    }, false );

    var getNextStep = function( el ) {
        var steps = document.querySelectorAll( ".step" );
        for ( var i = 0; i < steps.length; i++ ) {
            if ( steps[ i ] === el ) {
                if ( i + 1 < steps.length ) {
                    return steps[ i + 1 ];
                } else {
                    return steps[ 0 ];
                }
            }
        }
    };
    var getPrevStep = function( el ) {
        var steps = document.querySelectorAll( ".step" );
        for ( var i = steps.length - 1; i >= 0; i-- ) {
            if ( steps[ i ] === el ) {
                if ( i - 1 >= 0 ) {
                    return steps[ i - 1 ];
                } else {
                    return steps[ steps.length - 1 ];
                }
            }
        }
    };

    var skip = function( event ) {
        if ( ( !event ) || ( !event.target ) ) {
            return;
        }

        if ( event.detail.next.classList.contains( "skip" ) ) {
            if ( event.detail.reason === "next" ) {

                // Go to the next next step instead
                event.detail.next = getNextStep( event.detail.next );

                // Recursively call this plugin again, until there's a step not to skip
                skip( event );
            } else if ( event.detail.reason === "prev" ) {

                // Go to the previous previous step instead
                event.detail.next = getPrevStep( event.detail.next );
                skip( event );
            }

            // If the new next element has its own transitionDuration, we're responsible for setting
            // that on the event as well
            event.detail.transitionDuration = util.toNumber(
                event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
            );
        }
    };

    // Register the plugin to be called in pre-stepleave phase
    // The weight makes this plugin run early. This is a good thing, because this plugin calls
    // itself recursively.
    window.impress.addPreStepLeavePlugin( skip, 1 );

} )( document, window );

