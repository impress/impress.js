// Helper function to determine whether this browser is supported by 
// impress.js or not. Copied from impress.js itself.
var _impressSupported = function() {
  var pfx = (function () {
    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};
    return function ( prop ) {
      if ( typeof memory[ prop ] === "undefined" ) {
        var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
            props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
        memory[ prop ] = null;
        for ( var i in props ) {
            if ( style[ props[i] ] !== undefined ) {
                memory[ prop ] = props[i];
                break;
            }
        }
      }
      return memory[ prop ];
    };
  })();

  var ua = navigator.userAgent.toLowerCase();
  return   ( pfx("perspective") !== null ) &&
           ( document.body.classList ) &&
           ( document.body.dataset ) &&
           ( ua.search(/(iphone)|(ipod)|(android)/) === -1 );
}

