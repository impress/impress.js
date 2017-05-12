/*
    Remote control plugin - you can now impress people remotely using remotes.io 

    Copyright (c) 2013 Philip Nuzhnyi https://github.com/callmephilip
*/
(function(window,impress){

    // no remotes on touch devices
    if(!Modernizr.touch){
        Modernizr.load([
            {
                load: 'https://raw.github.com/Remotes/Remotes/master/dist/remotes.ne.min.js',
                complete: function () {
                    new Remotes("preview")
                            .on("swipe-left", function(e){ impress.next(); })
                            .on("swipe-right", function(e){ impress.prev(); })
                            .on("tap", function(e){ impress.next(); });
                }
            }
        ]);
    }
})(window,impress());