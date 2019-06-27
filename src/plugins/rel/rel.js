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
 *         <div class="step" data-rel-x="1000" data-rel-y="500">
 *
 * Following html attributes are supported for step elements:
 *
 *     data-rel-x
 *     data-rel-y
 *     data-rel-z
 *
 * These values are also inherited from the previous step. This makes it easy to
 * create a boring presentation where each slide shifts for example 1000px down
 * from the previous.
 *
 * In addition to plain numbers, which are pixel values, it is also possible to
 * define relative positions as a multiple of screen height and width, using
 * a unit of "h" and "w", respectively, appended to the number.
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
            prev = { x:0, y:0, z:0, relative: { x:0, y:0, z:0 } };
        }

        if ( data.relTo ) {

            var ref = document.getElementById( data.relTo );
            if ( ref ) {

                // Test, if it is a previous step that already has some assigned position data
                if ( el.compareDocumentPosition( ref ) & Node.DOCUMENT_POSITION_PRECEDING ) {
                    prev.x = toNumber( ref.getAttribute( "data-x" ) );
                    prev.y = toNumber( ref.getAttribute( "data-y" ) );
                    prev.z = toNumber( ref.getAttribute( "data-z" ) );
                    prev.relative = {};
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

        var step = {
                x: toNumber( data.x, prev.x ),
                y: toNumber( data.y, prev.y ),
                z: toNumber( data.z, prev.z ),
                relative: {
                    x: toNumberAdvanced( data.relX, prev.relative.x ),
                    y: toNumberAdvanced( data.relY, prev.relative.y ),
                    z: toNumberAdvanced( data.relZ, prev.relative.z )
                }
            };

        // Relative position is ignored/zero if absolute is given.
        // Note that this also has the effect of resetting any inherited relative values.
        if ( data.x !== undefined ) {
            step.relative.x = 0;
        }
        if ( data.y !== undefined ) {
            step.relative.y = 0;
        }
        if ( data.z !== undefined ) {
            step.relative.z = 0;
        }

        // Apply relative position to absolute position, if non-zero
        // Note that at this point, the relative values contain a number value of pixels.
        step.x = step.x + step.relative.x;
        step.y = step.y + step.relative.y;
        step.z = step.z + step.relative.z;

        return step;
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
                relX: el.getAttribute( "data-rel-x" ),
                relY: el.getAttribute( "data-rel-y" ),
                relZ: el.getAttribute( "data-rel-z" )
            } );
            var step = computeRelativePositions( el, prev );

            // Apply relative position (if non-zero)
            el.setAttribute( "data-x", step.x );
            el.setAttribute( "data-y", step.y );
            el.setAttribute( "data-z", step.z );
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

                // Reset x/y/z in cases where this plugin has changed it.
                if ( step.relX !== null ) {
                    if ( step.x === null ) {
                        step.el.removeAttribute( "data-x" );
                    } else {
                        step.el.setAttribute( "data-x", step.x );
                    }
                }
                if ( step.relY !== null ) {
                    if ( step.y === null ) {
                        step.el.removeAttribute( "data-y" );
                    } else {
                        step.el.setAttribute( "data-y", step.y );
                    }
                }
                if ( step.relZ !== null ) {
                    if ( step.z === null ) {
                        step.el.removeAttribute( "data-z" );
                    } else {
                        step.el.setAttribute( "data-z", step.z );
                    }
                }
            }
            delete startingState[ root.id ];
        } );
    }, false );
} )( document, window );

