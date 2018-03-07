// This file contains so much HTML, that we will just respectfully disagree about js
/* jshint quotmark:single */
/* global document, console, setTimeout, navigator, QUnit */
/* exported loadIframe, initPresentation, _impressSupported */

// Log all QUnit assertions to console.log(), so that they are visible in karma output
QUnit.log( function( details ) {
  console.log( 'QUnit.log: ', details.result, details.message );
} );

var loadIframe = function( src, assert, callback ) {
  console.log( 'Begin loadIframe' );

  // When running in Karma, the #qunit-fixture appears from somewhere and we can't set its
  // contents in advance.
  var fix = document.getElementById( 'qunit-fixture' );
  fix.innerHTML = [
    '\n',
    '    <iframe id="presentation-iframe"\n',
    '            width="595" height="485"\n',
    '            frameborder="0" marginwidth="0" marginheight="0" scrolling="no"\n',
    '            style="border:1px solid #CCC; max-width: 100%;">\n',
    '    </iframe>'
    ].join( '' );

  var iframe = document.getElementById( 'presentation-iframe' );

  var onLoad = function() {
    assert.ok( true,
               'Presentation loaded. iframe.src = ' + iframe.src );
    try {
      assert.ok( iframe.contentDocument,
                 'Verifying that tests can access the presentation inside the iframe. ' +
                 'Note: On Firefox this fails when using paths with "../" parts for the iframe.' );
    }
    catch ( err ) {
      assert.ok( false,
               'Error when trying to access presentation in iframe. Note: When using Chrome with ' +
               'local files (file:///) this will fail with SecurityError. ' +
               'You can however use Chrome over Karma.' );
    }
    console.log( 'End loadIframe' );
    callback();
  };

  iframe.addEventListener( 'load', onLoad );

  assert.ok( iframe.src = src,
             'Setting iframe.src = ' + src );
};

var initPresentation = function( assert, callback, rootId ) {
  console.log( 'Begin initPresentation' );
  var iframe = document.getElementById( 'presentation-iframe' );
  var iframeDoc = iframe.contentDocument;
  var iframeWin = iframe.contentWindow;

  // Impress:stepenter is the last event triggered in init(), so we wait for that.
  var waitForStepEnter = function( event ) {
    assert.ok( true, 'impress (' + event.target.id + ') is now initialized.' );
    iframeDoc.removeEventListener( 'impress:stepenter', waitForStepEnterWrapper );
    console.log( 'End initPresentation' );
    callback();
  };

  // Unfortunately, impress.js uses the impress:stepenter event internally to
  // do some things related to entering a step. This causes a race condition when
  // we listen for the same event and expect it to be done with everything.
  // We wait 5 ms to resolve the race condition, then it's safe to start testing.
  var waitForStepEnterWrapper = function( event ) {
    setTimeout( function() { waitForStepEnter( event ); }, 5 );
  };
  iframeDoc.addEventListener( 'impress:stepenter', waitForStepEnterWrapper );

  assert.strictEqual( iframeWin.impress( rootId ).init(), undefined, 'Initializing impress.' );
};

// Helper function to determine whether this browser is supported by
// impress.js or not. Copied from impress.js itself.
var _impressSupported = function() {
  var pfx = ( function() {
    var style = document.createElement( 'dummy' ).style,
        prefixes = 'Webkit Moz O ms Khtml'.split( ' ' ),
        memory = {};
    return function( prop ) {
      if ( typeof memory[ prop ] === 'undefined' ) {
        var ucProp  = prop.charAt( 0 ).toUpperCase() + prop.substr( 1 ),
            props   = ( prop + ' ' + prefixes.join( ucProp + ' ' ) + ucProp ).split( ' ' );
        memory[ prop ] = null;
        for ( var i in props ) {
            if ( style[ props[ i ] ] !== undefined ) {
                memory[ prop ] = props[ i ];
                break;
            }
        }
      }
      return memory[ prop ];
    };
  } )();

  var ua = navigator.userAgent.toLowerCase();
  return ( pfx( 'perspective' ) !== null ) &&
           ( document.body.classList ) &&
           ( document.body.dataset ) &&
           ( ua.search( /(iphone)|(ipod)|(android)/ ) === -1 );
};

