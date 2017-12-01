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
