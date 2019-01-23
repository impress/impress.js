/**
 * Form support
 *
 * Functionality to better support use of input, textarea, button... elements in a presentation.
 *
 * This plugin does two things:
 *
 * Set stopPropagation on any element that might take text input. This allows users to type, for
 * example, the letter 'P' into a form field, without causing the presenter console to spring up.
 *
 * On impress:stepleave, de-focus any potentially active
 * element. This is to prevent the focus from being left in a form element that is no longer visible
 * in the window, and user therefore typing garbage into the form.
 *
 * TODO: Currently it is not possible to use TAB to navigate between form elements. Impress.js, and
 * in particular the navigation plugin, unfortunately must fully take control of the tab key,
 * otherwise a user could cause the browser to scroll to a link or button that's not on the current
 * step. However, it could be possible to allow tab navigation between form elements, as long as
 * they are on the active step. This is a topic for further study.
 *
 * Copyright 2016 Henrik Ingo
 * MIT License
 */
/* global document */
( function( document ) {
    "use strict";
    var root;
    var api;

    document.addEventListener( "impress:init", function( event ) {
        root = event.target;
        api = event.detail.api;
        var gc = api.lib.gc;

        var selectors = [ "input", "textarea", "select", "[contenteditable=true]" ];
        for ( var selector of selectors ) {
            var elements = document.querySelectorAll( selector );
            if ( !elements ) {
                continue;
            }

            for ( var i = 0; i < elements.length; i++ ) {
                var e = elements[ i ];
                gc.addEventListener( e, "keydown", function( event ) {
                    event.stopPropagation();
                } );
                gc.addEventListener( e, "keyup", function( event ) {
                    event.stopPropagation();
                } );
            }
        }
    }, false );

    document.addEventListener( "impress:stepleave", function() {
        document.activeElement.blur();
    }, false );

} )( document );

