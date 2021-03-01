/**
 * Roam Plugin
 *
 * This plugin allows the user to change the view freely.
 *
 * Copyright 2021 kdxcxs (cx@kdxcxs.com)
 * Released under the MIT license.
 * ------------------------------------------------------
 *  author:  kdxcxs
 *  version: 0.1.0
 */

( function( document, window ) {
    "use strict";
    var api = window.impress();
    var gc = api.lib.gc;

    // Stores the active state of impress.
    // It will be set to `true` when impress inits,
    // and set to `false` when `impress().tear()` is called.
    var impressActive;

    // Seconds per frame, used to calculate the value move or rotate each time.
    var spf;
    var spfNow = 0;
    var spfBefore = Date.now();

    // Object that stores roaming state.
    var roams = {};

    // Keys controls roaming.
    var roamKeys = "wsadqeikjluo";

    function multiplyQuaternions ( qa, qb ) {
        const qaw = qa[ 0 ], qax = qa[ 1 ], qay = qa[ 2 ], qaz = qa[ 3 ];
        const qbw = qb[ 0 ], qbx = qb[ 1 ], qby = qb[ 2 ], qbz = qb[ 3 ];

        return [
            qaw * qbw - qax * qbx - qay * qby - qaz * qbz,
            qax * qbw + qaw * qbx + qay * qbz - qaz * qby,
            qay * qbw + qaw * qby + qaz * qbx - qax * qbz,
            qaz * qbw + qaw * qbz + qax * qby - qay * qbx
        ];
    }

    // Called every time before the browser renders the frame to change the view by moving, rotating or both of them.
    function roamAnimationFrame( timestamp ) {
        if ( !impressActive ) {
            // Stop requesting animation frame and do nothing for the coming frame if impress is no longer active.
            return;
        }

        // Request to be called before next time the frame renders as long as impress is active.
        window.requestAnimationFrame( roamAnimationFrame );

        // The value of `spfNow` is the timestamp when the browser rendered last frame,
        // so `Date.now() - spfBefore` is the seconds-per-frame( or, accuratly, milliseconds ).
        spfNow = Date.now();
        spf = spfNow - spfBefore;
        spfBefore = spfNow;

        // If no key's pressed down, do nothing for the comming frame.
        if ( roams.keys.length === 0 ) {
            return;
        }

        var presentStep = document.getElementsByClassName( "step active present" )[ 0 ];

        // Here is a interesting one.
        //
        // The `getVectorQuaternion()` function here converts a vector( which contains x, y and z coordinates )
        // in the step( which might be rotated ) coordinate system to the world coordinate system
        // so that could be used to move the step in the world coordinate system.
        //
        // For those who missed the computer graphics lessons, you may say, "But whay quaternion?".
        // That's because CSS rotation uses Euler angles which is not easy to calculate,
        // here converts the Euler angles to quaternion for calculation.
        // So function bellow is pure math.
        function getVectorQuaternion( ...dirVec ) {
            // Convert direction vector to quaternion for further calculation.
            var vectorQuaternion = [
                0,
                ...dirVec
            ];

            // Since js trigonometric functions use the radian system, here we need to convert the angle to radian.
            var stepRotates = [
                ( parseFloat( presentStep.dataset.rotateX ) || 0 ) * ( Math.PI / 180 ),
                ( parseFloat( presentStep.dataset.rotateY ) || 0 ) * ( Math.PI / 180 ),
                ( parseFloat( presentStep.dataset.rotateZ ) || 0 ) * ( Math.PI / 180 )
            ];
            const sin = Math.sin;
            const cos = Math.cos;

            const c1 = cos( stepRotates[ 0 ] / 2 );
            const c2 = cos( stepRotates[ 1 ] / 2 );
            const c3 = cos( stepRotates[ 2 ] / 2 );
            const s1 = sin( stepRotates[ 0 ] / 2 );
            const s2 = sin( stepRotates[ 1 ] / 2 );
            const s3 = sin( stepRotates[ 2 ] / 2 );

            // And here comes math.
            var rotateQuaternion;
            switch ( ( presentStep.dataset.rotateOrder || "xyz" ).toUpperCase() ) {
                case "XYZ":
                    rotateQuaternion = [
                        c1 * c2 * c3 - s1 * s2 * s3,
                        s1 * c2 * c3 + c1 * s2 * s3,
                        c1 * s2 * c3 - s1 * c2 * s3,
                        c1 * c2 * s3 + s1 * s2 * c3
                    ];
                    break;

                case "YXZ":
                    rotateQuaternion = [
                        c1 * c2 * c3 + s1 * s2 * s3,
                        s1 * c2 * c3 + c1 * s2 * s3,
                        c1 * s2 * c3 - s1 * c2 * s3,
                        c1 * c2 * s3 - s1 * s2 * c3
                    ];
                    break;

                case "ZXY":
                    rotateQuaternion = [
                        c1 * c2 * c3 - s1 * s2 * s3,
                        s1 * c2 * c3 - c1 * s2 * s3,
                        c1 * s2 * c3 + s1 * c2 * s3,
                        c1 * c2 * s3 + s1 * s2 * c3
                    ];
                    break;

                case "ZYX":
                    rotateQuaternion = [
                        c1 * c2 * c3 + s1 * s2 * s3,
                        s1 * c2 * c3 - c1 * s2 * s3,
                        c1 * s2 * c3 + s1 * c2 * s3,
                        c1 * c2 * s3 - s1 * s2 * c3
                    ];
                    break;

                case "YZX":
                    rotateQuaternion = [
                        c1 * c2 * c3 - s1 * s2 * s3,
                        s1 * c2 * c3 + c1 * s2 * s3,
                        c1 * s2 * c3 + s1 * c2 * s3,
                        c1 * c2 * s3 - s1 * s2 * c3
                    ];
                    break;

                case "XZY":
                    rotateQuaternion = [
                        c1 * c2 * c3 + s1 * s2 * s3,
                        s1 * c2 * c3 - c1 * s2 * s3,
                        c1 * s2 * c3 - s1 * c2 * s3,
                        c1 * c2 * s3 + s1 * s2 * c3
                    ];
                    break;
            }

            const rotateConjugate = [
                rotateQuaternion[ 0 ],
                rotateQuaternion[ 1 ] * -1,
                rotateQuaternion[ 2 ] * -1,
                rotateQuaternion[ 3 ] * -1
            ];

            return multiplyQuaternions( multiplyQuaternions( rotateQuaternion, vectorQuaternion ), rotateConjugate );
        }

        // All this plugin is built on top of the `impress().goto()` function, which "allows to edit step attributes
        // dynamically, such as change their coordinates, or even remove or add steps, and have that change apply
        // when goto() is called."
        //
        // What a wise decision!
        //
        // So `roamMove()` function here receives a direction vector which points the direction of required movement,
        // and apply changes to dataset of present step. Ready to update "canvas".
        function roamMove( ...direction ) {
            var vector = getVectorQuaternion( ...direction );
            presentStep.dataset.x = ( parseFloat( presentStep.dataset.x ) || 0 ) + vector[ 1 ] * 500 / spf;
            presentStep.dataset.y = ( parseFloat( presentStep.dataset.y ) || 0 ) + vector[ 2 ] * 500 / spf;
            presentStep.dataset.z = ( parseFloat( presentStep.dataset.z ) || 0 ) + vector[ 3 ] * 500 / spf;
        }

        // Respond every roam-controlling key one after another.
        Array.from( roams.keys ).forEach( ( key ) => {
            if ( roams[ key ].start === -1 ) {
                roams[ key ].start = timestamp;
            }
            switch ( key ) {
                // Moving part.
                case "w": // forward
                    roamMove( 0, 0, -1 );
                    break;
                case "s": // back
                    roamMove( 0, -0, 1 );
                    break;
                case "a": // left
                    roamMove( -1, 0, 0 );
                    break;
                case "d": // right
                    roamMove( 1, 0, 0 );
                    break;
                case "q": // up
                    roamMove( 0, -1, 0 );
                    break;
                case "e": // down
                    roamMove( 0, 1, 0 );
                    break;

                // Rotating part.
                case "i": // pitch-up
                    presentStep.dataset.rotateX = ( parseFloat( presentStep.dataset.rotateX ) || 0 ) + 30 / spf;
                    break;
                case "k": // pitch-down
                    presentStep.dataset.rotateX = ( parseFloat( presentStep.dataset.rotateX ) || 0 ) - 30 / spf;
                    break;
                case "j": // roll-left
                    presentStep.dataset.rotateZ = ( parseFloat( presentStep.dataset.rotateZ ) || 0 ) - 30 / spf;
                    break;
                case "l": // roll-right
                    presentStep.dataset.rotateZ = ( parseFloat( presentStep.dataset.rotateZ ) || 0 ) + 30 / spf;
                    break;
                case "u": // yaw-left
                    presentStep.dataset.rotateY = ( parseFloat( presentStep.dataset.rotateY ) || 0 ) + 30 / spf;
                    break;
                case "o": // yaw-right
                    presentStep.dataset.rotateY = ( parseFloat( presentStep.dataset.rotateY ) || 0 ) - 30 / spf;
                    break;
                default:
                    break;
            }
        } );

        // Everything's done.
        // Just leave the impress to update the "canvas" and we've finished the work for one frame!
        // As there no more frame between present one and the comming one, duration should be 0.
        api.goto( presentStep.id, 0 );
    }

    function eventHandler( event ) {
        if ( event.type === "keydown" && roamKeys.includes( event.key ) && !roams.keys.includes( event.key ) ) {
            roams[ event.key ].start = -1;
            roams.keys += event.key;
        } else if ( event.type === "keyup" && roams.keys.includes( event.key ) ) {
            roams.keys = roams.keys.replaceAll( event.key, "" );
        }
    }

    document.addEventListener( "impress:init", function() {
        // Update `api` and `gc` to current ones.
        api = window.impress();
        gc = api.lib.gc;

        // Stop requesting animation frame when `impress().tear()` is called.
        api.tear = new Proxy( api.tear, {
            apply ( target, thisArg, argumentsList ) {
                impressActive = false;
                target.apply( thisArg, argumentsList );
            }
        } );

        // Init `roams.keys` with `""`, which means no key's pressed down.
        roams.keys = "";
        Array.from( roamKeys ).forEach( ( key ) => {
            roams[ key ] = {
                start: undefined
            };
        } );

        // Make the keys controlling.
        gc.addEventListener( document, "keydown", eventHandler );
        gc.addEventListener( document, "keyup", eventHandler );

        impressActive = true;

        // Request to be called before next frame renders.
        // And every single frame after is going to be called in the `roamAnimationFrame()` function.
        window.requestAnimationFrame( roamAnimationFrame );
    } );
} )( document, window );
