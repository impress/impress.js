/* global document */
( function( document ) {
    "use strict";
    var root;
    var stepids = [];

    // Get stepids from the steps under impress root
    var getSteps = function() {
        stepids = [];
        var steps = root.querySelectorAll( ".step" );
        for ( var i = 0; i < steps.length; i++ )
        {
          stepids[ i + 1 ] = steps[ i ].id;
        }
        };

    // Wait for impress.js to be initialized
    document.addEventListener( "impress:init", function( event ) {
            root = event.target;
        getSteps();
        var gc = event.detail.api.lib.gc;
        gc.pushCallback( function() {
            stepids = [];
            if ( progressbar ) {
                progressbar.style.width = "";
                        }
            if ( progress ) {
                progress.innerHTML = "";
                        }
        } );
    } );

    var progressbar = document.querySelector( "div.impress-progressbar div" );
    var progress = document.querySelector( "div.impress-progress" );

    if ( null !== progressbar || null !== progress ) {
        document.addEventListener( "impress:stepleave", function( event ) {
            updateProgressbar( event.detail.next.id );
        } );

        document.addEventListener( "impress:steprefresh", function( event ) {
            getSteps();
            updateProgressbar( event.target.id );
        } );

    }

    function updateProgressbar( slideId ) {
        var slideNumber = stepids.indexOf( slideId );
        if ( null !== progressbar ) {
                        var width = 100 / ( stepids.length - 1 ) * ( slideNumber );
            progressbar.style.width = width.toFixed( 2 ) + "%";
        }
        if ( null !== progress ) {
            progress.innerHTML = slideNumber + "/" + ( stepids.length - 1 );
        }
    }
} )( document );
