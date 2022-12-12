QUnit.module( "rel plugin relative to screen size tests" );

QUnit.test( "relative_to_screen_size", function( assert ) {
  window.console.log( "Begin relative_to_screen_size" );
  var done = assert.async();

  loadIframe( "test/plugins/rel/relative_to_screen_size_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;

      var root  = iframeDoc.querySelector( "div#impress" );

      var origin = iframeDoc.querySelector( "div#origin" );
      var step1 = iframeDoc.querySelector( "div#step1" );
      var step2 = iframeDoc.querySelector( "div#step2" );
      var step3 = iframeDoc.querySelector( "div#step3" );
      var overview = iframeDoc.querySelector( "div#overview" );

      assert.equal( origin.dataset.x, 0, "origin data-x attribute" );
      assert.equal( origin.dataset.y, 0, "origin data-y attribute" );
      assert.equal( origin.dataset.z, 0, "origin data-z attribute" );

      assert.equal( step1.dataset.x, 2000, "step1 data-x attribute" );
      assert.equal( step1.dataset.y, 1500, "step1 data-y attribute" );
      assert.equal( step1.dataset.z, -2000, "step1 data-z attribute" );

      assert.equal( step2.dataset.x, -3000, "step2 data-x attribute" );
      assert.equal( step2.dataset.y, -4000, "step2 data-y attribute" );
      assert.equal( step2.dataset.z, 3000, "step2 data-z attribute" );

      assert.equal( step3.dataset.x, 1000, "step3 data-x attribute" );
      assert.equal( step3.dataset.y, -750, "step3 data-y attribute" );
      assert.equal( step3.dataset.z, 1000, "step3 data-z attribute" );

      assert.equal( overview.dataset.x, 2000,  "overview data-x attribute" );
      assert.equal( overview.dataset.y, -1500, "overview data-y attribute" );
      assert.equal( overview.dataset.z, 1500,  "overview data-z attribute" );

      done();
      console.log( "End relative_to_screen_size test (sync)" );
    } )
  } ); // LoadIframe()
} );

