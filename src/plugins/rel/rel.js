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

    var api;
    var startingState = {};

    var toNumber;
    var toNumberAdvanced;

    var computeRelativePositions = function( el, prev ) {
        var data = el.dataset;

        if ( !prev ) {

            // For the first step, inherit these defaults
            prev = {
                x:0, y:0, z:0,
                rotate: { x:0, y:0, z:0, order:"xyz" },
                relative: {
                    position: "absolute",
                    x:0, y:0, z:0,
                    rotate: { x:0, y:0, z:0, order:"xyz" }
                }
            };
        }

        var ref = prev;
        if ( data.relTo ) {

            ref = document.getElementById( data.relTo );
            if ( ref ) {

                // Test, if it is a previous step that already has some assigned position data
                if ( el.compareDocumentPosition( ref ) & Node.DOCUMENT_POSITION_PRECEDING ) {
                    prev.x = toNumberAdvanced( ref.getAttribute( "data-x" ) );
                    prev.y = toNumberAdvanced( ref.getAttribute( "data-y" ) );
                    prev.z = toNumberAdvanced( ref.getAttribute( "data-z" ) );

                    var prevPosition = ref.getAttribute( "data-rel-position" ) || "absolute";

                    if ( prevPosition !== "relative" ) {

                        // For compatibility with the old behavior, doesn't inherit otherthings,
                        // just like a reset.
                        prev.rotate = { x:0, y:0, z:0, order: "xyz" };
                        prev.relative = {
                            position: "absolute",
                            x:0, y:0, z:0,
                            rotate: { x:0, y:0, z:0, order:"xyz" }
                        };
                    } else {

                        // For data-rel-position="relative", inherit all
                        prev.rotate.y = toNumber( ref.getAttribute( "data-rotate-y" ) );
                        prev.rotate.x = toNumber( ref.getAttribute( "data-rotate-x" ) );
                        prev.rotate.z = toNumber(
                            ref.getAttribute( "data-rotate-z" ) ||
                            ref.getAttribute( "data-rotate" ) );

                        // We also inherit relatives from relTo slide
                        prev.relative = {
                            position: prevPosition,
                            x: toNumberAdvanced( ref.getAttribute( "data-rel-x" ), 0 ),
                            y: toNumberAdvanced( ref.getAttribute( "data-rel-y" ), 0 ),
                            z: toNumberAdvanced( ref.getAttribute( "data-rel-z" ), 0 ),
                            rotate: {
                                x: toNumberAdvanced( ref.getAttribute( "data-rel-rotate-x" ), 0 ),
                                y: toNumberAdvanced( ref.getAttribute( "data-rel-rotate-y" ), 0 ),
                                z: toNumberAdvanced( ref.getAttribute( "data-rel-rotate-z" ), 0 ),
                                order: ( ref.getAttribute( "data-rel-rotate-order" ) ||  "xyz" )
                            }
                        };
                    }
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

        // While ``data-rel-reset="relative"`` or just ``data-rel-reset``,
        // ``data-rel-x/y/z`` and ``data-rel-rotate-x/y/z`` will have default value of 0,
        // instead of inherit from previous slide.
        //
        // If ``data-rel-reset="all"``, ``data-rotate-*`` are not inherited from previous slide too.
        // So ``data-rel-reset="all" data-rotate-x="90"`` means
        // ``data-rotate-x="90" data-rotate-y="0" data-rotate-z="0"``, we doesn't need to
        // bother clearing all unneeded attributes.

        var inheritRotation = true;
        if ( el.hasAttribute( "data-rel-reset" ) ) {

            // Don't inherit from prev, just use the relative setting for current element
            prev.relative = {
                position: prev.relative.position,
                x:0, y:0, z:0,
                rotate: { x:0, y:0, z:0, order: "xyz" } };

            if ( data.relReset === "all" ) {
                inheritRotation = false;
            }
        }

        var step = {
                x: toNumberAdvanced( data.x, prev.x ),
                y: toNumberAdvanced( data.y, prev.y ),
                z: toNumberAdvanced( data.z, prev.z ),
                rotate: {
                    x: toNumber( data.rotateX, 0 ),
                    y: toNumber( data.rotateY, 0 ),
                    z: toNumber( data.rotateZ || data.rotate, 0 ),
                    order: data.rotateOrder || "xyz"
                },
                relative: {
                    position: data.relPosition || prev.relative.position,
                    x: toNumberAdvanced( data.relX, prev.relative.x ),
                    y: toNumberAdvanced( data.relY, prev.relative.y ),
                    z: toNumberAdvanced( data.relZ, prev.relative.z ),
                    rotate: {
                        x: toNumber( data.relRotateX, prev.relative.rotate.x ),
                        y: toNumber( data.relRotateY, prev.relative.rotate.y ),
                        z: toNumber( data.relRotateZ, prev.relative.rotate.z ),
                        order: data.rotateOrder || "xyz"
                    }
                }
            };

        // The final relatives maybe or maybe not the same with orignal data-rel-*
        var relative = step.relative;

        if ( step.relative.position === "relative" && inheritRotation ) {

            // Calculate relatives based on previous slide
            relative = api.lib.rotation.translateRelative(
                step.relative, prev.rotate );

            // Convert rotations to values that works with step.rotate
            relative.rotate.x -= step.rotate.x;
            relative.rotate.y -= step.rotate.y;
            relative.rotate.z -= step.rotate.z;
        }

        // Relative position is ignored/zero if absolute is given.
        // Note that this also has the effect of resetting any inherited relative values.
        if ( data.x !== undefined ) {
            relative.x = step.relative.x = 0;
        }
        if ( data.y !== undefined ) {
            relative.y = step.relative.y = 0;
        }
        if ( data.z !== undefined ) {
            relative.z = step.relative.z = 0;
        }
        if ( data.rotateX !== undefined || !inheritRotation ) {
            relative.rotate.x = step.relative.rotate.x = 0;
        }
        if ( data.rotateY !== undefined || !inheritRotation ) {
            relative.rotate.y = step.relative.rotate.y = 0;
        }
        if ( data.rotateZ !== undefined || data.rotate !== undefined || !inheritRotation ) {
            relative.rotate.z = step.relative.rotate.z = 0;
        }

        step.x = step.x + relative.x;
        step.y = step.y + relative.y;
        step.z = step.z + relative.z;
        step.rotate.x = step.rotate.x + relative.rotate.x;
        step.rotate.y = step.rotate.y + relative.rotate.y;
        step.rotate.z = step.rotate.z + relative.rotate.z;

        return step;
    };

    var rel = function( root, impressApi ) {
        api = impressApi;
        toNumber = api.lib.util.toNumber;
        toNumberAdvanced = api.lib.util.toNumberAdvanced;

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
                relZ: el.getAttribute( "data-rel-z" ),
                rotateX: el.getAttribute( "data-rotate-x" ),
                rotateY: el.getAttribute( "data-rotate-y" ),
                rotateZ: el.getAttribute( "data-rotate-z" ),
                rotate: el.getAttribute( "data-rotate" ),
                relRotateX: el.getAttribute( "data-rel-rotate-x" ),
                relRotateY: el.getAttribute( "data-rel-rotate-y" ),
                relRotateZ: el.getAttribute( "data-rel-rotate-z" ),
                relPosition: el.getAttribute( "data-rel-position" ),
                rotateOrder: el.getAttribute( "data-rotate-order" )
            } );
            var step = computeRelativePositions( el, prev );

            // Apply relative position (if non-zero)
            el.setAttribute( "data-x", step.x );
            el.setAttribute( "data-y", step.y );
            el.setAttribute( "data-z", step.z );
            el.setAttribute( "data-rotate-x", step.rotate.x );
            el.setAttribute( "data-rotate-y", step.rotate.y );
            el.setAttribute( "data-rotate-z", step.rotate.z );
            el.setAttribute( "data-rotate-order", step.rotate.order );
            el.setAttribute( "data-rel-position", step.relative.position );
            el.setAttribute( "data-rel-x", step.relative.x );
            el.setAttribute( "data-rel-y", step.relative.y );
            el.setAttribute( "data-rel-z", step.relative.z );
            el.setAttribute( "data-rel-rotate-x", step.relative.rotate.x );
            el.setAttribute( "data-rel-rotate-y", step.relative.rotate.y );
            el.setAttribute( "data-rel-rotate-z", step.relative.rotate.z );
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
            var attrs = [
                [ "x", "relX" ],
                [ "y", "relY" ],
                [ "z", "relZ" ],
                [ "rotate-x", "relRotateX" ],
                [ "rotate-y", "relRotateY" ],
                [ "rotate-z", "relRotateZ" ],
                [ "rotate-order", "relRotateOrder" ]
            ];

            while ( step = steps.pop() ) {

                // Reset x/y/z in cases where this plugin has changed it.
                for ( var i = 0; i < attrs.length; i++ ) {
                    if ( step[ attrs[ i ][ 1 ] ] !== null ) {
                        if ( step[ attrs[ i ][ 0 ] ] === null ) {
                            step.el.removeAttribute( "data-" + attrs[ i ][ 0 ] );
                        } else {
                            step.el.setAttribute(
                                "data-" + attrs[ i ][ 0 ], step[ attrs[ i ][ 0 ] ] );
                        }
                    }
                }
            }
            delete startingState[ root.id ];
        } );
    }, false );
} )( document, window );

