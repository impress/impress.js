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

        // `pushCallback` If the above utilities are not enough, plugins can add their own callback
        // function to do arbitrary things.
        var pushCallback = function( callback ) {
            callbackList.push( callback );
        };
        pushCallback( function( rootId ) { resetStartingState( rootId ); } );

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
            pushCallback: pushCallback,
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
