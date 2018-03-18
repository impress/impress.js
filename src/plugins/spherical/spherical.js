/**
 * Spherical Positioning Plugin
 * ============================
 *
 * This plugin provides support for positioning steps with polar or shperical coordinates.
 * This is often more convenient when arranging slides along a circle or similar. It also
 * supports relative positioning.
 *
 * Example:
 *
 *  <!-- Position step 1000 px distance to origin at an angle of 50 degree. -->
 *  <div class="step" data-spherical-dist="1000" data-spherical-rho="50">
 *
 *  <!-- Position step 500 px distance to origin at a primary angle of 270 degree and a
 *       secondary angle of -30 degree (= 330 degree) -->
 *  <div class="step" data-spherical-dist="500" data-spherical-rho="270" data-spherical-theta="-30">
 *
 *
 * Following html attributes are supported for step elements:
 *
 *     data-spherical-distance
 *     data-spherical-rho
 *     data-spherical-theta
 *
 *     data-spherical-rel-distance
 *     data-sphercial-rel-rho
 *     data-spherical-rel-theta
 *
 * Non-zero relative values are inherited from the previous step. This makes it easy to
 * create a presentation where subsequent slides are arranged along a circle.
 *
 * The above spherical values are ignored, or set to zero, if the corresponding
 * absolute values (`data-x` etc...) is set.
 *
 * The plugin translates all spherical coordinates to cartesian coordinates, which then could
 * for example be used by the `rel` plugin. In fact, to get the relative positioning working,
 * the `rel` plugin is needed, actually. If it is not present, relative values are silently ignored.
 *
 * Copyright 2018 Holger Teichert (@complanar)
 * Released under the MIT license.
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    var phiDefault = 0;
    var thetaDefault = 90;
    var attributeTracker = [];

    /**
     * Copied from core impress.js.
     */
    var toNumber = function( numeric, fallback ) {
        return isNaN( numeric ) ? ( fallback || 0 ) : Number( numeric );
    };

    var sphericalToCartesian = function( r, phi, theta ) {
        var x = r * Math.sin( theta ) * Math.cos( phi );
        var y = r * Math.sin( theta ) * Math.sin( phi );
        var z = r * Math.cos( theta );
        return { x: x, y: y, z: z };
    };

    var computeCartesianPositions = function( step ) {
        var cartesian, data;
        data = step.dataset;

        if ( data.sphericalDistance !== undefined && data.sphericalPhi !== undefined ) {

            if ( data.x === undefined && data.x === undefined ) {
                if ( data.z === undefined ) {
                    cartesian = sphericalToCartesian(
                        toNumber( data.sphericalDistance, 0 ),
                        toNumber( data.sphericalPhi, phiDefault ) * Math.PI / 180,
                        toNumber( data.sphericalTheta, thetaDefault ) * Math.PI / 180
                    );
                } else {
                    cartesian = sphericalToCartesian(
                        toNumber( data.sphericalDistance, 0 ),
                        toNumber( data.sphericalPhi, phiDefault ) * Math.PI / 180,
                        thetaDefault * Math.PI / 180
                    );
                }

                attributeTracker.push( { "node": step, "attr": "data-x" } );
                step.setAttribute( "data-x", cartesian.x );
                attributeTracker.push( { "node": step, "attr": "data-y" } );
                step.setAttribute( "data-y", cartesian.y );

                if ( data.z === undefined ) {
                    attributeTracker.push( { "node": step, "attr": "data-z" } );
                    step.setAttribute( "data-z", cartesian.z );
                } else if ( data.sphericalTheta !== undefined ) {
                    window.console.warn(
                        "impress.js spherical plugin: data-z attribute seems to be set " +
                        "already. Ignoring data-spherical-theta attribute."
                    );
                }
            } else {
                window.console.warn(
                    "impress.js spherical plugin: data-x or data-y attributes seems to be set " +
                    "already. Ignoring all data-spherical-* attributes."
                );
            }
        } else if ( data.sphericalRelDistance !== undefined &&
                    data.sphericalRelPhi !== undefined ) {

            if ( data.x === undefined && data.x === undefined ) {
                if ( data.relZ === undefined ) {
                    cartesian = sphericalToCartesian(
                        toNumber( data.sphericalRelDistance, 0 ),
                        toNumber( data.sphericalRelPhi, phiDefault ) * Math.PI / 180,
                        toNumber( data.sphericalRelTheta, thetaDefault ) * Math.PI / 180
                    );
                } else {
                    cartesian = sphericalToCartesian(
                        toNumber( data.sphericalRelDistance, 0 ),
                        toNumber( data.sphericalRelPhi, phiDefault ) * Math.PI / 180,
                        thetaDefault * Math.PI / 180
                    );
                }

                attributeTracker.push( { "node": step, "attr": "data-rel-x" } );
                step.setAttribute( "data-rel-x", cartesian.x );
                attributeTracker.push( { "node": step, "attr": "data-rel-y" } );
                step.setAttribute( "data-rel-y", cartesian.y );

                if ( data.relZ === undefined ) {
                    attributeTracker.push( { "node": step, "attr": "data-rel-z" } );
                    step.setAttribute( "data-rel-z", cartesian.z );
                } else if ( data.sphericalRelTheta !== undefined ) {
                    window.console.warn(
                        "impress.js spherical plugin: data-rel-z attribute seems to be set " +
                        "already. Ignoring data-spherical-rel-theta attribute."
                    );
                }
            } else {
                 window.console.warn(
                    "impress.js spherical plugin: data-rel-x or data-rel-y attribute seems to " +
                    "be set already. Ignoring data-spherical-rel-* attributes."
                );
            }
        }
    };

    var spherical = function( root ) {
        var steps, i;
        steps = root.querySelectorAll( ".step" );
        for ( i = 0; i < steps.length; i++ ) {
            computeCartesianPositions( steps[ i ] );
        }
    };

    var teardown = function() {
        var el, i;
        for ( i = 0; i < attributeTracker.length; i++ ) {
            el = attributeTracker[ i ];
            el.node.removeAttribute( el.attr );
        }
        attributeTracker = [];
    };

    // Register the plugin to be called in pre-init phase, MUST run before rel plugin to get
    // relative positioning functionality.
    window.impress.addPreInitPlugin( spherical, 5 );

    // Register teardown callback to reset the data.x, .y, .z and data.relX, .relY, .relZ values.
    document.addEventListener( "impress:init", function( event ) {
        event.detail.api.lib.gc.pushCallback( teardown );
    }, false );
} )( document, window );

