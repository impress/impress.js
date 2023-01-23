function highlightPath () { 
            
};

$(document).ready(function () {
    $( '.navitem' ).mouseenter( function () { 
        $( this ).stop();
        $( this ).animate( { 'background-color': 'black' }, 100 );
    } );

    $( '.navitem' ).mouseleave( function () { 
        if ( sessionStorage.getItem( 'theme' ) == 'dark' ) {
            $( this ).stop();
            $( this ).animate( { 'background-color': 'rgb(12, 12, 60)' }, 100 );
        } else {
            $( this ).stop();
            $( this ).animate( { 'background-color': 'rgb(22, 22, 117)' }, 100 );
        }
    } );

    $( '.nav-subitem' ).mouseenter( function () { 
        $( this ).stop();
        $( this ).animate( { 'background-color': 'rgb(43, 43, 43)' }, 100 );
    } );

    $( '.nav-subitem' ).mouseleave( function () { 
        if ( sessionStorage.getItem( 'theme' ) == 'dark' ) {
            $( this ).stop();
            $( this ).animate( { 'background-color': 'rgb(18, 18, 99)' }, 100 );
        } else {
            $( this ).stop();
            $( this ).animate( { 'background-color': 'rgb(27, 27, 165)' }, 100 );
        }
    } );
});

function toggleList ( id ) {
    $( `#${id}` ).slideToggle();
};