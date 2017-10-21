/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.6.0
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
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
        var rX = " rotateX(" + r.x + "deg) ",
            rY = " rotateY(" + r.y + "deg) ",
            rZ = " rotateZ(" + r.z + "deg) ";

        return revert ? rZ + rY + rX : rX + rY + rZ;
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
        var onStepEnter = function( step ) {
            if ( lastEntered !== step ) {
                lib.util.triggerEvent( step, "impress:stepenter" );
                lastEntered = step;
            }
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
                        z: lib.util.toNumber( data.rotateZ || data.rotate )
                    },
                    scale: lib.util.toNumber( data.scale, 1 ),
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
                rotate:    { x: 0, y: 0, z: 0 },
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
                    z: -step.rotate.z
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

/**
 * Garbage collection utility
 *
 * This library allows plugins to add elements and event listeners they add to the DOM. The user
 * can call `impress().lib.gc.teardown()` to cause all of them to be removed from DOM, so that
 * the document is in the state it was before calling `impress().init()`.
 *
 * In addition to just adding elements and event listeners to the garbage collector, plugins
 * can also register callback functions to do arbitrary cleanup upon teardown.
 *
 * Henrik Ingo (c) 2016
 * MIT License
 */

( function( document, window ) {
    "use strict";
    var roots = [];
    var rootsCount = 0;
    var startingState = { roots: [] };

    var libraryFactory = function( rootId ) {
        if ( roots[ rootId ] ) {
            return roots[ rootId ];
        }

        // Per root global variables (instance variables?)
        var elementList = [];
        var eventListenerList = [];
        var callbackList = [];

        recordStartingState( rootId );

        // LIBRARY FUNCTIONS
        // Definitions of the library functions we return as an object at the end

        // `pushElement` adds a DOM element to the gc stack
        var pushElement = function( element ) {
            elementList.push( element );
        };

        // `appendChild` is a convenience wrapper that combines DOM appendChild with gc.pushElement
        var appendChild = function( parent, element ) {
            parent.appendChild( element );
            pushElement( element );
        };

        // `pushEventListener` adds an event listener to the gc stack
        var pushEventListener = function( target, type, listenerFunction ) {
            eventListenerList.push( { target:target, type:type, listener:listenerFunction } );
        };

        // `addEventListener` combines DOM addEventListener with gc.pushEventListener
        var addEventListener = function( target, type, listenerFunction ) {
            target.addEventListener( type, listenerFunction );
            pushEventListener( target, type, listenerFunction );
        };

        // `addCallback` If the above utilities are not enough, plugins can add their own callback
        // function to do arbitrary things.
        var addCallback = function( callback ) {
            callbackList.push( callback );
        };
        addCallback( function( rootId ) { resetStartingState( rootId ); } );

        // `teardown` will
        // - execute all callbacks in LIFO order
        // - call `removeChild` on all DOM elements in LIFO order
        // - call `removeEventListener` on all event listeners in LIFO order
        // The goal of a teardown is to return to the same state that the DOM was before
        // `impress().init()` was called.
        var teardown = function() {

            // Execute the callbacks in LIFO order
            var i; // Needed by jshint
            for ( i = callbackList.length - 1; i >= 0; i-- ) {
                callbackList[ i ]( rootId );
            }
            callbackList = [];
            for ( i = 0; i < elementList.length; i++ ) {
                elementList[ i ].parentElement.removeChild( elementList[ i ] );
            }
            elementList = [];
            for ( i = 0; i < eventListenerList.length; i++ ) {
                var target   = eventListenerList[ i ].target;
                var type     = eventListenerList[ i ].type;
                var listener = eventListenerList[ i ].listener;
                target.removeEventListener( type, listener );
            }
        };

        var lib = {
            pushElement: pushElement,
            appendChild: appendChild,
            pushEventListener: pushEventListener,
            addEventListener: addEventListener,
            addCallback: addCallback,
            teardown: teardown
        };
        roots[ rootId ] = lib;
        rootsCount++;
        return lib;
    };

    // Let impress core know about the existence of this library
    window.impress.addLibraryFactory( { gc: libraryFactory } );

    // CORE INIT
    // The library factory (gc(rootId)) is called at the beginning of impress(rootId).init()
    // For the purposes of teardown(), we can use this as an opportunity to save the state
    // of a few things in the DOM in their virgin state, before impress().init() did anything.
    // Note: These could also be recorded by the code in impress.js core as these values
    // are changed, but in an effort to not deviate too much from upstream, I'm adding
    // them here rather than the core itself.
    var recordStartingState = function( rootId ) {
        startingState.roots[ rootId ] = {};
        startingState.roots[ rootId ].steps = [];

        // Record whether the steps have an id or not
        var steps = document.getElementById( rootId ).querySelectorAll( ".step" );
        for ( var i = 0; i < steps.length; i++ ) {
            var el = steps[ i ];
            startingState.roots[ rootId ].steps.push( {
                el: el,
                id: el.getAttribute( "id" )
            } );
        }

        // In the rare case of multiple roots, the following is changed on first init() and
        // reset at last tear().
        if ( rootsCount === 0 ) {
            startingState.body = {};

            // It is customary for authors to set body.class="impress-not-supported" as a starting
            // value, which can then be removed by impress().init(). But it is not required.
            // Remember whether it was there or not.
            if ( document.body.classList.contains( "impress-not-supported" ) ) {
                startingState.body.impressNotSupported = true;
            } else {
                startingState.body.impressNotSupported = false;
            }

            // If there's a <meta name="viewport"> element, its contents will be overwritten by init
            var metas = document.head.querySelectorAll( "meta" );
            for ( i = 0; i < metas.length; i++ ) {
                var m = metas[ i ];
                if ( m.name === "viewport" ) {
                    startingState.meta = m.content;
                }
            }
        }
    };

    // CORE TEARDOWN
    var resetStartingState = function( rootId ) {

        // Reset body element
        document.body.classList.remove( "impress-enabled" );
        document.body.classList.remove( "impress-disabled" );

        var root = document.getElementById( rootId );
        var activeId = root.querySelector( ".active" ).id;
        document.body.classList.remove( "impress-on-" + activeId );

        document.documentElement.style.height = "";
        document.body.style.height = "";
        document.body.style.overflow = "";

        // Remove style values from the root and step elements
        // Note: We remove the ones set by impress.js core. Otoh, we didn't preserve any original
        // values. A more sophisticated implementation could keep track of original values and then
        // reset those.
        var steps = root.querySelectorAll( ".step" );
        for ( var i = 0; i < steps.length; i++ ) {
            steps[ i ].classList.remove( "future" );
            steps[ i ].classList.remove( "past" );
            steps[ i ].classList.remove( "present" );
            steps[ i ].classList.remove( "active" );
            steps[ i ].style.position = "";
            steps[ i ].style.transform = "";
            steps[ i ].style[ "transform-style" ] = "";
        }
        root.style.position = "";
        root.style[ "transform-origin" ] = "";
        root.style.transition = "";
        root.style[ "transform-style" ] = "";
        root.style.top = "";
        root.style.left = "";
        root.style.transform = "";

        // Reset id of steps ("step-1" id's are auto generated)
        steps = startingState.roots[ rootId ].steps;
        var step;
        while ( step = steps.pop() ) {
            if ( step.id === null ) {
                step.el.removeAttribute( "id" );
            } else {
                step.el.setAttribute( "id", step.id );
            }
        }
        delete startingState.roots[ rootId ];

        // Move step div elements away from canvas, then delete canvas
        // Note: There's an implicit assumption here that the canvas div is the only child element
        // of the root div. If there would be something else, it's gonna be lost.
        var canvas = root.firstChild;
        var canvasHTML = canvas.innerHTML;
        root.innerHTML = canvasHTML;

        if ( roots[ rootId ] !== undefined ) {
            delete roots[ rootId ];
            rootsCount--;
        }
        if ( rootsCount === 0 ) {

            // In the rare case that more than one impress root elements were initialized, these
            // are only reset when all are uninitialized.
            document.body.classList.remove( "impress-supported" );
            if ( startingState.body.impressNotSupported ) {
                document.body.classList.add( "impress-not-supported" );
            }

            // We need to remove or reset the meta element inserted by impress.js
            var metas = document.head.querySelectorAll( "meta" );
            for ( i = 0; i < metas.length; i++ ) {
                var m = metas[ i ];
                if ( m.name === "viewport" ) {
                    if ( startingState.meta !== undefined ) {
                        m.content = startingState.meta;
                    } else {
                        m.parentElement.removeChild( m );
                    }
                }
            }
        }

    };

} )( document, window );

/**
 * Common utility functions
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 * Henrik Ingo (c) 2016
 * MIT License
 */

( function( document, window ) {
    "use strict";
    var roots = [];

    var libraryFactory = function( rootId ) {
        if ( roots[ rootId ] ) {
            return roots[ rootId ];
        }

        // `$` returns first element for given CSS `selector` in the `context` of
        // the given element or whole document.
        var $ = function( selector, context ) {
            context = context || document;
            return context.querySelector( selector );
        };

        // `$$` return an array of elements for given CSS `selector` in the `context` of
        // the given element or whole document.
        var $$ = function( selector, context ) {
            context = context || document;
            return arrayify( context.querySelectorAll( selector ) );
        };

        // `arrayify` takes an array-like object and turns it into real Array
        // to make all the Array.prototype goodness available.
        var arrayify = function( a ) {
            return [].slice.call( a );
        };

        // `byId` returns element with given `id` - you probably have guessed that ;)
        var byId = function( id ) {
            return document.getElementById( id );
        };

        // `getElementFromHash` returns an element located by id from hash part of
        // window location.
        var getElementFromHash = function() {

            // Get id from url # by removing `#` or `#/` from the beginning,
            // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
            return byId( window.location.hash.replace( /^#\/?/, "" ) );
        };

        // Throttling function calls, by Remy Sharp
        // http://remysharp.com/2010/07/21/throttling-function-calls/
        var throttle = function( fn, delay ) {
            var timer = null;
            return function() {
                var context = this, args = arguments;
                window.clearTimeout( timer );
                timer = window.setTimeout( function() {
                    fn.apply( context, args );
                }, delay );
            };
        };

        // `toNumber` takes a value given as `numeric` parameter and tries to turn
        // it into a number. If it is not possible it returns 0 (or other value
        // given as `fallback`).
        var toNumber = function( numeric, fallback ) {
            return isNaN( numeric ) ? ( fallback || 0 ) : Number( numeric );
        };

        // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
        // and triggers it on element given as `el`.
        var triggerEvent = function( el, eventName, detail ) {
            var event = document.createEvent( "CustomEvent" );
            event.initCustomEvent( eventName, true, true, detail );
            el.dispatchEvent( event );
        };

        var lib = {
            $: $,
            $$: $$,
            arrayify: arrayify,
            byId: byId,
            getElementFromHash: getElementFromHash,
            throttle: throttle,
            toNumber: toNumber,
            triggerEvent: triggerEvent
        };
        roots[ rootId ] = lib;
        return lib;
    };

    // Let impress core know about the existence of this library
    window.impress.addLibraryFactory( { util: libraryFactory } );

} )( document, window );

/**
 * Goto Plugin
 *
 * The goto plugin is a pre-stepleave plugin. It is executed before impress:stepleave,
 * and will alter the destination where to transition next.
 *
 * Example:
 *
 *         <!-- When leaving this step, go directly to "step-5" -->
 *         <div class="step" data-goto="step-5">
 *
 *         <!-- When leaving this step with next(), go directly to "step-5", instead of next step.
 *              If moving backwards to previous step - e.g. prev() instead of next() -
 *              then go to "step-1". -->
 *         <div class="step" data-goto-next="step-5" data-goto-prev="step-1">
 *
 *        <!-- data-goto-key-list and data-goto-next-list allow you to build advanced non-linear
 *             navigation. -->
 *        <div class="step"
 *             data-goto-key-list="ArrowUp ArrowDown ArrowRight ArrowLeft"
 *             data-goto-next-list="step-4 step-3 step-2 step-5">
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for a table
 * of what strings to use for each key.
 *
 * Copyright 2016-2017 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
/* global window, document, impress */

( function( document, window ) {
    "use strict";
    var lib;

    var isNumber = function( numeric ) {
        return !isNaN( numeric );
    };

    var goto = function( event ) {
        if ( ( !event ) || ( !event.target ) ) {
            return;
        }

        var data = event.target.dataset;
        var steps = document.querySelectorAll( ".step" );

        // Data-goto-key-list="" & data-goto-next-list="" //////////////////////////////////////////
        if ( data.gotoKeyList !== undefined &&
             data.gotoNextList !== undefined &&
             event.origEvent !== undefined &&
             event.origEvent.key !== undefined ) {
            var keylist = data.gotoKeyList.split( " " );
            var nextlist = data.gotoNextList.split( " " );

            if ( keylist.length !== nextlist.length ) {
                window.console.log(
                    "impress goto plugin: data-goto-key-list and data-goto-next-list don't match:"
                );
                window.console.log( keylist );
                window.console.log( nextlist );

                // Don't return, allow the other categories to work despite this error
            } else {
                var index = keylist.indexOf( event.origEvent.key );
                if ( index >= 0 ) {
                    var next = nextlist[ index ];
                    if ( isNumber( next ) ) {
                        event.detail.next = steps[ next ];

                        // If the new next element has its own transitionDuration, we're responsible
                        // for setting that on the event as well
                        event.detail.transitionDuration = lib.util.toNumber(
                            event.detail.next.dataset.transitionDuration,
                            event.detail.transitionDuration
                        );
                        return;
                    } else {
                        var newTarget = document.getElementById( next );
                        if ( newTarget && newTarget.classList.contains( "step" ) ) {
                            event.detail.next = newTarget;
                            event.detail.transitionDuration = lib.util.toNumber(
                                event.detail.next.dataset.transitionDuration,
                                event.detail.transitionDuration
                            );
                            return;
                        } else {
                            window.console.log( "impress goto plugin: " + next +
                                                " is not a step in this impress presentation." );
                        }
                    }
                }
            }
        }

        // Data-goto-next="" & data-goto-prev="" ///////////////////////////////////////////////////

        // Handle event.target data-goto-next attribute
        if ( isNumber( data.gotoNext ) && event.detail.reason === "next" ) {
            event.detail.next = steps[ data.gotoNext ];

            // If the new next element has its own transitionDuration, we're responsible for setting
            // that on the event as well
            event.detail.transitionDuration = lib.util.toNumber(
                event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
            );
            return;
        }
        if ( data.gotoNext && event.detail.reason === "next" ) {
            var newTarget = document.getElementById( data.gotoNext ); // jshint ignore:line
            if ( newTarget && newTarget.classList.contains( "step" ) ) {
                event.detail.next = newTarget;
                event.detail.transitionDuration = lib.util.toNumber(
                    event.detail.next.dataset.transitionDuration,
                    event.detail.transitionDuration
                );
                return;
            } else {
                window.console.log( "impress goto plugin: " + data.gotoNext +
                                    " is not a step in this impress presentation." );
            }
        }

        // Handle event.target data-goto-prev attribute
        if ( isNumber( data.gotoPrev ) && event.detail.reason === "prev" ) {
            event.detail.next = steps[ data.gotoPrev ];
            event.detail.transitionDuration = lib.util.toNumber(
                event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
            );
            return;
        }
        if ( data.gotoPrev && event.detail.reason === "prev" ) {
            var newTarget = document.getElementById( data.gotoPrev ); // jshint ignore:line
            if ( newTarget && newTarget.classList.contains( "step" ) ) {
                event.detail.next = newTarget;
                event.detail.transitionDuration = lib.util.toNumber(
                    event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
                );
                return;
            } else {
                window.console.log( "impress goto plugin: " + data.gotoPrev +
                                    " is not a step in this impress presentation." );
            }
        }

        // Data-goto="" ///////////////////////////////////////////////////////////////////////////

        // Handle event.target data-goto attribute
        if ( isNumber( data.goto ) ) {
            event.detail.next = steps[ data.goto ];
            event.detail.transitionDuration = lib.util.toNumber(
                event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
            );
            return;
        }
        if ( data.goto ) {
            var newTarget = document.getElementById( data.goto ); // jshint ignore:line
            if ( newTarget && newTarget.classList.contains( "step" ) ) {
                event.detail.next = newTarget;
                event.detail.transitionDuration = lib.util.toNumber(
                    event.detail.next.dataset.transitionDuration, event.detail.transitionDuration
                );
                return;
            } else {
                window.console.log( "impress goto plugin: " + data.goto +
                                    " is not a step in this impress presentation." );
            }
        }
    };

    // Register the plugin to be called in pre-stepleave phase
    impress.addPreStepLeavePlugin( goto );

} )( document, window );


/**
 * Mobile devices support
 *
 * Allow presentation creators to hide all but 3 slides, to save resources, particularly on mobile
 * devices, using classes body.impress-mobile, .step.prev, .step.active and .step.next.
 *
 * Note: This plugin does not take into account possible redirections done with skip, goto etc
 * plugins. Basically it wouldn't work as intended in such cases, but the active step will at least
 * be correct.
 *
 * Adapted to a plugin from a submission by @Kzeni:
 * https://github.com/impress/impress.js/issues/333
 */
/* global document, navigator */
( function( document ) {
    "use strict";

    var getNextStep = function( el ) {
        var steps = document.querySelectorAll( ".step" );
        for ( var i = 0; i < steps.length; i++ ) {
            if ( steps[ i ] === el ) {
                if ( i + 1 < steps.length ) {
                    return steps[ i + 1 ];
                } else {
                    return steps[ 0 ];
                }
            }
        }
    };
    var getPrevStep = function( el ) {
        var steps = document.querySelectorAll( ".step" );
        for ( var i = steps.length - 1; i >= 0; i-- ) {
            if ( steps[ i ] === el ) {
                if ( i - 1 >= 0 ) {
                    return steps[ i - 1 ];
                } else {
                    return steps[ steps.length - 1 ];
                }
            }
        }
    };

    // Detect mobile browsers & add CSS class as appropriate.
    document.addEventListener( "impress:init", function( event ) {
        var body = document.body;
        if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                 navigator.userAgent
             ) ) {
            body.classList.add( "impress-mobile" );
        }

        // Unset all this on teardown
        var api = event.detail.api;
        api.lib.gc.addCallback( function() {
            document.body.classList.remove( "impress-mobile" );
            var prev = document.getElementsByClassName( "prev" )[ 0 ];
            var next = document.getElementsByClassName( "next" )[ 0 ];
            if ( typeof prev !== "undefined" ) {
                prev.classList.remove( "prev" );
            }
            if ( typeof next !== "undefined" ) {
                next.classList.remove( "next" );
            }
        } );
    } );

    // Add prev and next classes to the siblings of the newly entered active step element
    // Remove prev and next classes from their current step elements
    // Note: As an exception we break namespacing rules, as these are useful general purpose
    // classes. (Naming rules would require us to use css classes mobile-next and mobile-prev,
    // based on plugin name.)
    document.addEventListener( "impress:stepenter", function( event ) {
	      var oldprev = document.getElementsByClassName( "prev" )[ 0 ];
	      var oldnext = document.getElementsByClassName( "next" )[ 0 ];

	      var prev = getPrevStep( event.target );
	      prev.classList.add( "prev" );
	      var next = getNextStep( event.target );
	      next.classList.add( "next" );

	      if ( typeof oldprev !== "undefined" ) {
		      oldprev.classList.remove( "prev" );
              }
	      if ( typeof oldnext !== "undefined" ) {
		      oldnext.classList.remove( "next" );
              }
    } );
} )( document );


/**
 * Navigation events plugin
 *
 * As you can see this part is separate from the impress.js core code.
 * It's because these navigation actions only need what impress.js provides with
 * its simple API.
 *
 * This plugin is what we call an _init plugin_. It's a simple kind of
 * impress.js plugin. When loaded, it starts listening to the `impress:init`
 * event. That event listener initializes the plugin functionality - in this
 * case we listen to some keypress and mouse events. The only dependencies on
 * core impress.js functionality is the `impress:init` method, as well as using
 * the public api `next(), prev(),` etc when keys are pressed.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 * Released under the MIT license.
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.5.3
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 *
 */
/* global document */
( function( document ) {
    "use strict";

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {

        // Getting API from event data.
        // So you don't event need to know what is the id of the root element
        // or anything. `impress:init` event data gives you everything you
        // need to control the presentation that was just initialized.
        var api = event.detail.api;
        var gc = api.lib.gc;
        var util = api.lib.util;

        // Supported keys are:
        // [space] - quite common in presentation software to move forward
        // [up] [right] / [down] [left] - again common and natural addition,
        // [pgdown] / [pgup] - often triggered by remote controllers,
        // [tab] - this one is quite controversial, but the reason it ended up on
        //   this list is quite an interesting story... Remember that strange part
        //   in the impress.js code where window is scrolled to 0,0 on every presentation
        //   step, because sometimes browser scrolls viewport because of the focused element?
        //   Well, the [tab] key by default navigates around focusable elements, so clicking
        //   it very often caused scrolling to focused element and breaking impress.js
        //   positioning. I didn't want to just prevent this default action, so I used [tab]
        //   as another way to moving to next step... And yes, I know that for the sake of
        //   consistency I should add [shift+tab] as opposite action...
        var isNavigationEvent = function( event ) {

            // Don't trigger navigation for example when user returns to browser window with ALT+TAB
            if ( event.altKey || event.ctrlKey || event.metaKey ) {
                return false;
            }

            // In the case of TAB, we force step navigation always, overriding the browser
            // navigation between input elements, buttons and links.
            if ( event.keyCode === 9 ) {
                return true;
            }

            // With the sole exception of TAB, we also ignore keys pressed if shift is down.
            if ( event.shiftKey ) {
                return false;
            }

            // For arrows, etc, check that event target is html or body element. This is to allow
            // presentations to have, for example, forms with input elements where user can type
            // text, including space, and not move to next step.
            if ( event.target.nodeName !== "BODY" && event.target.nodeName !== "HTML" ) {
                return false;
            }

            if ( ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
                 ( event.keyCode >= 37 && event.keyCode <= 40 ) ) {
                return true;
            }
        };

        // KEYBOARD NAVIGATION HANDLERS

        // Prevent default keydown action when one of supported key is pressed.
        gc.addEventListener( document, "keydown", function( event ) {
            if ( isNavigationEvent( event ) ) {
                event.preventDefault();
            }
        }, false );

        // Trigger impress action (next or prev) on keyup.
        gc.addEventListener( document, "keyup", function( event ) {
            if ( isNavigationEvent( event ) ) {
                if ( event.shiftKey ) {
                    switch ( event.keyCode ) {
                        case 9: // Shift+tab
                            api.prev();
                            break;
                    }
                } else {
                    switch ( event.keyCode ) {
                        case 33: // Pg up
                        case 37: // Left
                        case 38: // Up
                                 api.prev( event );
                                 break;
                        case 9:  // Tab
                        case 32: // Space
                        case 34: // Pg down
                        case 39: // Right
                        case 40: // Down
                                 api.next( event );
                                 break;
                    }
                }
                event.preventDefault();
            }
        }, false );

        // Delegated handler for clicking on the links to presentation steps
        gc.addEventListener( document, "click", function( event ) {

            // Event delegation with "bubbling"
            // check if event target (or any of its parents is a link)
            var target = event.target;
            while ( ( target.tagName !== "A" ) &&
                    ( target !== document.documentElement ) ) {
                target = target.parentNode;
            }

            if ( target.tagName === "A" ) {
                var href = target.getAttribute( "href" );

                // If it's a link to presentation step, target this step
                if ( href && href[ 0 ] === "#" ) {
                    target = document.getElementById( href.slice( 1 ) );
                }
            }

            if ( api.goto( target ) ) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }, false );

        // Delegated handler for clicking on step elements
        gc.addEventListener( document, "click", function( event ) {
            var target = event.target;

            // Find closest step element that is not active
            while ( !( target.classList.contains( "step" ) &&
                       !target.classList.contains( "active" ) ) &&
                    ( target !== document.documentElement ) ) {
                target = target.parentNode;
            }

            if ( api.goto( target ) ) {
                event.preventDefault();
            }
        }, false );

        // Add a line to the help popup
        util.triggerEvent( document, "impress:help:add", { command: "Left &amp; Right",
                                                           text: "Previous &amp; Next step",
                                                           row: 1 } );

    }, false );

} )( document );


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
                z: el.getAttribute( "data-z" )
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
        event.detail.api.lib.gc.addCallback( function() {
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
            }
            delete startingState[ root.id ];
        } );
    }, false );
} )( document, window );


/**
 * Resize plugin
 *
 * Rescale the presentation after a window resize.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 * Released under the MIT license.
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.5.3
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 *
 */

/* global document, window */

( function( document, window ) {
    "use strict";

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {
        var api = event.detail.api;

        // Rescale presentation when window is resized
        api.lib.gc.addEventListener( window, "resize", api.lib.util.throttle( function() {

            // Force going to active step again, to trigger rescaling
            api.goto( document.querySelector( ".step.active" ), 500 );
        }, 250 ), false );
    }, false );

} )( document, window );


/**
 * Stop Plugin
 *
 * Example:
 *
 *        <!-- Stop at this slide.
 *             (For example, when used on the last slide, this prevents the
 *             presentation from wrapping back to the beginning.) -->
 *        <div class="step stop">
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
/* global document, window */
( function( document, window ) {
    "use strict";

    var stop = function( event ) {
        if ( ( !event ) || ( !event.target ) ) {
            return;
        }

        if ( event.target.classList.contains( "stop" ) ) {
            if ( event.detail.reason === "next" ) {
                return false;
            }
        }
    };

    // Register the plugin to be called in pre-stepleave phase
    // The weight makes this plugin run fairly early.
    window.impress.addPreStepLeavePlugin( stop, 2 );

} )( document, window );


/**
 * Support for swipe and tap on touch devices
 *
 * This plugin implements navigation for plugin devices, via swiping left/right,
 * or tapping on the left/right edges of the screen.
 *
 *
 *
 * Copyright 2015: Andrew Dunai (@and3rson)
 * Modified to a plugin, 2016: Henrik Ingo (@henrikingo)
 *
 * MIT License
 */
/* global document, window */
( function( document, window ) {
    "use strict";

    // Touch handler to detect swiping left and right based on window size.
    // If the difference in X change is bigger than 1/20 of the screen width,
    // we simply call an appropriate API function to complete the transition.
    var startX = 0;
    var lastX = 0;
    var lastDX = 0;
    var threshold = window.innerWidth / 20;

    document.addEventListener( "touchstart", function( event ) {
        lastX = startX = event.touches[ 0 ].clientX;
    } );

    document.addEventListener( "touchmove", function( event ) {
         var x = event.touches[ 0 ].clientX;
         var diff = x - startX;

         // To be used in touchend
         lastDX = lastX - x;
         lastX = x;

         window.impress().swipe( diff / window.innerWidth );
     } );

     document.addEventListener( "touchend", function() {
         var totalDiff = lastX - startX;
         if ( Math.abs( totalDiff ) > window.innerWidth / 5 && ( totalDiff * lastDX ) <= 0 ) {
             if ( totalDiff > window.innerWidth / 5 && lastDX <= 0 ) {
                 window.impress().prev();
             } else if ( totalDiff < -window.innerWidth / 5 && lastDX >= 0 ) {
                 window.impress().next();
             }
         } else if ( Math.abs( lastDX ) > threshold ) {
             if ( lastDX < -threshold ) {
                 window.impress().prev();
             } else if ( lastDX > threshold ) {
                 window.impress().next();
             }
         } else {

             // No movement - move (back) to the current slide
             window.impress().goto( document.querySelector( "#impress .step.active" ) );
         }
     } );

     document.addEventListener( "touchcancel", function() {

             // Move (back) to the current slide
             window.impress().goto( document.querySelector( "#impress .step.active" ) );
     } );

} )( document, window );
