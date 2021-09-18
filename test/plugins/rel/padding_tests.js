QUnit.module( "rel plugin padding tests" );

QUnit.test( "padding_relative", function( assert ) {
  window.console.log( "Begin padding_relative" );
  var done = assert.async();

  loadIframe( "test/plugins/rel/padding_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;

      var root  = iframeDoc.querySelector( "div#impress" );

      var origin = iframeDoc.querySelector( "div#origin" );
      var origin_x = iframeDoc.querySelector( "div#origin_x" );
      var origin_y = iframeDoc.querySelector( "div#origin_y" );
      var origin_z = iframeDoc.querySelector( "div#origin_z" );

      var x = iframeDoc.querySelector( "div#x" );
      var x_x = iframeDoc.querySelector( "div#x_x" );
      var x_y = iframeDoc.querySelector( "div#x_y" );
      var x_z = iframeDoc.querySelector( "div#x_z" );

      var y = iframeDoc.querySelector( "div#y" );
      var y_x = iframeDoc.querySelector( "div#y_x" );
      var y_y = iframeDoc.querySelector( "div#y_y" );
      var y_z = iframeDoc.querySelector( "div#y_z" );

      var z = iframeDoc.querySelector( "div#z" );
      var z_x = iframeDoc.querySelector( "div#z_x" );
      var z_y = iframeDoc.querySelector( "div#z_y" );
      var z_z = iframeDoc.querySelector( "div#z_z" );

      var reset = iframeDoc.querySelector( "div#reset" );

      assert.close( origin.dataset.x, 0, 1, "origin data-x attribute" );
      assert.close( origin.dataset.y, 0, 1, "origin data-y attribute" );
      assert.close( origin.dataset.z, 0, 1, "origin data-z attribute" );
      assert.close( origin.dataset.rotateX, 0, 1, "origin data-rotate-x" );
      assert.close( origin.dataset.rotateY, 0, 1, "origin data-rotate-y" );
      assert.close( origin.dataset.rotateZ, 0, 1, "origin data-rotate-z" );

      assert.close( origin_x.dataset.x, 500, 1, "origin_x data-x attribute" );
      assert.close( origin_x.dataset.y, 0, 1, "origin_x data-y attribute" );
      assert.close( origin_x.dataset.z, 0, 1, "origin_x data-z attribute" );
      assert.close( origin_x.dataset.rotateX, 0, 1, "origin_x data-rotate-x" );
      assert.close( origin_x.dataset.rotateY, 0, 1, "origin_x data-rotate-y" );
      assert.close( origin_x.dataset.rotateZ, 0, 1, "origin_x data-rotate-z" );

      assert.close( origin_y.dataset.x, 0, 1, "origin_y data-x attribute" );
      assert.close( origin_y.dataset.y, 500, 1, "origin_y data-y attribute" );
      assert.close( origin_y.dataset.z, 0, 1, "origin_y data-z attribute" );
      assert.close( origin_y.dataset.rotateX, 0, 1, "origin_y data-rotate-x" );
      assert.close( origin_y.dataset.rotateY, 0, 1, "origin_y data-rotate-y" );
      assert.close( origin_y.dataset.rotateZ, 0, 1, "origin_y data-rotate-z" );

      assert.close( origin_z.dataset.x, 0, 1, "origin_z data-x attribute" );
      assert.close( origin_z.dataset.y, 0, 1, "origin_z data-y attribute" );
      assert.close( origin_z.dataset.z, 500, 1, "origin_z data-z attribute" );
      assert.close( origin_z.dataset.rotateX, 0, 1, "origin_z data-rotate-x" );
      assert.close( origin_z.dataset.rotateY, 0, 1, "origin_z data-rotate-y" );
      assert.close( origin_z.dataset.rotateZ, 0, 1, "origin_z data-rotate-z" );

      assert.close( x.dataset.x, 0, 1, "x data-x attribute" );
      assert.close( x.dataset.y, 0, 1, "x data-y attribute" );
      assert.close( x.dataset.z, 0, 1, "x data-z attribute" );
      assert.close( x.dataset.rotateX, 90, 1, "x data-rotate-x" );
      assert.close( x.dataset.rotateY, 0, 1, "x data-rotate-y" );
      assert.close( x.dataset.rotateZ, 0, 1, "x data-rotate-z" );

      assert.close( x_x.dataset.x, 500, 1, "x_x data-x attribute" );
      assert.close( x_x.dataset.y, 0, 1, "x_x data-y attribute" );
      assert.close( x_x.dataset.z, 0, 1, "x_x data-z attribute" );
      assert.close( x_x.dataset.rotateX, 90, 1, "x_x data-rotate-x" );
      assert.close( x_x.dataset.rotateY, 0, 1, "x_x data-rotate-y" );
      assert.close( x_x.dataset.rotateZ, 0, 1, "x_x data-rotate-z" );

      assert.close( x_y.dataset.x, 0, 1, "x_y data-x attribute" );
      assert.close( x_y.dataset.y, 0, 1, "x_y data-y attribute" );
      assert.close( x_y.dataset.z, 500, 1, "x_y data-z attribute" );
      assert.close( x_y.dataset.rotateX, 90, 1, "x_y data-rotate-x" );
      assert.close( x_y.dataset.rotateY, 0, 1, "x_y data-rotate-y" );
      assert.close( x_y.dataset.rotateZ, 0, 1, "x_y data-rotate-z" );

      assert.close( x_z.dataset.x, 0, 1, "x_z data-x attribute" );
      assert.close( x_z.dataset.y, -500, 1, "x_z data-y attribute" );
      assert.close( x_z.dataset.z, 0, 1, "x_z data-z attribute" );
      assert.close( x_z.dataset.rotateX, 90, 1, "x_z data-rotate-x" );
      assert.close( x_z.dataset.rotateY, 0, 1, "x_z data-rotate-y" );
      assert.close( x_z.dataset.rotateZ, 0, 1, "x_z data-rotate-z" );

      assert.close( y.dataset.x, 0, 1, "y data-x attribute" );
      assert.close( y.dataset.y, 0, 1, "y data-y attribute" );
      assert.close( y.dataset.z, 0, 1, "y data-z attribute" );
      assert.close( y.dataset.rotateX, 0, 1, "y data-rotate-x" );
      assert.close( y.dataset.rotateY, 90, 1, "y data-rotate-y" );
      assert.close( y.dataset.rotateZ, 0, 1, "y data-rotate-z" );

      assert.close( y_x.dataset.x, 0, 1, "y_x data-x attribute" );
      assert.close( y_x.dataset.y, 0, 1, "y_x data-y attribute" );
      assert.close( y_x.dataset.z, -500, 1, "y_x data-z attribute" );
      assert.close( y_x.dataset.rotateX, 0, 1, "y_x data-rotate-x" );
      assert.close( y_x.dataset.rotateY, 90, 1, "y_x data-rotate-y" );
      assert.close( y_x.dataset.rotateZ, 0, 1, "y_x data-rotate-z" );

      assert.close( y_y.dataset.x, 0, 1, "y_y data-x attribute" );
      assert.close( y_y.dataset.y, 500, 1, "y_y data-y attribute" );
      assert.close( y_y.dataset.z, 0, 1, "y_y data-z attribute" );
      assert.close( y_y.dataset.rotateX, 0, 1, "y_y data-rotate-x" );
      assert.close( y_y.dataset.rotateY, 90, 1, "y_y data-rotate-y" );
      assert.close( y_y.dataset.rotateZ, 0, 1, "y_y data-rotate-z" );

      assert.close( y_z.dataset.x, 500, 1, "y_z data-x attribute" );
      assert.close( y_z.dataset.y, 0, 1, "y_z data-y attribute" );
      assert.close( y_z.dataset.z, 0, 1, "y_z data-z attribute" );
      assert.close( y_z.dataset.rotateX, 0, 1, "y_z data-rotate-x" );
      assert.close( y_z.dataset.rotateY, 90, 1, "y_z data-rotate-y" );
      assert.close( y_z.dataset.rotateZ, 0, 1, "y_z data-rotate-z" );

      assert.close( z.dataset.x, 0, 1, "z data-x attribute" );
      assert.close( z.dataset.y, 0, 1, "z data-y attribute" );
      assert.close( z.dataset.z, 0, 1, "z data-z attribute" );
      assert.close( z.dataset.rotateX, 0, 1, "z data-rotate-x" );
      assert.close( z.dataset.rotateY, 0, 1, "z data-rotate-y" );
      assert.close( z.dataset.rotateZ, 90, 1, "z data-rotate-z" );

      assert.close( z_x.dataset.x, 0, 1, "z_x data-x attribute" );
      assert.close( z_x.dataset.y, 500, 1, "z_x data-y attribute" );
      assert.close( z_x.dataset.z, 0, 1, "z_x data-z attribute" );
      assert.close( z_x.dataset.rotateX, 0, 1, "z_x data-rotate-x" );
      assert.close( z_x.dataset.rotateY, 0, 1, "z_x data-rotate-y" );
      assert.close( z_x.dataset.rotateZ, 90, 1, "z_x data-rotate-z" );

      assert.close( z_y.dataset.x, -500, 1, "z_y data-x attribute" );
      assert.close( z_y.dataset.y, 0, 1, "z_y data-y attribute" );
      assert.close( z_y.dataset.z, 0, 1, "z_y data-z attribute" );
      assert.close( z_y.dataset.rotateX, 0, 1, "z_y data-rotate-x" );
      assert.close( z_y.dataset.rotateY, 0, 1, "z_y data-rotate-y" );
      assert.close( z_y.dataset.rotateZ, 90, 1, "z_y data-rotate-z" );

      assert.close( z_z.dataset.x, 0, 1, "z_z data-x attribute" );
      assert.close( z_z.dataset.y, 0, 1, "z_z data-y attribute" );
      assert.close( z_z.dataset.z, 500, 1, "z_z data-z attribute" );
      assert.close( z_z.dataset.rotateX, 0, 1, "z_z data-rotate-x" );
      assert.close( z_z.dataset.rotateY, 0, 1, "z_z data-rotate-y" );
      assert.close( z_z.dataset.rotateZ, 90, 1, "z_z data-rotate-z" );

      assert.close( reset.dataset.x, 100, 1, "reset data-x attribute" );
      assert.close( reset.dataset.y, 200, 1, "reset data-y attribute" );
      assert.close( reset.dataset.z, 800, 1, "reset data-z attribute" );
      assert.close( reset.dataset.rotateX, 0, 1, "reset data-rotate-x" );
      assert.close( reset.dataset.rotateY, 0, 1, "reset data-rotate-y" );
      assert.close( reset.dataset.rotateZ, 0, 1, "reset data-rotate-z" );

      done();
      console.log( "End padding test (sync)" );
    } )
  } ); // LoadIframe()
} );

