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

    var api;
    var toNumber;
    var toNumberAdvanced;

    /**
     * Round the number to 2 decimals, it's enough for use
     */
    var roundNumber = function( num ) {
        return Math.round( ( num + Number.EPSILON ) * 100 ) / 100;
    };

    /**
     * Get the length/norm of a vector.
     *
     * https://en.wikipedia.org/wiki/Norm_(mathematics)
     */
    var vectorLength = function( vec ) {
        return Math.sqrt( vec.x * vec.x + vec.y * vec.y + vec.z * vec.z );
    };

    /**
     * Dot product of two vectors.
     *
     * https://en.wikipedia.org/wiki/Dot_product
     */
    var vectorDotProd = function( vec1, vec2 ) {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z;
    };

    /**
     * Cross product of two vectors.
     *
     * https://en.wikipedia.org/wiki/Cross_product
     */
    var vectorCrossProd = function( vec1, vec2 ) {
        return {
            x: vec1.y * vec2.z - vec1.z * vec2.y,
            y: vec1.z * vec2.x - vec1.x * vec2.z,
            z: vec1.x * vec2.y - vec1.y * vec2.x
        };
    };

    /**
     * Determine wheter a vector is a zero vector
     */
    var isZeroVector = function( vec ) {
        return !roundNumber( vec.x ) && !roundNumber( vec.y ) && !roundNumber( vec.z );
    };

    /**
     * Scalar triple product of three vectors.
     *
     * It can be used to determine the handness of vectors.
     *
     * https://en.wikipedia.org/wiki/Triple_product#Scalar_triple_product
     */
    var tripleProduct = function( vec1, vec2, vec3 ) {
        return vectorDotProd( vectorCrossProd( vec1, vec2 ), vec3 );
    };

    /**
     * The world/absolute unit coordinates.
     *
     * This coordinate is used by browser to position objects.
     * It will not be affected by object rotations.
     * All relative positions will finally be converted to this
     * coordinate to be used.
     */
    var worldUnitCoordinate = {
        x: { x:1, y:0, z:0 },
        y: { x:0, y:1, z:0 },
        z: { x:0, y:0, z:1 }
    };

    /**
     * Make quaternion from rotation axis and angle.
     *
     * q = [ cos(½θ), sin(½θ) axis ]
     *
     * If the angle is zero, returns the corresponded quaternion
     * of axis.
     *
     * If the angle is not zero, returns the rotating quaternion
     * which corresponds to rotation about the axis, by the angle θ.
     *
     * https://en.wikipedia.org/wiki/Quaternion
     * https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation
     */
    var makeQuaternion = function( axis, theta = 0 ) {
        var r = 0;
        var t = 1;

        if ( theta ) {
            var radians = theta * Math.PI / 180;
            r = Math.cos( radians / 2 );
            t = Math.sin( radians / 2 ) / vectorLength( axis );
        }

        var q = [ r, axis.x * t, axis.y * t, axis.z * t ];

        return q;
    };

    /**
     * Extract vector from quaternion
     */
    var quaternionToVector = function( quaternion ) {
        return {
            x: roundNumber( quaternion[ 1 ] ),
            y: roundNumber( quaternion[ 2 ] ),
            z: roundNumber( quaternion[ 3 ] )
        };
    };

    /**
     * Returns the conjugate quaternion of a quaternion
     *
     * https://en.wikipedia.org/wiki/Quaternion#Conjugation,_the_norm,_and_reciprocal
     */
    var conjugateQuaternion = function( quaternion ) {
        return [ quaternion[ 0 ], -quaternion[ 1 ], -quaternion[ 2 ], -quaternion[ 3 ] ];
    };

    /**
     * Left multiple two quaternion.
     *
     * Is's used to combine two rotating quaternion into one.
     */
    var leftMulQuaternion = function( q1, q2 ) {
        return [
            ( q1[ 0 ] * q2[ 0 ] - q1[ 1 ] * q2[ 1 ] - q1[ 2 ] * q2[ 2 ] - q1[ 3 ] * q2[ 3 ] ),
            ( q1[ 1 ] * q2[ 0 ] + q1[ 0 ] * q2[ 1 ] - q1[ 3 ] * q2[ 2 ] + q1[ 2 ] * q2[ 3 ] ),
            ( q1[ 2 ] * q2[ 0 ] + q1[ 3 ] * q2[ 1 ] + q1[ 0 ] * q2[ 2 ] - q1[ 1 ] * q2[ 3 ] ),
            ( q1[ 3 ] * q2[ 0 ] - q1[ 2 ] * q2[ 1 ] + q1[ 1 ] * q2[ 2 ] + q1[ 0 ] * q2[ 3 ] )
        ];
    };

    /**
     * Convert a rotation into a quaternion
     */
    var rotationToQuaternion = function( baseCoordinate, rotation ) {
        var order = rotation.order ? rotation.order : "xyz";
        var axes = order.split( "" );
        var result = [ 1, 0, 0, 0 ];

        for ( var i = 0; i < axes.length; i++ ) {
            var deg = rotation[ axes[ i ] ];
            if ( !deg || ( Math.abs( deg ) < 0.0001 ) ) {
                continue;
            }

            // All CSS rotation is based on the rotated coordinate
            // So we need to calculate the rotated coordinate first
            var coordinate = baseCoordinate;
            if ( i > 0 ) {
                coordinate = {
                    x: rotateByQuaternion( baseCoordinate.x, result ),
                    y: rotateByQuaternion( baseCoordinate.y, result ),
                    z: rotateByQuaternion( baseCoordinate.z, result )
                };
            }

            result = leftMulQuaternion(
                makeQuaternion( coordinate[ axes[ i ] ], deg ),
                result );

        }

        return result;
    };

    /**
     * Rotate a vector by a quaternion.
     */
    var rotateByQuaternion = function( vec, quaternion ) {
        var q = makeQuaternion( vec );

        q = leftMulQuaternion(
            leftMulQuaternion( quaternion, q ),
            conjugateQuaternion( quaternion ) );

        return quaternionToVector( q );
    };

    /**
     * Rotate a vector by rotaion sequence.
     */
    var rotateVector = function( baseCoordinate, vec, rotation ) {
        var quaternion = rotationToQuaternion( baseCoordinate, rotation );

        return rotateByQuaternion( vec, quaternion );
    };

    /**
     * Given a rotation, return the rotationed coordinate
     */
    var rotateCoordinate = function( coordinate, rotation ) {
        var quaternion = rotationToQuaternion( coordinate, rotation );

        return {
            x: rotateByQuaternion( coordinate.x, quaternion ),
            y: rotateByQuaternion( coordinate.y, quaternion ),
            z: rotateByQuaternion( coordinate.z, quaternion )
        };
    };

    /**
     * Return the angle between two vector.
     *
     * The axis is used to determine the rotation direction.
     */
    var angleBetweenTwoVector = function( axis, vec1, vec2 ) {
        var vecLen1 = vectorLength( vec1 );
        var vecLen2 = vectorLength( vec2 );

        if ( !vecLen1 || !vecLen2 ) {
            return 0;
        }

        var cos = vectorDotProd( vec1, vec2 ) / vecLen1 / vecLen2 ;
        var angle = Math.acos( cos ) * 180 / Math.PI;

        if ( tripleProduct( vec1, vec2, axis ) > 0 ) {
            return angle;
        } else {
            return -angle;
        }
    };

    /**
     * Return the angle between a vector and a plane.
     *
     * The plane is determined by an axis and a vector on the plane.
     */
    var angleBetweenPlaneAndVector = function( axis, planeVec, rotatedVec ) {
        var norm = vectorCrossProd( axis, planeVec );

        if ( isZeroVector( norm ) ) {
            return 0;
        }

        return 90 - angleBetweenTwoVector( axis, rotatedVec, norm );
    };

    /**
     * Calculated a order specified rotation sequence to
     * transform from the world coordinate to required coordinate.
     */
    var coordinateToOrderedRotation = function( coordinate, order ) {
        var axis0 = order[ 0 ];
        var axis1 = order[ 1 ];
        var axis2 = order[ 2 ];
        var reversedOrder = order.split( "" ).reverse().join( "" );

        var rotate2 = angleBetweenPlaneAndVector(
            coordinate[ axis2 ],
            worldUnitCoordinate[ axis0 ],
            coordinate[ axis0 ] );

        // The r2 is the reverse of rotate for axis2
        // The coordinate1 is the coordinate before rotate of axis2
        var r2 = { order: reversedOrder };
        r2[ axis2 ] = -rotate2;

        var coordinate1 = rotateCoordinate( coordinate, r2 );

        // Calculate the rotation for axis1
        var rotate1 = angleBetweenTwoVector(
            coordinate1[ axis1 ],
            worldUnitCoordinate[ axis0 ],
            coordinate1[ axis0 ] );

        // The r1 is the reverse of rotate for axis1
        // The v1 is the state before rotate for axis1
        var r1 = { order: reversedOrder };
        r1[ axis1 ] = -rotate1;
        r1[ axis2 ] = -rotate2;

        var coordinate0 = rotateCoordinate( coordinate, r1 );

        // Calculate the rotation for axis0
        var rotate0 = angleBetweenTwoVector(
            coordinate0[ axis0 ],
            worldUnitCoordinate[ axis1 ],
            coordinate0[ axis1 ] );

        var rotation = { };
        rotation.order = order;
        rotation[ axis0 ] = roundNumber( rotate0 );
        rotation[ axis1 ] = roundNumber( rotate1 );
        rotation[ axis2 ] = roundNumber( rotate2 );

        return rotation;
    };

    /**
     * Returns the possible rotations from unit coordinate
     * to specified coordinate.
     */
    var possibleRotations = function( coordinate ) {
        var orders = [ "xyz", "xzy", "yxz", "yzx", "zxy", "zyx" ];
        var rotations = [ ];

        for ( var i = 0; i < orders.length; ++i ) {
            rotations.push(
                coordinateToOrderedRotation( coordinate, orders[ i ] )
            );
        }

        return rotations;
    };

    /**
     * Calculate a degree which in range (-180, 180] of baseDeg
     */
    var nearestAngle = function( baseDeg, deg ) {
        while ( deg > baseDeg + 180 ) {
            deg -= 360;
        }

        while ( deg < baseDeg - 180 ) {
            deg += 360;
        }

        return deg;
    };

    /**
     * Given a base rotation and multiple rotations, return the best one.
     *
     * The best one is the one has least rotate from base.
     */
    var bestRotation = function( baseRotate, rotations ) {
        var bestScore;
        var bestRotation;

        for ( var i = 0; i < rotations.length; ++i ) {
            var rotation = {
                order: rotations[ i ].order,
                x: nearestAngle( baseRotate.x, rotations[ i ].x ),
                y: nearestAngle( baseRotate.y, rotations[ i ].y ),
                z: nearestAngle( baseRotate.z, rotations[ i ].z )
            };

            var score = Math.abs( rotation.x - baseRotate.x ) +
                Math.abs( rotation.y - baseRotate.y ) +
                Math.abs( rotation.z - baseRotate.z );

            if ( !i || ( score < bestScore ) ) {
                bestScore = score;
                bestRotation = rotation;
            }
        }

        return bestRotation;
    };

    /**
     * Given a coordinate, return the best rotation to achieve it.
     *
     * The baseRotate is used to select the near rotation from it.
     */
    var coordinateToRotation = function( baseRotate, coordinate ) {
        var rotations = possibleRotations( coordinate );

        return bestRotation( baseRotate, rotations );
    };

    /**
     * Apply a relative rotation to the base rotation.
     *
     * Calculate the coordinate after the rotation on each axis,
     * and finally find out a one step rotation has the effect
     * of two rotation.
     *
     * If there're multiple way to accomplish, select the one
     * that is nearest to the base.
     *
     * Return one rotation has the same effect.
     */
    var combineRotations = function( base, rotations ) {

        // Find out the base coordinate
        var coordinate = rotateCoordinate( worldUnitCoordinate, base );

        // One by one apply rotations in order
        for ( var i = 0; i < rotations.length; i++ ) {
            coordinate = rotateCoordinate( coordinate, rotations[ i ] );
        }

        // Calculate one rotation from unit coordinate to rotated
        // coordinate.  Because there're multiple possibles,
        // select the one nearest to the base
        var rotate = coordinateToRotation( base, coordinate );

        return rotate;
    };

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

        if ( data.relTo ) {

            var ref = document.getElementById( data.relTo );
            if ( ref ) {

                // Test, if it is a previous step that already has some assigned position data
                if ( el.compareDocumentPosition( ref ) & Node.DOCUMENT_POSITION_PRECEDING ) {
                    prev.x = toNumber( ref.getAttribute( "data-x" ) );
                    prev.y = toNumber( ref.getAttribute( "data-y" ) );
                    prev.z = toNumber( ref.getAttribute( "data-z" ) );
                    prev.rotate.y = toNumber( ref.getAttribute( "data-rotate-y" ) );
                    prev.rotate.x = toNumber( ref.getAttribute( "data-rotate-x" ) );
                    prev.rotate.z = toNumber(
                        ref.getAttribute( "data-rotate-z" ) || ref.getAttribute( "data-rotate" ) );
                    prev.relative = {};
                    prev.relative.position = ref.getAttribute( "data-rel-position" ) || "absolute";
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

        if ( el.hasAttribute( "data-rel-clear" ) ) {

            // Don't inherit from prev, just use the relative setting for current element
            prev.relative = {
                position: prev.relative.position,
                x:0, y:0, z:0,
                rotate: { x:0, y:0, z:0, order: "xyz" } };
        }

        var step = {
                x: toNumber( data.x, prev.x ),
                y: toNumber( data.y, prev.y ),
                z: toNumber( data.z, prev.z ),
                rotate: {
                    x: toNumber( data.rotateX, 0 ),
                    y: toNumber( data.rotateY, 0 ),
                    z: toNumber( data.rotateZ, 0 ),
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
                        order: data.relRotateOrder || "xyz"
                    }
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

        // Once rotate-x/rotate-y/rotate-z is set, all three must be set or use default 0
        var useRelativeRotate = data.rotateX === undefined &&
            data.rotateY === undefined &&
            data.rotateZ === undefined;

        if ( step.relative.position === "relative" ) {
            var rel = rotateVector( worldUnitCoordinate, step.relative, prev.rotate );
            step.x = step.x + rel.x;
            step.y = step.y + rel.y;
            step.z = step.z + rel.z;

            if ( useRelativeRotate ) {

                // The rotations in CSS is applied in order, and after each rotation,
                // the rotation coordinate is updated accordingly. So we can't just
                // sum up the angles.
                // We need to know the new coordinate after each rotation, and calculate
                // the position after the rotation according to it, and finally find
                // out a one step rotation.
                step.rotate = combineRotations( prev.rotate, [ step.relative.rotate ] );
            }
        } else {
            step.x = step.x + step.relative.x;
            step.y = step.y + step.relative.y;
            step.z = step.z + step.relative.z;
            step.rotate.x = step.rotate.x /* + step.relative.rotate.x */;
            step.rotate.y = step.rotate.y /* + step.relative.rotate.y */;
            step.rotate.z = step.rotate.z /* + step.relative.rotate.z */;
        }

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
                relRotateX: el.getAttribute( "data-rel-rotate-x" ),
                relRotateY: el.getAttribute( "data-rel-rotate-y" ),
                relRotateZ: el.getAttribute( "data-rel-rotate-z" ),
                relPosition: el.getAttribute( "data-rel-position" ),
                rotateOrder: el.getAttribute( "data-rotate-order" ),
                relRotateOrder: el.getAttribute( "data-rel-rotate-order" )
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

