$( document ).ready( function () {
    $( '#navbar' ).load( '/nav.html' );
    $( '#footer' ).load( '/footer.html' );

    $( document ).ready(function () {
        $( '.button' ).mouseenter( function () {
            $( this ).stop();
            $( this ).animate( { 'background-color':'rgba(65, 211, 65, 1)', 'border-radius': '0px' }, 200 );
        });
        $( '.button' ).mouseleave( function () {
            $( this ).stop();
            $( this ).animate( { 'background-color':'rgba(0, 128, 0, 1)', 'border-radius': '500px' }, 200 );
        });
    });
});