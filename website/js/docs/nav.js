function toggleList ( id ) {
    $( `#${id}` ).slideToggle();
};

$( () => {
    setTimeout( () => {
        if ( location.pathname.substring( 6 ) === '' ) {
            document.getElementById( 'home' ).classList.add( 'active' );
        } else {
            if ( location.pathname.substring( location.pathname.length - 1 ) === '/' ) {
                document.getElementById( location.pathname.substring( 6, location.pathname.substring( 6 ).indexOf( '/' ) + 6 ) + 'Nav' ).classList.add( 'active' );
                document.getElementById( location.pathname.substring( 6, location.pathname.substring( 6 ).indexOf( '/' ) + 6 ) + '-home' ).classList.add( 'active' );
                $( '#' + location.pathname.substring( 6, location.pathname.substring( 6 ).indexOf( '/' ) + 6 ) ).slideDown( 300 );
            } else if( location.pathname.substring( 6 ).includes( '/' ) ) {
                document.getElementById( location.pathname.substring( 6, location.pathname.substring( 6 ).indexOf( '/' ) + 6 ) + 'Nav' ).classList.add( 'active' );
                document.getElementById( location.pathname.substring( location.pathname.substring( 6 ).indexOf( '/' ) + 7, location.pathname.length - 5 ) ).classList.add( 'active' );
                $( '#' + location.pathname.substring( 6, location.pathname.substring( 6 ).indexOf( '/' ) + 6 ) ).slideDown( 300 );
            } else {
                document.getElementById( location.pathname.substring( 6, location.pathname.length - 5 ) ).classList.add( 'active' );
            }
        }
    }, 300 );
} );