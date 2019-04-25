/**
 * Substep Plugin
 *
 * Copyright 2017 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    // Copied from core impress.js. Good candidate for moving to src/lib/util.js.
    var triggerEvent = function( el, eventName, detail ) {
        var event = document.createEvent( "CustomEvent" );
        event.initCustomEvent( eventName, true, true, detail );
        el.dispatchEvent( event );
    };

    var activeStep = null;
    document.addEventListener( "impress:stepenter", function( event ) {
        activeStep = event.target;
    }, false );

    var substep = function( event ) {
        if ( ( !event ) || ( !event.target ) ) {
            return;
        }

        var step = event.target;
        var el; // Needed by jshint
        if ( event.detail.reason === "next" ) {
            el = showSubstepIfAny( step );
            if ( el ) {

                // Send a message to others, that we aborted a stepleave event.
                triggerEvent( step, "impress:substep:stepleaveaborted",
                              { reason: "next", substep: el } );

                // Autoplay uses this for reloading itself
                triggerEvent( step, "impress:substep:enter",
                              { reason: "next", substep: el } );

                // Returning false aborts the stepleave event
                return false;
            }
        }
        if ( event.detail.reason === "prev" ) {
            el = hideSubstepIfAny( step );
            if ( el ) {
                triggerEvent( step, "impress:substep:stepleaveaborted",
                              { reason: "prev", substep: el } );

                triggerEvent( step, "impress:substep:leave",
                              { reason: "prev", substep: el } );

                return false;
            }
        }
    };

    var showSubstepIfAny = function( step ) {
        var substeps = step.querySelectorAll( ".substep" );
        var visible = step.querySelectorAll( ".substep-visible" );
        if ( substeps.length > 0 ) {
            return showSubstep( substeps, visible );
        }
    };

    var showSubstep = function( substeps, visible ) {
        if ( visible.length < substeps.length ) {
            var el = substeps[ visible.length ];
            el.classList.add( "substep-visible" );
            return el;
        }
    };

    var hideSubstepIfAny = function( step ) {
        var substeps = step.querySelectorAll( ".substep" );
        var visible = step.querySelectorAll( ".substep-visible" );
        if ( substeps.length > 0 ) {
            return hideSubstep( visible );
        }
    };

    var hideSubstep = function( visible ) {
        if ( visible.length > 0 ) {
            var el = visible[ visible.length - 1 ];
            el.classList.remove( "substep-visible" );
            return el;
        }
    };

    // Register the plugin to be called in pre-stepleave phase.
    // The weight makes this plugin run before other preStepLeave plugins.
    window.impress.addPreStepLeavePlugin( substep, 1 );

    // When entering a step, in particular when re-entering, make sure that all substeps are hidden
    // at first
    document.addEventListener( "impress:stepenter", function( event ) {
        var step = event.target;
        var visible = step.querySelectorAll( ".substep-visible" );
        for ( var i = 0; i < visible.length; i++ ) {
            visible[ i ].classList.remove( "substep-visible" );
        }
    }, false );

    // API for others to reveal/hide next substep ////////////////////////////////////////////////
    document.addEventListener( "impress:substep:show", function() {
        showSubstepIfAny( activeStep );
    }, false );

    document.addEventListener( "impress:substep:hide", function() {
        hideSubstepIfAny( activeStep );
    }, false );

} )( document, window );
