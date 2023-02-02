let bannedIDs = [];

function highlightPath () { 
    if ( $( location ).attr( 'pathname' ).slice( 6, location.pathname.length ) === '' ) {
        $( '#home' ).css( 'background-color', 'black' );
        bannedIDs.push( 'home' );
    } else if ( $( location ).attr( 'pathname' ).slice( 6, location.pathname.length ) === 'gettingStarted.html' ) {
        $( '#gettingStarted' ).css( 'background-color', 'black' );
        bannedIDs.push( 'gettingStarted' );
    } else if ( $( location ).attr( 'pathname' ).slice( 6, 16 ) === 'reference/' ) {
        $( '#referenceNav' ).css( 'background-color', 'black' );
        $( '#reference' ).slideDown();
        bannedIDs.push( 'referenceNav' );
        setTimeout( highlightSubPath( 16 ), 300 );
    } else if ( $( location ).attr( 'pathname' ).slice( 6, 14 ) === 'plugins/' ) {
        $( '#pluginsNav' ).css( 'background-color', 'black' );
        $( '#plugins' ).slideDown();
        bannedIDs.push( 'pluginsNav' );
        setTimeout( highlightSubPath( 14 ), 300 );
    }
};

function highlightSubPath ( sliceStart ) {
    console.log( $( location ).attr( 'pathname' ).slice( sliceStart, parseInt( location.pathname.length ) - 5 ) );
    if ( $( location ).attr( 'pathname' ).slice( sliceStart, parseInt( location.pathname.length ) - 5 ) === '' ) {
        $( '#root' ).css( 'background-color', 'black' );
        bannedIDs.push( 'root' );
    } else {
        $( `#${location.pathname.slice( sliceStart, parseInt( location.pathname.length ) - 5 )}` ).css( 'background-color', 'rgb(43, 43, 43)' );
        bannedIDs.push( `${location.pathname.slice( sliceStart, parseInt( location.pathname.length ) - 5 )}` );
    };
}

$( document ).ready( function () {
    $( '.navitem' ).mouseenter( function () {
        $( this ).stop();
        $( this ).animate( { 'background-color': 'black' }, 100 );
    } );

    $( '.navitem' ).mouseleave( function () {
        if ( !bannedIDs.includes( this.id ) ) {
            if ( sessionStorage.getItem( 'theme' ) == 'dark' ) {
                $( this ).stop();
                $( this ).animate( { 'background-color': 'rgb(12, 12, 60)' }, 100 );
            } else {
                $( this ).stop();
                $( this ).animate( { 'background-color': 'rgb(22, 22, 117)' }, 100 );
            }
        }
    } );

    $( '.nav-subitem' ).mouseenter( function () { 
        $( this ).stop();
        $( this ).animate( { 'background-color': 'rgb(43, 43, 43)' }, 100 );
    } );

    $( '.nav-subitem' ).mouseleave( function () { 
        if ( !bannedIDs.includes( this.id ) ) {
            if ( sessionStorage.getItem( 'theme' ) == 'dark' ) {
                $( this ).stop();
                $( this ).animate( { 'background-color': 'rgb(18, 18, 99)' }, 100 );
            } else {
                $( this ).stop();
                $( this ).animate( { 'background-color': 'rgb(27, 27, 165)' }, 100 );
            }
        }
    } );
    setTimeout( highlightPath, 300 );
});

function toggleList ( id ) {
    $( `#${id}` ).slideToggle();
};