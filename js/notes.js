/**
 * impress.js notes
 *
 * Adds support for inline speaker notes.
 *
 * MIT Licensed.
 *
 * Copyright 2012 David Souther (davidsouther@gmail.com)
 */

(function ( document, window ) {
    'use strict';

	//We have a child!
    var notesWindow = null;

	//Some default HTML, if there's no template.
    var notesTemplate = document.getElementById('impress-notes-template') ?
        document.byId('notesTemplate').innerHTML :
        '<div class="controls"> ' +
            '<a href="#" onclick="impress().prev(); return false;" />Prev</a>' +
            '<a href="#" onclick="impress().next(); return false;" style="float:right;"/>Next</a>' +
            '</div>' +
            '<div id="notes" style="text-align: justify;"></div>' +
            '<div class="controls"> ' +
            '<a href="#" onclick="impress().prev(); return false;" />Prev</a>' +
            '<a href="#" onclick="impress().next(); return false;" style="float:right;"/>Next</a>' +
            '</div>';

	//Add a new function to the impress() object. 
	//SIDE EFFECT: If impress hasn't already run, it just got initialized.
	//TODO look at what to do if there are multiple impress roots.
    impress().openNotes = function(){
        if(notesWindow && !notesWindow.closed) {
            notesWindow.focus();
        } else {
            notesWindow = window.open();
            notesWindow.document.title = "Impress.js Speaker Notes (" + document.title + ")";
            notesWindow.impress = window.impress;
            notesWindow.document.body.innerHTML = notesTemplate;
            
            slideChange();
        }
    };

	// Replace the HTML
    var slideChange = function(){
        if(notesWindow) {
            notesWindow.document.getElementById('notes').innerHTML =
            	document.querySelector('.active .notes').innerHTML;
        }
    };

	//Register the callback
    impress().callback(slideChange);

	//When the window closes, clean up after ourselves.
	window.onunload = function(){
		notesWindow && !notesWindow.closed && notesWindow.close();
	};

	//Open speaker notes when they press 'n'
    document.addEventListener("keyup", function ( event ) {
        if ( event.keyCode === 78 ) {
            impress().openNotes();
        }
    }, false);

	//If they set the notesOnStartup to the window's impress object, start it
    if(impress.notesOnStartup) {
        impress().openNotes();
    }

})(document, window);

