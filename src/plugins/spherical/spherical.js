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

    var attributeTracker = [];

    /**
     * Copied from core impress.js. We currently lack a library mechanism to
     * to share utility functions like this.
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

    var computeCartesianPositions = function( el ) {
        var cartesian, data;

        data = el.dataset;

        if ( data.sphericalDistance && data.sphericalPhi ) {
            if ( !data.sphericalTheta ) {
                attributeTracker.push( { "node": el, "attr": "data-spherical-theta" } );
                el.setAttribute( "data-spherical-theta", 90 );
            }

            cartesian = sphericalToCartesian(
                toNumber( data.sphericalDistance, 0 ),
                toNumber( data.sphericalPhi * Math.PI / 180, 0 ),
                toNumber( data.sphericalTheta * Math.PI / 180, 90 )
            );

            if ( data.x === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-x" } );
                el.setAttribute( "data-x", cartesian.x );
            }
            if ( data.y === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-y" } );
                el.setAttribute( "data-y", cartesian.y );
            }
            if ( data.z === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-z" } );
                el.setAttribute( "data-z", cartesian.z );
            }
        } else if ( data.sphericalRelDistance && data.sphericalRelPhi ) {

            if ( !data.sphericalRelTheta ) {
                attributeTracker.push( { "node": el, "attr": "data-spherical-rel-theta" } );
                el.setAttribute( "data-spherical-rel-theta", 90 );
            }

            cartesian = sphericalToCartesian(
                toNumber( data.sphericalRelDistance, 0 ),
                toNumber( data.sphericalRelPhi * Math.PI / 180, 0 ),
                toNumber( data.sphericalRelTheta * Math.PI / 180, 90 )
            );

            if ( data.relX === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-rel-x" } );
                el.setAttribute( "data-rel-x", cartesian.x );
            }
            if ( data.relY === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-rel-y" } );
                el.setAttribute( "data-rel-y", cartesian.y );
            }
            if ( data.relZ === undefined ) {
                attributeTracker.push( { "node": el, "attr": "data-rel-z" } );
                el.setAttribute( "data-rel-z", cartesian.z );
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

    // Register the plugin to be called in pre-init phase, MUST run before rel plugin
    window.impress.addPreInitPlugin( spherical, 5 );

    // Register teardown callback to reset the data.x, .y, .z and data.relX, .relY, .relZ yvalues.
    document.addEventListener( "impress:init", function( event ) {
        event.detail.api.lib.gc.pushCallback( teardown );
    }, false );
} )( document, window );

