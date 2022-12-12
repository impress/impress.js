/**
 * Helper functions for rotation.
 *
 * Tommy Tam (c) 2021
 * MIT License
 */
( function( document, window ) {
    "use strict";

    // Singleton library variables
    var roots = [];

    var libraryFactory = function( rootId ) {
        if ( roots[ "impress-root-" + rootId ] ) {
            return roots[ "impress-root-" + rootId ];
        }

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

            // Calculate the rotation for axis0
            var rotate0 = angleBetweenTwoVector(
                worldUnitCoordinate[ axis0 ],
                worldUnitCoordinate[ axis1 ],
                coordinate1[ axis1 ] );

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
        var combineRotations = function( rotations ) {

            // No rotation
            if ( rotations.length <= 0 ) {
                return { x:0, y:0, z:0, order:"xyz" };
            }

            // Find out the base coordinate
            var coordinate = worldUnitCoordinate;

            // One by one apply rotations in order
            for ( var i = 0; i < rotations.length; i++ ) {
                coordinate = rotateCoordinate( coordinate, rotations[ i ] );
            }

            // Calculate one rotation from unit coordinate to rotated
            // coordinate.  Because there're multiple possibles,
            // select the one nearest to the base
            var rotate = coordinateToRotation( rotations[ 0 ], coordinate );

            return rotate;
        };

        var translateRelative = function( relative, prevRotation ) {
            var result = rotateVector(
                worldUnitCoordinate, relative, prevRotation );
            result.rotate = combineRotations(
                [ prevRotation, relative.rotate ] );

            return result;
        };

        var lib = {
            translateRelative: translateRelative
        };

        roots[ "impress-root-" + rootId ] = lib;
        return lib;
    };

    // Let impress core know about the existence of this library
    window.impress.addLibraryFactory( { rotation: libraryFactory } );

} )( document, window );
