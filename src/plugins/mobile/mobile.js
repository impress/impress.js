/**
 * Mobile devices support
 *
 * Allow presentation creators to hide all but 3 slides, to save resources, particularly on mobile
 * devices, using classes body.impress-mobile, .step.prev, .step.active and .step.next.
 *
 * Note: This plugin does not take into account possible redirections done with skip, goto etc
 * plugins. Basically it wouldn't work as intended in such cases, but the active step will at least
 * be correct.
 *
 * Adapted to a plugin from a submission by @Kzeni:
 * https://github.com/impress/impress.js/issues/333
 */
/* global document, navigator */
( function( document ) {
    "use strict";

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

    // Detect mobile browsers & add CSS class as appropriate.
    document.addEventListener( "impress:init", function( event ) {
        var body = document.body;
        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                 navigator.userAgent
             ) ) {
            body.classList.add( "impress-mobile" );
        }

        // Unset all this on teardown
        var api = event.detail.api;
        api.lib.gc.pushCallback( function() {
            document.body.classList.remove( "impress-mobile" );
            var prev = document.getElementsByClassName( "prev" )[ 0 ];
            var next = document.getElementsByClassName( "next" )[ 0 ];
            if ( typeof prev !== "undefined" ) {
                prev.classList.remove( "prev" );
            }
            if ( typeof next !== "undefined" ) {
                next.classList.remove( "next" );
            }
        } );
    } );

    // Add prev and next classes to the siblings of the newly entered active step element
    // Remove prev and next classes from their current step elements
    // Note: As an exception we break namespacing rules, as these are useful general purpose
    // classes. (Naming rules would require us to use css classes mobile-next and mobile-prev,
    // based on plugin name.)
    document.addEventListener( "impress:stepenter", function( event ) {
	      var oldprev = document.getElementsByClassName( "prev" )[ 0 ];
	      var oldnext = document.getElementsByClassName( "next" )[ 0 ];

	      var prev = getPrevStep( event.target );
	      prev.classList.add( "prev" );
	      var next = getNextStep( event.target );
	      next.classList.add( "next" );

	      if ( typeof oldprev !== "undefined" ) {
		      oldprev.classList.remove( "prev" );
              }
	      if ( typeof oldnext !== "undefined" ) {
		      oldnext.classList.remove( "next" );
              }
    } );
} )( document );

