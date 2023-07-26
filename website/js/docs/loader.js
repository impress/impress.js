let theme = '';
theme = sessionStorage.getItem( 'theme' ) || getPreferredTheme();

$( document ).ready( function () {
    $( '#nav' ).load( '/docs/nav.html' );
    $( '#top' ).load( '/docs/top.html' );
} );

// set theme on page load
theme = localStorage.getItem( 'theme' ) ?? '';
if ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches || theme === 'dark' ) {
    document.documentElement.classList.add( 'dark' );
    setTimeout( () => {
        document.getElementById( 'darkToggle' ).innerHTML = '&#9788;';
    }, 300 );
    localStorage.setItem( 'theme', 'dark' );
} else {
    document.documentElement.classList.add( 'light' );
    localStorage.setItem( 'theme', 'light' );
}

function setTheme () {
    theme = localStorage.getItem( 'theme' ) ?? '';
    if ( theme === 'dark' ) {
        document.getElementById( 'darkToggle' ).innerHTML = '&#9789;';
        document.documentElement.classList.remove( 'dark' );
        document.documentElement.classList.add( 'light' );
        localStorage.setItem( 'theme', 'light' );
    } else if ( theme === 'light' ) {
        document.getElementById( 'darkToggle' ).innerHTML = '&#9788;';
        document.documentElement.classList.remove( 'light' );
        document.documentElement.classList.add( 'dark' );
        localStorage.setItem( 'theme', 'dark' );
    }
}
