/**
 * Relative Positioning Plugin
 *
 * This plugin provides support for defining the coordinates of a step relative
 * to the previous step. This is often more convenient when creating presentations,
 * since as you add, remove or move steps, you may not need to edit the positions
 * as much as is the case with the absolute coordinates supported by impress.js
 * core.
 *
 * Example:
 *
 *         <!-- Position step 1000 px to the right and 500 px up from the previous step. -->
 *         <div class="step" data-rel-x="1000" data-rel-y="500" data-rel-rotate="90" >
 *
 *         <!-- Position step 1000 px to the left and 750 px up from the step with id "title". -->
 *         <div class="step" data-rel-x="-1000" data-rel-y="750" data-rel-to="title">
 *
 * Following html attributes are supported for step elements:
 *
 *     data-rel-to
 *
 *     data-rel-x
 *     data-rel-y
 *     data-rel-z
 *
 *     data-rel-rotate-x
 *     data-rel-rotate-y
 *     data-rel-rotate-z
 *     // or equivalently
 *     data-rel-rotate
 *
 * These values are not inherited from the previous step.
 *
 * The above relative values are ignored, or set to zero, if the corresponding
 * absolute value (`data-x` etc...) is set.
 *
 * In addition to plain numbers, which are pixel values, for `data-rel-{x,y,z}`
 * it is also possible to define relative positions as a multiple of screen
 * height and width, using a unit of "h" and "w", respectively, appended to the
 * number.
 *
 * Example:
 *
 *        <div class="step" data-rel-x="1.5w" data-rel-y="1.5h">
 *
 * This plugin is a *pre-init plugin*. It is called synchronously from impress.js
 * core at the beginning of `impress().init()`. This allows it to process its own
 * data attributes first, and possibly alter the data-x, data-y and data-z attributes
 * that will then be processed by `impress().init()`.
 *
 * (Another name for this kind of plugin might be called a *filter plugin*, but
 * *pre-init plugin* is more generic, as a plugin might do whatever it wants in
 * the pre-init stage.)
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    var startingState = {};

    /**
     * Copied from core impress.js. We currently lack a library mechanism to
     * to share utility functions like this.
     */
    var toNumber = function( numeric, fallback ) {
        return isNaN( numeric ) ? ( fallback || 0 ) : Number( numeric );
    };

    /**
     * Extends toNumber() to correctly compute also relative-to-screen-size values 5w and 5h.
     *
     * Returns the computed value in pixels with w/h postfix removed.
     */
    var toNumberAdvanced = function( numeric, fallback ) {
        if ( typeof numeric !== "string" ) {
            return toNumber( numeric, fallback );
        }
        var ratio = numeric.match( /^([+-]*[\d\.]+)([wh])$/ );
        if ( ratio == null ) {
            return toNumber( numeric, fallback );
        } else {
            var value = parseFloat( ratio[ 1 ] );
            var multiplier = ratio[ 2 ] === "w" ? window.innerWidth : window.innerHeight;
            return value * multiplier;
        }
    };

    var computeRelativePositions = function( el, prev ) {
        var data = el.dataset;

        if ( !prev ) {

            // For the first step, inherit these defaults
            prev = { x:0, y:0, z:0, rotateX:0, rotateY:0, rotateZ:0 };
        }

        if ( data.relTo ) {

            var ref = document.getElementById( data.relTo );
            if ( ref ) {

                // Test, if it is a previous step that already has some assigned position data
                if ( el.compareDocumentPosition( ref ) & Node.DOCUMENT_POSITION_PRECEDING ) {
                    prev.x = toNumber( ref.getAttribute( "data-x" ) );
                    prev.y = toNumber( ref.getAttribute( "data-y" ) );
                    prev.z = toNumber( ref.getAttribute( "data-z" ) );
                    prev.rotateX = toNumber( ref.getAttribute( "data-rotate-x" ) );
                    prev.rotateY = toNumber( ref.getAttribute( "data-rotate-y" ) );
                    prev.rotateZ = toNumber( ref.getAttribute( "data-rotate" ) ||
                      ref.getAttribute( "data-rotate-z" ) );
                } else {
                    window.console.error(
                        "impress.js rel plugin: Step \"" + data.relTo + "\" is not defined " +
                        "*before* the current step. Referencing is limited to previously defined " +
                        "steps. Please check your markup. Ignoring data-rel-to attribute of " +
                        "this step. Have a look at the documentation for how to create relative " +
                        "positioning to later shown steps with the help of the goto plugin."
                    );
                }
            } else {

                // Step not found
                window.console.warn(
                    "impress.js rel plugin: \"" + data.relTo + "\" is not a valid step in this " +
                    "impress.js presentation. Please check your markup. Ignoring data-rel-to " +
                    "attribute of this step."
                );
            }
        }

        return {

          // If data-? is set, discard any data-rel-? values otherwise use data-rel-?
          // If neither data-? nor data-rel-? are set - use 0 as a default value
          x: data.x !== undefined ? toNumber( data.x ) :
              ( data.relX === undefined ? 0 : prev.x + toNumberAdvanced( data.relX ) ),
          y: data.y !== undefined ? toNumber( data.y ) :
              ( data.relY === undefined ? 0 : prev.y + toNumberAdvanced( data.relY ) ),
          z: data.z !== undefined ? toNumber( data.z ) :
              ( data.relZ === undefined ? 0 : prev.z + toNumberAdvanced( data.relZ ) ),
          rotateX: data.rotateX !== undefined ? toNumber( data.rotateX ) :
              ( data.relRotateX === undefined ? 0 : prev.rotateX + toNumber( data.relRotateX ) ),
          rotateY: data.rotateY !== undefined ? toNumber( data.rotateY ) :
              ( data.relRotateY === undefined ? 0 : prev.rotateY + toNumber( data.relRotateY ) ),
          rotateZ: data.rotateZ !== undefined || data.rotate  !== undefined ?
              toNumber( data.rotate || data.rotateZ ) :
              ( data.relRotate === undefined && data.relRotateZ === undefined ? 0 :
                  prev.rotateZ + toNumber( data.relRotate || data.relRotateZ ) )
        };
    };

    var rel = function( root ) {
        var steps = root.querySelectorAll( ".step" );
        var prev;
        startingState[ root.id ] = [];
        for ( var i = 0; i < steps.length; i++ ) {
            var el = steps[ i ];
            startingState[ root.id ].push( {
                el: el,
                x: el.getAttribute( "data-x" ),
                y: el.getAttribute( "data-y" ),
                z: el.getAttribute( "data-z" ),
                rotateX: el.getAttribute( "data-rotate-x" ),
                rotateY: el.getAttribute( "data-rotate-y" ),
                rotateZ: el.getAttribute( "data-rotate-z" )
            } );
            var step = computeRelativePositions( el, prev );

            // Apply relative position (if non-zero)
            el.setAttribute( "data-x", step.x );
            el.setAttribute( "data-y", step.y );
            el.setAttribute( "data-z", step.z );
            el.setAttribute( "data-rotate-x", step.rotateX );
            el.setAttribute( "data-rotate-y", step.rotateY );
            el.setAttribute( "data-rotate-z", step.rotateZ );
            el.removeAttribute( "data-rel-x" );
            el.removeAttribute( "data-rel-y" );
            el.removeAttribute( "data-rel-z" );
            el.removeAttribute( "data-rel-rotate-x" );
            el.removeAttribute( "data-rel-rotate-y" );
            el.removeAttribute( "data-rel-rotate-z" );
            prev = step;
        }
    };

    // Register the plugin to be called in pre-init phase
    window.impress.addPreInitPlugin( rel );

    // Register teardown callback to reset the data.x, .y, .z values.
    document.addEventListener( "impress:init", function( event ) {
        var root = event.target;
        event.detail.api.lib.gc.pushCallback( function() {
            var steps = startingState[ root.id ];
            var step;
            while ( step = steps.pop() ) {
                if ( step.x === null ) {
                    step.el.removeAttribute( "data-x" );
                } else {
                    step.el.setAttribute( "data-x", step.x );
                }
                if ( step.y === null ) {
                    step.el.removeAttribute( "data-y" );
                } else {
                    step.el.setAttribute( "data-y", step.y );
                }
                if ( step.z === null ) {
                    step.el.removeAttribute( "data-z" );
                } else {
                    step.el.setAttribute( "data-z", step.z );
                }
                if ( step.rotateX === null ) {
                    step.el.removeAttribute( "data-rotate-x" );
                } else {
                    step.el.setAttribute( "data-rotate-x", step.rotateX );
                }
                if ( step.rotateY === null ) {
                    step.el.removeAttribute( "data-rotate-y" );
                } else {
                    step.el.setAttribute( "data-rotate-y", step.rotateY );
                }
                if ( step.rotateZ === null ) {
                    step.el.removeAttribute( "data-rotate-z" );
                    step.el.removeAttribute( "data-rotate" );
                } else {
                    step.el.setAttribute( "data-rotate-z", step.rotateZ );
                    step.el.setAttribute( "data-rotate", step.rotateZ );
                }
            }
            delete startingState[ root.id ];
        } );
    }, false );
} )( document, window );

