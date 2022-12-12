QUnit.module( "rel plugin rel_to tests" );

QUnit.test( "rel_to", function( assert ) {
    window.console.log( "Begin rel_to" );
    var done = assert.async();

    loadIframe( "test/plugins/rel/rel_to_tests_presentation.html", assert, function() {
        initPresentation( assert, function() {
            var iframe = document.getElementById( "presentation-iframe" );
            var iframeDoc = iframe.contentDocument;

            var root  = iframeDoc.querySelector( "div#impress" );
            var abs1 = iframeDoc.querySelector( "div#abs-1" );
            var abs2 = iframeDoc.querySelector( "div#abs-2" );
            var abs3 = iframeDoc.querySelector( "div#abs-3" );
            var abs4 = iframeDoc.querySelector( "div#abs-4" );
            var abs5 = iframeDoc.querySelector( "div#abs-5" );
            var abs6 = iframeDoc.querySelector( "div#abs-6" );
            var relative1 = iframeDoc.querySelector( "div#relative-1" );
            var relative2 = iframeDoc.querySelector( "div#relative-2" );
            var relative3 = iframeDoc.querySelector( "div#relative-3" );
            var relative4 = iframeDoc.querySelector( "div#relative-4" );
            var relative5 = iframeDoc.querySelector( "div#relative-5" );
            var relative6 = iframeDoc.querySelector( "div#relative-6" );
            var relative7 = iframeDoc.querySelector( "div#relative-7" );
            var relative8 = iframeDoc.querySelector( "div#relative-8" );
            var relative9 = iframeDoc.querySelector( "div#relative-9" );
            var relative10 = iframeDoc.querySelector( "div#relative-10" );

            assert.close( abs1.dataset.x, 0, 1, "abs-1 data-x attribute" );
            assert.close( abs1.dataset.y, 0, 1, "abs-1 data-y attribute" );
            assert.close( abs1.dataset.z, 0, 1, "abs-1 data-z attribute" );
            assert.close( abs1.dataset.rotateX, 0, 1, "abs-1 data-rotate-x" );
            assert.close( abs1.dataset.rotateY, 0, 1, "abs-1 data-rotate-y" );
            assert.close( abs1.dataset.rotateZ, 0, 1, "abs-1 data-rotate-z" );

            assert.close( abs2.dataset.x, 854, 1, "abs-2 data-x attribute" );
            assert.close( abs2.dataset.y, -125, 1, "abs-2 data-y attribute" );
            assert.close( abs2.dataset.z, -354, 1, "abs-2 data-z attribute" );
            assert.close( abs2.dataset.rotateX, 0, 1, "abs-2 data-rotate-x attribute" );
            assert.close( abs2.dataset.rotateY, 45, 1, "abs-2 data-rotate-y attribute" );
            assert.close( abs2.dataset.rotateZ, 0, 1, "abs-2 data-rotate-z attribute" );

            assert.close( abs3.dataset.x, 1708, 1, "abs-3 data-x attribute" );
            assert.close( abs3.dataset.y, -250, 1, "abs-3 data-y attribute" );
            assert.close( abs3.dataset.z, -708, 1, "abs-3 data-z attribute" );
            assert.close( abs3.dataset.rotateX, 0, 1, "abs-3 data-rotate-x attribute" );
            assert.close( abs3.dataset.rotateY, 45, 1, "abs-3 data-rotate-y attribute" );
            assert.close( abs3.dataset.rotateZ, 0, 1, "abs-3 data-rotate-z attribute" );

            assert.close( abs4.dataset.x, 1808, 1, "abs-4 data-x attribute" );
            assert.close( abs4.dataset.y, -250, 1, "abs-4 data-y attribute" );
            assert.close( abs4.dataset.z, -708, 1, "abs-4 data-z attribute" );
            assert.close( abs4.dataset.rotateX, 0, 1, "abs-4 data-rotate-x attribute" );
            assert.close( abs4.dataset.rotateY, 0, 1, "abs-4 data-rotate-y attribute" );
            assert.close( abs4.dataset.rotateZ, 0, 1, "abs-4 data-rotate-z attribute" );

            assert.close( abs5.dataset.x, 1708, 1, "abs-5 data-x attribute" );
            assert.close( abs5.dataset.y, -250, 1, "abs-5 data-y attribute" );
            assert.close( abs5.dataset.z, -708, 1, "abs-5 data-z attribute" );
            assert.close( abs5.dataset.rotateX, 0, 1, "abs-5 data-rotate-x attribute" );
            assert.close( abs5.dataset.rotateY, 0, 1, "abs-5 data-rotate-y attribute" );
            assert.close( abs5.dataset.rotateZ, 0, 1, "abs-5 data-rotate-z attribute" );

            assert.close( abs6.dataset.x, 1708, 1, "abs-6 data-x attribute" );
            assert.close( abs6.dataset.y, -250, 1, "abs-6 data-y attribute" );
            assert.close( abs6.dataset.z, -708, 1, "abs-6 data-z attribute" );
            assert.close( abs6.dataset.rotateX, 0, 1, "abs-6 data-rotate-x attribute" );
            assert.close( abs6.dataset.rotateY, 0, 1, "abs-6 data-rotate-y attribute" );
            assert.close( abs6.dataset.rotateZ, 0, 1, "abs-6 data-rotate-z attribute" );

            assert.close( relative1.dataset.x, 0, 1, "relative-1 data-x attribute" );
            assert.close( relative1.dataset.y, 1000, 1, "relative-1 data-y attribute" );
            assert.close( relative1.dataset.z, 0, 1, "relative-1 data-z attribute" );
            assert.close( relative1.dataset.rotateX, 0, 1, "relative-1 data-rotate-x" );
            assert.close( relative1.dataset.rotateY, 0, 1, "relative-1 data-rotate-y" );
            assert.close( relative1.dataset.rotateZ, 0, 1, "relative-1 data-rotate-z" );

            assert.close( relative2.dataset.x, 854, 1, "relative-2 data-x attribute" );
            assert.close( relative2.dataset.y, 875, 1, "relative-2 data-y attribute" );
            assert.close( relative2.dataset.z, -354, 1, "relative-2 data-z attribute" );
            assert.close( relative2.dataset.rotateX, 0, 1, "relative-2 data-rotate-x attribute" );
            assert.close( relative2.dataset.rotateY, 45, 1, "relative-2 data-rotate-y attribute" );
            assert.close( relative2.dataset.rotateZ, 0, 1, "relative-2 data-rotate-z attribute" );

            assert.close( relative3.dataset.x, 1208, 1, "relative-3 data-x attribute" );
            assert.close( relative3.dataset.y, 750, 1, "relative-3 data-y attribute" );
            assert.close( relative3.dataset.z, -1208, 1, "relative-3 data-z attribute" );
            assert.close( relative3.dataset.rotateX, 0, 1, "relative-3 data-rotate-x attribute" );
            assert.close( relative3.dataset.rotateY, 90, 1, "relative-3 data-rotate-y attribute" );
            assert.close( relative3.dataset.rotateZ, 0, 1, "relative-3 data-rotate-z attribute" );

            assert.close( relative4.dataset.x, 1308, 1, "relative-4 data-x attribute" );
            assert.close( relative4.dataset.y, 750, 1, "relative-4 data-y attribute" );
            assert.close( relative4.dataset.z, -1208, 1, "relative-4 data-z attribute" );
            assert.close( relative4.dataset.rotateX, 0, 1, "relative-4 data-rotate-x attribute" );
            assert.close( relative4.dataset.rotateY, 0, 1, "relative-4 data-rotate-y attribute" );
            assert.close( relative4.dataset.rotateZ, 0, 1, "relative-4 data-rotate-z attribute" );

            assert.close( relative5.dataset.x, 854, 1, "relative-5 data-x attribute" );
            assert.close( relative5.dataset.y, 625, 1, "relative-5 data-y attribute" );
            assert.close( relative5.dataset.z, -2062, 1, "relative-5 data-z attribute" );
            assert.close( relative5.dataset.rotateX, 0, 1, "relative-5 data-rotate-x" );
            assert.close( relative5.dataset.rotateY, 135, 1, "relative-5 data-rotate-y" );
            assert.close( relative5.dataset.rotateZ, 0, 1, "relative-5 data-rotate-z" );

            assert.close( relative6.dataset.x, 0, 1, "relative-6 data-x attribute" );
            assert.close( relative6.dataset.y, 500, 1, "relative-6 data-y attribute" );
            assert.close( relative6.dataset.z, -2416, 1, "relative-6 data-z attribute" );
            assert.close( relative6.dataset.rotateX, 0, 1, "relative-6 data-rotate-x" );
            assert.close( relative6.dataset.rotateY, 180, 1, "relative-6 data-rotate-y" );
            assert.close( relative6.dataset.rotateZ, 0, 1, "relative-6 data-rotate-z" );

            assert.close( relative7.dataset.x, 1208, 1, "relative-7 data-x attribute" );
            assert.close( relative7.dataset.y, 750, 1, "relative-7 data-y attribute" );
            assert.close( relative7.dataset.z, -1208, 1, "relative-7 data-z attribute" );
            assert.close( relative7.dataset.rotateX, 0, 1, "relative-7 data-rotate-x" );
            assert.close( relative7.dataset.rotateY, 90, 1, "relative-7 data-rotate-y" );
            assert.close( relative7.dataset.rotateZ, 0, 1, "relative-7 data-rotate-z" );

            assert.close( relative8.dataset.x, 1208, 1, "relative-8 data-x attribute" );
            assert.close( relative8.dataset.y, 750, 1, "relative-8 data-y attribute" );
            assert.close( relative8.dataset.z, -1208, 1, "relative-8 data-z attribute" );
            assert.close( relative8.dataset.rotateX, 0, 1, "relative-8 data-rotate-x" );
            assert.close( relative8.dataset.rotateY, 90, 1, "relative-8 data-rotate-y" );
            assert.close( relative8.dataset.rotateZ, 0, 1, "relative-8 data-rotate-z" );

            assert.close( relative9.dataset.x, 1208, 1, "relative-9 data-x attribute" );
            assert.close( relative9.dataset.y, 750, 1, "relative-9 data-y attribute" );
            assert.close( relative9.dataset.z, -1208, 1, "relative-9 data-z attribute" );
            assert.close( relative9.dataset.rotateX, 0, 1, "relative-9 data-rotate-x" );
            assert.close( relative9.dataset.rotateY, 0, 1, "relative-9 data-rotate-y" );
            assert.close( relative9.dataset.rotateZ, 0, 1, "relative-9 data-rotate-z" );

            assert.close( relative10.dataset.x, 1208, 1, "relative-10 data-x attribute" );
            assert.close( relative10.dataset.y, 750, 1, "relative-10 data-y attribute" );
            assert.close( relative10.dataset.z, -1208, 1, "relative-10 data-z attribute" );
            assert.close( relative10.dataset.rotateX, 0, 1, "relative-10 data-rotate-x" );
            assert.close( relative10.dataset.rotateY, 0, 1, "relative-10 data-rotate-y" );
            assert.close( relative10.dataset.rotateZ, 0, 1, "relative-10 data-rotate-z" );

            done();
            console.log( "End rel_to test (sync)" );
        } )
    } ); // LoadIframe()
} );

