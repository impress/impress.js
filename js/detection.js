Modernizr.addTest('impress', function(){
    var head = document.head; // We can't use body here !
    var ua = navigator.userAgent.toLowerCase();
    var test =
        // browser should support CSS 3D transtorms 
        ( Modernizr.csstransforms ) &&
        
        // and `classList` and `dataset` APIs
        ( head.classList ) &&
        ( head.dataset ) &&
        
        // but some mobile devices need to be blacklisted,
        // because their CSS 3D support or hardware is not
        // good enough to run impress.js properly, sorry...
        ( ua.search(/(iphone)|(ipod)|(android)/) === -1 );
    return test;
});