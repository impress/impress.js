$( document ).ready( function () {
    $( '#nav' ).load( '/docs/nav.html' );
    $( '#top' ).load( '/docs/top.html' );
    setTimeout( setTheme, 300 );
} );


let theme = sessionStorage.getItem( 'theme' ) || getPreferredTheme();

// set theme on page load
function setTheme () {
    if ( theme == 'dark' ) {
        document.getElementById( 'darkToggle' ).innerHTML = '&#9788;';
        $( '.content' ).css( 'background-color', 'rgb(46, 46, 46)' );
        $( '.top-container' ).css( 'background-color', 'rgb(100, 100, 100)' );
        $( '.content' ).css( 'color', 'white' );
        $( '.nav-subitem' ).css( 'background-color', 'rgb(18, 18, 99)' );
        $( '.navitem' ).css( 'background-color', 'rgb(12, 12, 60)' );
        $( '.nav-container' ).css( 'background-color', 'rgb(0, 0, 100)' );
    }
}

// retreive preferred theme from browser preferences if not in session storage
function getPreferredTheme () {
    if ( window.matchMedia( '(prefers-colorscheme: dark)' ).matches ) {
        setPreferredTheme( 'dark' );
        return 'dark';
    } else {
        setPreferredTheme( 'light' );
        return 'light';
    };
}

// set theme in session storage
function setPreferredTheme ( userTheme ) {
    sessionStorage.setItem( 'theme', userTheme );
    theme = userTheme;
}

// change theme
function toggleDarkMode () {
    if ( theme == 'light' ) {
        $( '.content' ).animate( { 'background-color': 'rgb(46, 46, 46)' } );
        $( '.top-container' ).animate( { 'background-color': 'rgb(100, 100, 100)' } );
        $( '.nav-subitem' ).animate( { 'background-color': 'rgb(18, 18, 99)' } );
        $( '.navitem' ).animate( { 'background-color': 'rgb(12, 12, 60)' } );
        $( '.nav-container' ).animate( { 'background-color': 'rgb(0, 0, 100)' } );
        $( '.content' ).animate( { 'color': 'white' } );
        document.getElementById( 'darkToggle' ).innerHTML = '&#9788;';
        setPreferredTheme( 'dark' );
    } else {
        $( '.content' ).animate( { 'background-color': 'white' } );
        $( '.content' ).animate( { 'color': 'black' } );
        $( '.nav-subitem' ).animate( { 'background-color': 'rgb(27, 27, 165)' } );
        $( '.navitem' ).animate( { 'background-color': 'rgb(22, 22, 117)' } );
        $( '.nav-container' ).animate( { 'background-color': 'blue' } );
        $( '.top-container' ).animate( { 'background-color': 'rgb(223, 223, 223)' } );
        document.getElementById( 'darkToggle' ).innerHTML = '&#9789;';
        setPreferredTheme( 'light' );
    }
}
