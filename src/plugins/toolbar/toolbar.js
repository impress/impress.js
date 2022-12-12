/**
 * Toolbar plugin
 *
 * This plugin provides a generic graphical toolbar. Other plugins that
 * want to expose a button or other widget, can add those to this toolbar.
 *
 * Using a single consolidated toolbar for all GUI widgets makes it easier
 * to position and style the toolbar rather than having to do that for lots
 * of different divs.
 *
 *
 * *** For presentation authors: *****************************************
 *
 * To add/activate the toolbar in your presentation, add this div:
 *
 *     <div id="impress-toolbar"></div>
 *
 * Styling the toolbar is left to presentation author. Here's an example CSS:
 *
 *    .impress-enabled div#impress-toolbar {
 *        position: fixed;
 *        right: 1px;
 *        bottom: 1px;
 *        opacity: 0.6;
 *    }
 *    .impress-enabled div#impress-toolbar > span {
 *        margin-right: 10px;
 *    }
 *
 * The [mouse-timeout](../mouse-timeout/README.md) plugin can be leveraged to hide
 * the toolbar from sight, and only make it visible when mouse is moved.
 *
 *    body.impress-mouse-timeout div#impress-toolbar {
 *        display: none;
 *    }
 *
 *
 * *** For plugin authors **********************************************
 *
 * To add a button to the toolbar, trigger the `impress:toolbar:appendChild`
 * or `impress:toolbar:insertBefore` events as appropriate. The detail object
 * should contain following parameters:
 *
 *    { group : 1,                       // integer. Widgets with the same group are grouped inside
 *                                       // the same <span> element.
 *      html : "<button>Click</button>", // The html to add.
 *      callback : "mycallback",         // Toolbar plugin will trigger event
 *                                       // `impress:toolbar:added:mycallback` when done.
 *      before: element }                // The reference element for an insertBefore() call.
 *
 * You should also listen to the `impress:toolbar:added:mycallback` event. At
 * this point you can find the new widget in the DOM, and for example add an
 * event listener to it.
 *
 * You are free to use any integer for the group. It's ok to leave gaps. It's
 * ok to co-locate with widgets for another plugin, if you think they belong
 * together.
 *
 * See navigation-ui for an example.
 *
 * Copyright 2016 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */

/* global document */

( function( document ) {
    "use strict";
    var toolbar = document.getElementById( "impress-toolbar" );
    var groups = [];

    /**
     * Get the span element that is a child of toolbar, identified by index.
     *
     * If span element doesn't exist yet, it is created.
     *
     * Note: Because of Run-to-completion, this is not a race condition.
     * https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop#Run-to-completion
     *
     * :param: index   Method will return the element <span id="impress-toolbar-group-{index}">
     */
    var getGroupElement = function( index ) {
        var id = "impress-toolbar-group-" + index;
        if ( !groups[ index ] ) {
            groups[ index ] = document.createElement( "span" );
            groups[ index ].id = id;
            var nextIndex = getNextGroupIndex( index );
            if ( nextIndex === undefined ) {
                toolbar.appendChild( groups[ index ] );
            } else {
                toolbar.insertBefore( groups[ index ], groups[ nextIndex ] );
            }
        }
        return groups[ index ];
    };

    /**
     * Get the span element from groups[] that is immediately after given index.
     *
     * This can be used to find the reference node for an insertBefore() call.
     * If no element exists at a larger index, returns undefined. (In this case,
     * you'd use appendChild() instead.)
     *
     * Note that index needn't itself exist in groups[].
     */
    var getNextGroupIndex = function( index ) {
        var i = index + 1;
        while ( !groups[ i ] && i < groups.length ) {
            i++;
        }
        if ( i < groups.length ) {
            return i;
        }
    };

    // API
    // Other plugins can add and remove buttons by sending them as events.
    // In return, toolbar plugin will trigger events when button was added.
    if ( toolbar ) {
        /**
         * Append a widget inside toolbar span element identified by given group index.
         *
         * :param: e.detail.group    integer specifying the span element where widget will be placed
         * :param: e.detail.element  a dom element to add to the toolbar
         */
        toolbar.addEventListener( "impress:toolbar:appendChild", function( e ) {
            var group = getGroupElement( e.detail.group );
            group.appendChild( e.detail.element );
        } );

        /**
         * Add a widget to toolbar using insertBefore() DOM method.
         *
         * :param: e.detail.before   the reference dom element, before which new element is added
         * :param: e.detail.element  a dom element to add to the toolbar
         */
        toolbar.addEventListener( "impress:toolbar:insertBefore", function( e ) {
            toolbar.insertBefore( e.detail.element, e.detail.before );
        } );

        /**
         * Remove the widget in e.detail.remove.
         */
        toolbar.addEventListener( "impress:toolbar:removeWidget", function( e ) {
            toolbar.removeChild( e.detail.remove );
        } );

        document.addEventListener( "impress:init", function( event ) {
            var api = event.detail.api;
            api.lib.gc.pushCallback( function() {
                toolbar.innerHTML = "";
                groups = [];
            } );
        } );
    } // If toolbar

} )( document );
