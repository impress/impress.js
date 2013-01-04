(function(window,impress){

    // plugin code now has access to impress API through the impress variable:
    //      goto, next, prev, init
    // you can (and probably should) load additional resources (js,css) through Modernizr.load

    // this example plugin loads jquery and makes impress jump to the next slide 

    Modernizr.load([
        {
            load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js',
            complete: function () {
                impress.next();
            }
        }
    ]);


})(window,impress());