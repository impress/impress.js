/**
 * Form support
 *
 * Functionality to better support use of input, textarea, button... elements in a presentation.
 *
 * Currently this does only one single thing: On impress:stepleave, de-focus any potentially active
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

    document.addEventListener( "impress:stepleave", function() {
        document.activeElement.blur();
    }, false );

} )( document );

