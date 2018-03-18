/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz), 2016-2018 Henrik Ingo (@henrikingo)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Bartek Szopka, Henrik Ingo
 *  version: 1.0.0
 *  url:     http://impress.js.org
 *  source:  http://github.com/impress/impress.js/
 */

// You are one of those who like to know how things work inside?
// Let me show you the cogs that make impress.js run...
( function( document, window ) {
    "use strict";
    var lib;

    // HELPER FUNCTIONS

    // `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
    var pfx = ( function() {

        var style = document.createElement( "dummy" ).style,
            prefixes = "Webkit Moz O ms Khtml".split( " " ),
            memory = {};

        return function( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {

                var ucProp  = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
                    props   = ( prop + " " + prefixes.join( ucProp + " " ) + ucProp ).split( " " );

                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[ i ] ] !== undefined ) {
                        memory[ prop ] = props[ i ];
                        break;
                    }
                }

            }

            return memory[ prop ];
        };

    } )();

    var validateOrder = function( order, fallback ) {
        var validChars = "xyz";
        var returnStr = "";
        if ( typeof order === "string" ) {
            for ( var i in order.split( "" ) ) {
                if ( validChars.indexOf( order[ i ] ) >= 0 ) {
                    returnStr += order[ i ];

                    // Each of x,y,z can be used only once.
                    validChars = validChars.split( order[ i ] ).join( "" );
                }
            }
        }
        if ( returnStr ) {
            return returnStr;
        } else if ( fallback !== undefined ) {
            return fallback;
        } else {
            return "xyz";
        }
    };

    // `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
    var css = function( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty( key ) ) {
                pkey = pfx( key );
                if ( pkey !== null ) {
                    el.style[ pkey ] = props[ key ];
                }
            }
        }
        return el;
    };

    // `translate` builds a translate transform string for given data.
    var translate = function( t ) {
        return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
    };

    // `rotate` builds a rotate transform string for given data.
    // By default the rotations are in X Y Z order that can be reverted by passing `true`
    // as second parameter.
    var rotate = function( r, revert ) {
        var order = r.order ? r.order : "xyz";
        var css = "";
        var axes = order.split( "" );
        if ( revert ) {
            axes = axes.reverse();
        }

        for ( var i = 0; i < axes.length; i++ ) {
            css += " rotate" + axes[ i ].toUpperCase() + "(" + r[ axes[ i ] ] + "deg)";
        }
        return css;
    };

    // `scale` builds a scale transform string for given data.
    var scale = function( s ) {
        return " scale(" + s + ") ";
    };

    // `computeWindowScale` counts the scale factor between window size and size
    // defined for the presentation in the config.
    var computeWindowScale = function( config ) {
        var hScale = window.innerHeight / config.height,
            wScale = window.innerWidth / config.width,
            scale = hScale > wScale ? wScale : hScale;

        if ( config.maxScale && scale > config.maxScale ) {
            scale = config.maxScale;
        }

        if ( config.minScale && scale < config.minScale ) {
            scale = config.minScale;
        }

        return scale;
    };

    // CHECK SUPPORT
    var body = document.body;
    var impressSupported =

                          // Browser should support CSS 3D transtorms
                           ( pfx( "perspective" ) !== null ) &&

                          // And `classList` and `dataset` APIs
                           ( body.classList ) &&
                           ( body.dataset );

    if ( !impressSupported ) {

        // We can't be sure that `classList` is supported
        body.className += " impress-not-supported ";
    }

    // GLOBALS AND DEFAULTS

    // This is where the root elements of all impress.js instances will be kept.
    // Yes, this means you can have more than one instance on a page, but I'm not
    // sure if it makes any sense in practice ;)
    var roots = {};

    var preInitPlugins = [];
    var preStepLeavePlugins = [];

    // Some default config values.
    var defaults = {
        width: 1024,
        height: 768,
        maxScale: 1,
        minScale: 0,

        perspective: 1000,

        transitionDuration: 1000
    };

    // It's just an empty function ... and a useless comment.
    var empty = function() { return false; };

    // IMPRESS.JS API

    // And that's where interesting things will start to happen.
    // It's the core `impress` function that returns the impress.js API
    // for a presentation based on the element with given id ("impress"
    // by default).
    var impress = window.impress = function( rootId ) {

        // If impress.js is not supported by the browser return a dummy API
        // it may not be a perfect solution but we return early and avoid
        // running code that may use features not implemented in the browser.
        if ( !impressSupported ) {
            return {
                init: empty,
                goto: empty,
                prev: empty,
                next: empty,
                swipe: empty,
                tear: empty,
                lib: {}
            };
        }

        rootId = rootId || "impress";

        // If given root is already initialized just return the API
        if ( roots[ "impress-root-" + rootId ] ) {
            return roots[ "impress-root-" + rootId ];
        }

        // The gc library depends on being initialized before we do any changes to DOM.
        lib = initLibraries( rootId );

        body.classList.remove( "impress-not-supported" );
        body.classList.add( "impress-supported" );

        // Data of all presentation steps
        var stepsData = {};

        // Element of currently active step
        var activeStep = null;

        // Current state (position, rotation and scale) of the presentation
        var currentState = null;

        // Array of step elements
        var steps = null;

        // Configuration options
        var config = null;

        // Scale factor of the browser window
        var windowScale = null;

        // Root presentation elements
        var root = lib.util.byId( rootId );
        var canvas = document.createElement( "div" );

        var initialized = false;

        // STEP EVENTS
        //
        // There are currently two step events triggered by impress.js
        // `impress:stepenter` is triggered when the step is shown on the
        // screen (the transition from the previous one is finished) and
        // `impress:stepleave` is triggered when the step is left (the
        // transition to next step just starts).

        // Reference to last entered step
        var lastEntered = null;

        // `onStepEnter` is called whenever the step element is entered
        // but the event is triggered only if the step is different than
        // last entered step.
        // We sometimes call `goto`, and therefore `onStepEnter`, just to redraw a step, such as
        // after screen resize. In this case - more precisely, in any case - we trigger a
        // `impress:steprefresh` event.
        var onStepEnter = function( step ) {
            if ( lastEntered !== step ) {
                lib.util.triggerEvent( step, "impress:stepenter" );
                lastEntered = step;
            }
            lib.util.triggerEvent( step, "impress:steprefresh" );
        };

        // `onStepLeave` is called whenever the currentStep element is left
        // but the event is triggered only if the currentStep is the same as
        // lastEntered step.
        var onStepLeave = function( currentStep, nextStep ) {
            if ( lastEntered === currentStep ) {
                lib.util.triggerEvent( currentStep, "impress:stepleave", { next: nextStep } );
                lastEntered = null;
            }
        };

        // `initStep` initializes given step element by reading data from its
        // data attributes and setting correct styles.
        var initStep = function( el, idx ) {
            var data = el.dataset,
                step = {
                    translate: {
                        x: lib.util.toNumber( data.x ),
                        y: lib.util.toNumber( data.y ),
                        z: lib.util.toNumber( data.z )
                    },
                    rotate: {
                        x: lib.util.toNumber( data.rotateX ),
                        y: lib.util.toNumber( data.rotateY ),
                        z: lib.util.toNumber( data.rotateZ || data.rotate ),
                        order: validateOrder( data.rotateOrder )
                    },
                    scale: lib.util.toNumber( data.scale, 1 ),
                    transitionDuration: lib.util.toNumber(
                        data.transitionDuration, config.transitionDuration
                    ),
                    el: el
                };

            if ( !el.id ) {
                el.id = "step-" + ( idx + 1 );
            }

            stepsData[ "impress-" + el.id ] = step;

            css( el, {
                position: "absolute",
                transform: "translate(-50%,-50%)" +
                           translate( step.translate ) +
                           rotate( step.rotate ) +
                           scale( step.scale ),
                transformStyle: "preserve-3d"
            } );
        };

        // Initialize all steps.
        // Read the data-* attributes, store in internal stepsData, and render with CSS.
        var initAllSteps = function() {
            steps = lib.util.$$( ".step", root );
            steps.forEach( initStep );
        };

        // `init` API function that initializes (and runs) the presentation.
        var init = function() {
            if ( initialized ) { return; }
            execPreInitPlugins( root );

            // First we set up the viewport for mobile devices.
            // For some reason iPad goes nuts when it is not done properly.
            var meta = lib.util.$( "meta[name='viewport']" ) || document.createElement( "meta" );
            meta.content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no";
            if ( meta.parentNode !== document.head ) {
                meta.name = "viewport";
                document.head.appendChild( meta );
            }

            // Initialize configuration object
            var rootData = root.dataset;
            config = {
                width: lib.util.toNumber( rootData.width, defaults.width ),
                height: lib.util.toNumber( rootData.height, defaults.height ),
                maxScale: lib.util.toNumber( rootData.maxScale, defaults.maxScale ),
                minScale: lib.util.toNumber( rootData.minScale, defaults.minScale ),
                perspective: lib.util.toNumber( rootData.perspective, defaults.perspective ),
                transitionDuration: lib.util.toNumber(
                    rootData.transitionDuration, defaults.transitionDuration
                )
            };

            windowScale = computeWindowScale( config );

            // Wrap steps with "canvas" element
            lib.util.arrayify( root.childNodes ).forEach( function( el ) {
                canvas.appendChild( el );
            } );
            root.appendChild( canvas );

            // Set initial styles
            document.documentElement.style.height = "100%";

            css( body, {
                height: "100%",
                overflow: "hidden"
            } );

            var rootStyles = {
                position: "absolute",
                transformOrigin: "top left",
                transition: "all 0s ease-in-out",
                transformStyle: "preserve-3d"
            };

            css( root, rootStyles );
            css( root, {
                top: "50%",
                left: "50%",
                perspective: ( config.perspective / windowScale ) + "px",
                transform: scale( windowScale )
            } );
            css( canvas, rootStyles );

            body.classList.remove( "impress-disabled" );
            body.classList.add( "impress-enabled" );

            // Get and init steps
            initAllSteps();

            // Set a default initial state of the canvas
            currentState = {
                translate: { x: 0, y: 0, z: 0 },
                rotate:    { x: 0, y: 0, z: 0, order: "xyz" },
                scale:     1
            };

            initialized = true;

            lib.util.triggerEvent( root, "impress:init",
                                   { api: roots[ "impress-root-" + rootId ] } );
        };

        // `getStep` is a helper function that returns a step element defined by parameter.
        // If a number is given, step with index given by the number is returned, if a string
        // is given step element with such id is returned, if DOM element is given it is returned
        // if it is a correct step element.
        var getStep = function( step ) {
            if ( typeof step === "number" ) {
                step = step < 0 ? steps[ steps.length + step ] : steps[ step ];
            } else if ( typeof step === "string" ) {
                step = lib.util.byId( step );
            }
            return ( step && step.id && stepsData[ "impress-" + step.id ] ) ? step : null;
        };

        // Used to reset timeout for `impress:stepenter` event
        var stepEnterTimeout = null;

        // `goto` API function that moves to step given as `el` parameter (by index, id or element).
        // `duration` optionally given as second parameter, is the transition duration in css.
        // `reason` is the string "next", "prev" or "goto" (default) and will be made available to
        // preStepLeave plugins.
        // `origEvent` may contain event that caused the call to goto, such as a key press event
        var goto = function( el, duration, reason, origEvent ) {
            reason = reason || "goto";
            origEvent = origEvent || null;

            if ( !initialized ) {
                return false;
            }

            // Re-execute initAllSteps for each transition. This allows to edit step attributes
            // dynamically, such as change their coordinates, or even remove or add steps, and have
            // that change apply when goto() is called.
            initAllSteps();

            if ( !( el = getStep( el ) ) ) {
                return false;
            }

            // Sometimes it's possible to trigger focus on first link with some keyboard action.
            // Browser in such a case tries to scroll the page to make this element visible
            // (even that body overflow is set to hidden) and it breaks our careful positioning.
            //
            // So, as a lousy (and lazy) workaround we will make the page scroll back to the top
            // whenever slide is selected
            //
            // If you are reading this and know any better way to handle it, I'll be glad to hear
            // about it!
            window.scrollTo( 0, 0 );

            var step = stepsData[ "impress-" + el.id ];
            duration = ( duration !== undefined ? duration : step.transitionDuration );

            // If we are in fact moving to another step, start with executing the registered
            // preStepLeave plugins.
            if ( activeStep && activeStep !== el ) {
                var event = { target: activeStep, detail: {} };
                event.detail.next = el;
                event.detail.transitionDuration = duration;
                event.detail.reason = reason;
                if ( origEvent ) {
                    event.origEvent = origEvent;
                }

                if ( execPreStepLeavePlugins( event ) === false ) {

                    // PreStepLeave plugins are allowed to abort the transition altogether, by
                    // returning false.
                    // see stop and substep plugins for an example of doing just that
                    return false;
                }

                // Plugins are allowed to change the detail values
                el = event.detail.next;
                step = stepsData[ "impress-" + el.id ];
                duration = event.detail.transitionDuration;
            }

            if ( activeStep ) {
                activeStep.classList.remove( "active" );
                body.classList.remove( "impress-on-" + activeStep.id );
            }
            el.classList.add( "active" );

            body.classList.add( "impress-on-" + el.id );

            // Compute target state of the canvas based on given step
            var target = {
                rotate: {
                    x: -step.rotate.x,
                    y: -step.rotate.y,
                    z: -step.rotate.z,
                    order: step.rotate.order
                },
                translate: {
                    x: -step.translate.x,
                    y: -step.translate.y,
                    z: -step.translate.z
                },
                scale: 1 / step.scale
            };

            // Check if the transition is zooming in or not.
            //
            // This information is used to alter the transition style:
            // when we are zooming in - we start with move and rotate transition
            // and the scaling is delayed, but when we are zooming out we start
            // with scaling down and move and rotation are delayed.
            var zoomin = target.scale >= currentState.scale;

            duration = lib.util.toNumber( duration, config.transitionDuration );
            var delay = ( duration / 2 );

            // If the same step is re-selected, force computing window scaling,
            // because it is likely to be caused by window resize
            if ( el === activeStep ) {
                windowScale = computeWindowScale( config );
            }

            var targetScale = target.scale * windowScale;

            // Trigger leave of currently active element (if it's not the same step again)
            if ( activeStep && activeStep !== el ) {
                onStepLeave( activeStep, el );
            }

            // Now we alter transforms of `root` and `canvas` to trigger transitions.
            //
            // And here is why there are two elements: `root` and `canvas` - they are
            // being animated separately:
            // `root` is used for scaling and `canvas` for translate and rotations.
            // Transitions on them are triggered with different delays (to make
            // visually nice and "natural" looking transitions), so we need to know
            // that both of them are finished.
            css( root, {

                // To keep the perspective look similar for different scales
                // we need to "scale" the perspective, too
                // For IE 11 support we must specify perspective independent
                // of transform.
                perspective: ( config.perspective / targetScale ) + "px",
                transform: scale( targetScale ),
                transitionDuration: duration + "ms",
                transitionDelay: ( zoomin ? delay : 0 ) + "ms"
            } );

            css( canvas, {
                transform: rotate( target.rotate, true ) + translate( target.translate ),
                transitionDuration: duration + "ms",
                transitionDelay: ( zoomin ? 0 : delay ) + "ms"
            } );

            // Here is a tricky part...
            //
            // If there is no change in scale or no change in rotation and translation, it means
            // there was actually no delay - because there was no transition on `root` or `canvas`
            // elements. We want to trigger `impress:stepenter` event in the correct moment, so
            // here we compare the current and target values to check if delay should be taken into
            // account.
            //
            // I know that this `if` statement looks scary, but it's pretty simple when you know
            // what is going on - it's simply comparing all the values.
            if ( currentState.scale === target.scale ||
                ( currentState.rotate.x === target.rotate.x &&
                  currentState.rotate.y === target.rotate.y &&
                  currentState.rotate.z === target.rotate.z &&
                  currentState.translate.x === target.translate.x &&
                  currentState.translate.y === target.translate.y &&
                  currentState.translate.z === target.translate.z ) ) {
                delay = 0;
            }

            // Store current state
            currentState = target;
            activeStep = el;

            // And here is where we trigger `impress:stepenter` event.
            // We simply set up a timeout to fire it taking transition duration (and possible delay)
            // into account.
            //
            // I really wanted to make it in more elegant way. The `transitionend` event seemed to
            // be the best way to do it, but the fact that I'm using transitions on two separate
            // elements and that the `transitionend` event is only triggered when there was a
            // transition (change in the values) caused some bugs and made the code really
            // complicated, cause I had to handle all the conditions separately. And it still
            // needed a `setTimeout` fallback for the situations when there is no transition at all.
            // So I decided that I'd rather make the code simpler than use shiny new
            // `transitionend`.
            //
            // If you want learn something interesting and see how it was done with `transitionend`
            // go back to version 0.5.2 of impress.js:
            // http://github.com/bartaz/impress.js/blob/0.5.2/js/impress.js
            window.clearTimeout( stepEnterTimeout );
            stepEnterTimeout = window.setTimeout( function() {
                onStepEnter( activeStep );
            }, duration + delay );

            return el;
        };

        // `prev` API function goes to previous step (in document order)
        // `event` is optional, may contain the event that caused the need to call prev()
        var prev = function( origEvent ) {
            var prev = steps.indexOf( activeStep ) - 1;
            prev = prev >= 0 ? steps[ prev ] : steps[ steps.length - 1 ];

            return goto( prev, undefined, "prev", origEvent );
        };

        // `next` API function goes to next step (in document order)
        // `event` is optional, may contain the event that caused the need to call next()
        var next = function( origEvent ) {
            var next = steps.indexOf( activeStep ) + 1;
            next = next < steps.length ? steps[ next ] : steps[ 0 ];

            return goto( next, undefined, "next", origEvent );
        };

        // Swipe for touch devices by @and3rson.
        // Below we extend the api to control the animation between the currently
        // active step and a presumed next/prev step. See touch plugin for
        // an example of using this api.

        // Helper function
        var interpolate = function( a, b, k ) {
            return a + ( b - a ) * k;
        };

        // Animate a swipe.
        //
        // Pct is a value between -1.0 and +1.0, designating the current length
        // of the swipe.
        //
        // If pct is negative, swipe towards the next() step, if positive,
        // towards the prev() step.
        //
        // Note that pre-stepleave plugins such as goto can mess with what is a
        // next() and prev() step, so we need to trigger the pre-stepleave event
        // here, even if a swipe doesn't guarantee that the transition will
        // actually happen.
        //
        // Calling swipe(), with any value of pct, won't in itself cause a
        // transition to happen, this is just to animate the swipe. Once the
        // transition is committed - such as at a touchend event - caller is
        // responsible for also calling prev()/next() as appropriate.
        //
        // Note: For now, this function is made available to be used by the swipe plugin (which
        // is the UI counterpart to this). It is a semi-internal API and intentionally not
        // documented in DOCUMENTATION.md.
        var swipe = function( pct ) {
            if ( Math.abs( pct ) > 1 ) {
                return;
            }

            // Prepare & execute the preStepLeave event
            var event = { target: activeStep, detail: {} };
            event.detail.swipe = pct;

            // Will be ignored within swipe animation, but just in case a plugin wants to read this,
            // humor them
            event.detail.transitionDuration = config.transitionDuration;
            var idx; // Needed by jshint
            if ( pct < 0 ) {
                idx = steps.indexOf( activeStep ) + 1;
                event.detail.next = idx < steps.length ? steps[ idx ] : steps[ 0 ];
                event.detail.reason = "next";
            } else if ( pct > 0 ) {
                idx = steps.indexOf( activeStep ) - 1;
                event.detail.next = idx >= 0 ? steps[ idx ] : steps[ steps.length - 1 ];
                event.detail.reason = "prev";
            } else {

                // No move
                return;
            }
            if ( execPreStepLeavePlugins( event ) === false ) {

                // If a preStepLeave plugin wants to abort the transition, don't animate a swipe
                // For stop, this is probably ok. For substep, the plugin it self might want to do
                // some animation, but that's not the current implementation.
                return false;
            }
            var nextElement = event.detail.next;

            var nextStep = stepsData[ "impress-" + nextElement.id ];

            // If the same step is re-selected, force computing window scaling,
            var nextScale = nextStep.scale * windowScale;
            var k = Math.abs( pct );

            var interpolatedStep = {
                translate: {
                    x: interpolate( currentState.translate.x, -nextStep.translate.x, k ),
                    y: interpolate( currentState.translate.y, -nextStep.translate.y, k ),
                    z: interpolate( currentState.translate.z, -nextStep.translate.z, k )
                },
                rotate: {
                    x: interpolate( currentState.rotate.x, -nextStep.rotate.x, k ),
                    y: interpolate( currentState.rotate.y, -nextStep.rotate.y, k ),
                    z: interpolate( currentState.rotate.z, -nextStep.rotate.z, k ),

                    // Unfortunately there's a discontinuity if rotation order changes. Nothing I
                    // can do about it?
                    order: k < 0.7 ? currentState.rotate.order : nextStep.rotate.order
                },
                scale: interpolate( currentState.scale, nextScale, k )
            };

            css( root, {

                // To keep the perspective look similar for different scales
                // we need to 'scale' the perspective, too
                perspective: config.perspective / interpolatedStep.scale + "px",
                transform: scale( interpolatedStep.scale ),
                transitionDuration: "0ms",
                transitionDelay: "0ms"
            } );

            css( canvas, {
                transform: rotate( interpolatedStep.rotate, true ) +
                           translate( interpolatedStep.translate ),
                transitionDuration: "0ms",
                transitionDelay: "0ms"
            } );
        };

        // Teardown impress
        // Resets the DOM to the state it was before impress().init() was called.
        // (If you called impress(rootId).init() for multiple different rootId's, then you must
        // also call tear() once for each of them.)
        var tear = function() {
            lib.gc.teardown();
            delete roots[ "impress-root-" + rootId ];
        };

        // Adding some useful classes to step elements.
        //
        // All the steps that have not been shown yet are given `future` class.
        // When the step is entered the `future` class is removed and the `present`
        // class is given. When the step is left `present` class is replaced with
        // `past` class.
        //
        // So every step element is always in one of three possible states:
        // `future`, `present` and `past`.
        //
        // There classes can be used in CSS to style different types of steps.
        // For example the `present` class can be used to trigger some custom
        // animations when step is shown.
        lib.gc.addEventListener( root, "impress:init", function() {

            // STEP CLASSES
            steps.forEach( function( step ) {
                step.classList.add( "future" );
            } );

            lib.gc.addEventListener( root, "impress:stepenter", function( event ) {
                event.target.classList.remove( "past" );
                event.target.classList.remove( "future" );
                event.target.classList.add( "present" );
            }, false );

            lib.gc.addEventListener( root, "impress:stepleave", function( event ) {
                event.target.classList.remove( "present" );
                event.target.classList.add( "past" );
            }, false );

        }, false );

        // Adding hash change support.
        lib.gc.addEventListener( root, "impress:init", function() {

            // Last hash detected
            var lastHash = "";

            // `#/step-id` is used instead of `#step-id` to prevent default browser
            // scrolling to element in hash.
            //
            // And it has to be set after animation finishes, because in Chrome it
            // makes transtion laggy.
            // BUG: http://code.google.com/p/chromium/issues/detail?id=62820
            lib.gc.addEventListener( root, "impress:stepenter", function( event ) {
                window.location.hash = lastHash = "#/" + event.target.id;
            }, false );

            lib.gc.addEventListener( window, "hashchange", function() {

                // When the step is entered hash in the location is updated
                // (just few lines above from here), so the hash change is
                // triggered and we would call `goto` again on the same element.
                //
                // To avoid this we store last entered hash and compare.
                if ( window.location.hash !== lastHash ) {
                    goto( lib.util.getElementFromHash() );
                }
            }, false );

            // START
            // by selecting step defined in url or first step of the presentation
            goto( lib.util.getElementFromHash() || steps[ 0 ], 0 );
        }, false );

        body.classList.add( "impress-disabled" );

        // Store and return API for given impress.js root element
        return ( roots[ "impress-root-" + rootId ] = {
            init: init,
            goto: goto,
            next: next,
            prev: prev,
            swipe: swipe,
            tear: tear,
            lib: lib
        } );

    };

    // Flag that can be used in JS to check if browser have passed the support test
    impress.supported = impressSupported;

    // ADD and INIT LIBRARIES
    // Library factories are defined in src/lib/*.js, and register themselves by calling
    // impress.addLibraryFactory(libraryFactoryObject). They're stored here, and used to augment
    // the API with library functions when client calls impress(rootId).
    // See src/lib/README.md for clearer example.
    // (Advanced usage: For different values of rootId, a different instance of the libaries are
    // generated, in case they need to hold different state for different root elements.)
    var libraryFactories = {};
    impress.addLibraryFactory = function( obj ) {
        for ( var libname in obj ) {
            if ( obj.hasOwnProperty( libname ) ) {
                libraryFactories[ libname ] = obj[ libname ];
            }
        }
    };

    // Call each library factory, and return the lib object that is added to the api.
    var initLibraries = function( rootId ) { //jshint ignore:line
        var lib = {};
        for ( var libname in libraryFactories ) {
            if ( libraryFactories.hasOwnProperty( libname ) ) {
                if ( lib[ libname ] !== undefined ) {
                    throw "impress.js ERROR: Two libraries both tried to use libname: " +  libname;
                }
                lib[ libname ] = libraryFactories[ libname ]( rootId );
            }
        }
        return lib;
    };

    // `addPreInitPlugin` allows plugins to register a function that should
    // be run (synchronously) at the beginning of init, before
    // impress().init() itself executes.
    impress.addPreInitPlugin = function( plugin, weight ) {
        weight = parseInt( weight ) || 10;
        if ( weight <= 0 ) {
            throw "addPreInitPlugin: weight must be a positive integer";
        }

        if ( preInitPlugins[ weight ] === undefined ) {
            preInitPlugins[ weight ] = [];
        }
        preInitPlugins[ weight ].push( plugin );
    };

    // Called at beginning of init, to execute all pre-init plugins.
    var execPreInitPlugins = function( root ) { //jshint ignore:line
        for ( var i = 0; i < preInitPlugins.length; i++ ) {
            var thisLevel = preInitPlugins[ i ];
            if ( thisLevel !== undefined ) {
                for ( var j = 0; j < thisLevel.length; j++ ) {
                    thisLevel[ j ]( root );
                }
            }
        }
    };

    // `addPreStepLeavePlugin` allows plugins to register a function that should
    // be run (synchronously) at the beginning of goto()
    impress.addPreStepLeavePlugin = function( plugin, weight ) { //jshint ignore:line
        weight = parseInt( weight ) || 10;
        if ( weight <= 0 ) {
            throw "addPreStepLeavePlugin: weight must be a positive integer";
        }

        if ( preStepLeavePlugins[ weight ] === undefined ) {
            preStepLeavePlugins[ weight ] = [];
        }
        preStepLeavePlugins[ weight ].push( plugin );
    };

    // Called at beginning of goto(), to execute all preStepLeave plugins.
    var execPreStepLeavePlugins = function( event ) { //jshint ignore:line
        for ( var i = 0; i < preStepLeavePlugins.length; i++ ) {
            var thisLevel = preStepLeavePlugins[ i ];
            if ( thisLevel !== undefined ) {
                for ( var j = 0; j < thisLevel.length; j++ ) {
                    if ( thisLevel[ j ]( event ) === false ) {

                        // If a plugin returns false, the stepleave event (and related transition)
                        // is aborted
                        return false;
                    }
                }
            }
        }
    };

} )( document, window );

// THAT'S ALL FOLKS!
//
// Thanks for reading it all.
// Or thanks for scrolling down and reading the last part.
//
// I've learnt a lot when building impress.js and I hope this code and comments
// will help somebody learn at least some part of it.
