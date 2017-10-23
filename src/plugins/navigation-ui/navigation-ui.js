/**
 * Navigation UI plugin
 *
 * This plugin provides UI elements "back", "forward" and a list to select
 * a specific slide number.
 *
 * The navigation controls are added to the toolbar plugin via DOM events. User must enable the
 * toolbar in a presentation to have them visible.
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */

// This file contains so much HTML, that we will just respectfully disagree about js
/* jshint quotmark:single */
/* global document */

( function( document ) {
    'use strict';
    var toolbar;
    var api;
    var root;
    var steps;
    var hideSteps = [];
    var prev;
    var select;
    var next;

    var triggerEvent = function( el, eventName, detail ) {
        var event = document.createEvent( 'CustomEvent' );
        event.initCustomEvent( eventName, true, true, detail );
        el.dispatchEvent( event );
    };

    var makeDomElement = function( html ) {
        var tempDiv = document.createElement( 'div' );
        tempDiv.innerHTML = html;
        return tempDiv.firstChild;
    };

    var selectOptionsHtml = function() {
        var options = '';
        for ( var i = 0; i < steps.length; i++ ) {

            // Omit steps that are listed as hidden from select widget
            if ( hideSteps.indexOf( steps[ i ] ) < 0 ) {
                options = options + '<option value="' + steps[ i ].id + '">' + // jshint ignore:line
                                    steps[ i ].id + '</option>' + '\n'; // jshint ignore:line
            }
        }
        return options;
    };

    var addNavigationControls = function( event ) {
        api = event.detail.api;
        var gc = api.lib.gc;
        root = event.target;
        steps = root.querySelectorAll( '.step' );

        var prevHtml   = '<button id="impress-navigation-ui-prev" title="Previous" ' +
                         'class="impress-navigation-ui">&lt;</button>';
        var selectHtml = '<select id="impress-navigation-ui-select" title="Go to" ' +
                         'class="impress-navigation-ui">' + '\n' +
                           selectOptionsHtml() +
                           '</select>';
        var nextHtml   = '<button id="impress-navigation-ui-next" title="Next" ' +
                         'class="impress-navigation-ui">&gt;</button>';

        prev = makeDomElement( prevHtml );
        prev.addEventListener( 'click',
            function() {
                api.prev();
        } );
        select = makeDomElement( selectHtml );
        select.addEventListener( 'change',
            function( event ) {
                api.goto( event.target.value );
        } );
        gc.addEventListener( root, 'impress:steprefresh', function( event ) {

            // As impress.js core now allows to dynamically edit the steps, including adding,
            // removing, and reordering steps, we need to requery and redraw the select list on
            // every stepenter event.
            steps = root.querySelectorAll( '.step' );
            select.innerHTML = '\n' + selectOptionsHtml();

            // Make sure the list always shows the step we're actually on, even if it wasn't
            // selected from the list
            select.value = event.target.id;
        } );
        next = makeDomElement( nextHtml );
        next.addEventListener( 'click',
            function() {
                api.next();
        } );

        triggerEvent( toolbar, 'impress:toolbar:appendChild', { group: 0, element: prev } );
        triggerEvent( toolbar, 'impress:toolbar:appendChild', { group: 0, element: select } );
        triggerEvent( toolbar, 'impress:toolbar:appendChild', { group: 0, element: next } );

    };

    // API for not listing given step in the select widget.
    // For example, if you set class="skip" on some element, you may not want it to show up in the
    // list either. Otoh we cannot assume that, or anything else, so steps that user wants omitted
    // must be specifically added with this API call.
    document.addEventListener( 'impress:navigation-ui:hideStep', function( event ) {
        hideSteps.push( event.target );
        if ( select ) {
            select.innerHTML = selectOptionsHtml();
        }
    }, false );

    // Wait for impress.js to be initialized
    document.addEventListener( 'impress:init', function( event ) {
        toolbar = document.querySelector( '#impress-toolbar' );
        if ( toolbar ) {
            addNavigationControls( event );
        }
    }, false );

} )( document );

