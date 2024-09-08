/**
 * Bookmark Plugin
 *
 * The bookmark plugin consists of
 *   a pre-init plugin,
 *   a keyup listener, and
 *   a pre-stepleave plugin.
 *
 * The pre-init plugin surveys all step divs to set up bookmark keybindings.
 * The pre-stepleave plugin alters the destination when a bookmark hotkey is pressed.
 *
 * Example:
 *
 *       <!-- data-bookmark-key-list allows an "inbound" style of non-linear navigation. -->
 *       <div id="..." class="step" data-bookmark-key-list="Digit1 KeyA 1 2 3 a b c">
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values for a table
 * of what strings to use for each key. Both .key and .code styles are recognized.
 *
 * It's up to the HTML author to avoid reserved hotkeys H, B, P, ? etc.
 *
 * Copyright 2016-2017 Henrik Ingo (@henrikingo)
 * Released under the MIT license.
 */
/* global document, impress */

( function( document ) {
    "use strict";
    var hotkeys = {};
    function hotkeyDest( event ) {
	return ( hotkeys.hasOwnProperty( event.key )  ? hotkeys[ event.key ] :
		 hotkeys.hasOwnProperty( event.code ) ? hotkeys[ event.code ] : null ); }

    // In pre-init phase, build a map of bookmark hotkey to div id, by reviewing all steps
    impress.addPreInitPlugin( function( root, api ) {
	root.querySelectorAll( ".step" ).forEach( function( div ) {
            if ( div.dataset.bookmarkKeyList !== undefined && div.id !== undefined ) {
		div.dataset.bookmarkKeyList.split( " " ).forEach( ( k ) => {
		    if ( hotkeys.hasOwnProperty( k ) ) {
			hotkeys[ k ].push( div.id );
		    } else { hotkeys[ k ] = [ div.id ]; } } ); } } );

	api.lib.gc.addEventListener( document, "keyup", function( event ) {
	    if ( hotkeyDest( event ) !== null ) {
		event.stopImmediatePropagation();
		api.next( event );

		// Event.preventDefault();
	    }
	} );
    } );

    // In pre-stepleave phase, match a hotkey and reset destination accordingly.
    impress.addPreStepLeavePlugin( function( event ) {

	// Window.console.log(`bookmark: running as PreStepLeavePlugin; event=`);
	// window.console.log(event)
        if ( ( !event || !event.origEvent ) ) { return; }
	var dest = hotkeyDest( event.origEvent );
        if ( dest ) {

	    // Window.console.log(`bookmark: recognizing hotkey ${event.code} goes to ${dest}`)
            var newTarget = document.getElementById( dest[ 0 ] ); // jshint ignore:line
            if ( newTarget ) {
                event.detail.next = newTarget;
		dest.push( dest.shift() ); // Repeated hotkey presses cycle through each dest.
            }
        }
    } );

} )( document );

