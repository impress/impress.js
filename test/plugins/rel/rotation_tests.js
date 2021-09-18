QUnit.module( "rel plugin rotation tests" );

QUnit.test( "rotation_relative", function( assert ) {
  window.console.log( "Begin rotation_relative" );
  var done = assert.async();

  loadIframe( "test/plugins/rel/rotation_tests_presentation.html", assert, function() {
    initPresentation( assert, function() {
      var iframe = document.getElementById( "presentation-iframe" );
      var iframeDoc = iframe.contentDocument;

      var root  = iframeDoc.querySelector( "div#impress" );
      var step1 = iframeDoc.querySelector( "div#step-1" );
      var step2 = iframeDoc.querySelector( "div#step-2" );
      var step3 = iframeDoc.querySelector( "div#step-3" );
      var step4 = iframeDoc.querySelector( "div#step-4" );
      var step5 = iframeDoc.querySelector( "div#step-5" );
      var step6 = iframeDoc.querySelector( "div#step-6" );
      var step7 = iframeDoc.querySelector( "div#step-7" );
      var step8 = iframeDoc.querySelector( "div#step-8" );
      var reset = iframeDoc.querySelector( "div#reset" );
      var rotate = iframeDoc.querySelector( "div#rotate" );

      assert.close( step1.dataset.x, 0, 1, "step-1 data-x attribute" );
      assert.close( step1.dataset.y, 0, 1, "step-1 data-y attribute" );
      assert.close( step1.dataset.z, 0, 1, "step-1 data-z attribute" );
      assert.close( step1.dataset.rotateX, 0, 1, "step-1 data-rotate-x" );
      assert.close( step1.dataset.rotateY, 0, 1, "step-1 data-rotate-y" );
      assert.close( step1.dataset.rotateZ, 0, 1, "step-1 data-rotate-z" );

      assert.close( step2.dataset.x, 854, 1, "step-2 data-x attribute" );
      assert.close( step2.dataset.y, -125, 1, "step-2 data-y attribute" );
      assert.close( step2.dataset.z, -354, 1, "step-2 data-z attribute" );
      assert.close( step2.dataset.rotateX, 0, 1, "step-2 data-rotate-x attribute" );
      assert.close( step2.dataset.rotateY, 45, 1, "step-2 data-rotate-y attribute" );
      assert.close( step2.dataset.rotateZ, 0, 1, "step-2 data-rotate-z attribute" );

      assert.close( step3.dataset.x, 1208, 1, "step-3 data-x attribute" );
      assert.close( step3.dataset.y, -250, 1, "step-3 data-y attribute" );
      assert.close( step3.dataset.z, -1208, 1, "step-3 data-z attribute" );
      assert.close( step3.dataset.rotateX, 0, 1, "step-3 data-rotate-x attribute" );
      assert.close( step3.dataset.rotateY, 90, 1, "step-3 data-rotate-y attribute" );
      assert.close( step3.dataset.rotateZ, 0, 1, "step-3 data-rotate-z attribute" );

      assert.close( step4.dataset.x, 854, 1, "step-4 data-x attribute" );
      assert.close( step4.dataset.y, -375, 1, "step-4 data-y attribute" );
      assert.close( step4.dataset.z, -2062, 1, "step-4 data-z attribute" );
      assert.close( step4.dataset.rotateX, 0, 1, "step-4 data-rotate-x" );
      assert.close( step4.dataset.rotateY, 135, 1, "step-4 data-rotate-y" );
      assert.close( step4.dataset.rotateZ, 0, 1, "step-4 data-rotate-z" );

      assert.close( step5.dataset.x, 0, 1, "step-5 data-x attribute" );
      assert.close( step5.dataset.y, -500, 1, "step-5 data-y attribute" );
      assert.close( step5.dataset.z, -2416, 1, "step-5 data-z attribute" );
      assert.close( step5.dataset.rotateX, 0, 1, "step-5 data-rotate-x" );
      assert.close( step5.dataset.rotateY, 180, 1, "step-5 data-rotate-y" );
      assert.close( step5.dataset.rotateZ, 0, 1, "step-5 data-rotate-z" );

      assert.close( step6.dataset.x, -854, 1, "step-6 data-x attribute" );
      assert.close( step6.dataset.y, -375, 1, "step-6 data-y attribute" );
      assert.close( step6.dataset.z, -2062, 1, "step-6 data-z attribute" );
      assert.close( step6.dataset.rotateX, 0, 1, "step-6 data-rotate-x" );
      assert.close( step6.dataset.rotateY, 225, 1, "step-6 data-rotate-y" );
      assert.close( step6.dataset.rotateZ, 0, 1, "step-6 data-rotate-z" );

      assert.close( step7.dataset.x, -1208, 1, "step-7 data-x attribute" );
      assert.close( step7.dataset.y, -250, 1, "step-7 data-y attribute" );
      assert.close( step7.dataset.z, -1208, 1, "step-7 data-z attribute" );
      assert.close( step7.dataset.rotateX, 0, 1, "step-7 data-rotate-x attribute" );
      assert.close( step7.dataset.rotateY, 270, 1, "step-7 data-rotate-y attribute" );
      assert.close( step7.dataset.rotateZ, 0, 1, "step-7 data-rotate-z attribute" );

      assert.close( step8.dataset.x, -854, 1, "step-8 data-x attribute" );
      assert.close( step8.dataset.y, -125, 1, "step-8 data-y attribute" );
      assert.close( step8.dataset.z, -354, 1, "step-8 data-z attribute" );
      assert.close( step8.dataset.rotateX, 0, 1, "step-8 data-rotate-x attribute" );
      assert.close( step8.dataset.rotateY, 315, 1, "step-8 data-rotate-y attribute" );
      assert.close( step8.dataset.rotateZ, 0, 1, "step-8 data-rotate-z attribute" );

      assert.equal( reset.dataset.x, 0, "reset data-x attribute" );
      assert.equal( reset.dataset.y, 0, "reset data-y attribute" );
      assert.equal( reset.dataset.z, 0, "reset data-z attribute" );
      assert.equal( reset.dataset.rotateX, 0, "reset data-rotate-x" );
      assert.equal( reset.dataset.rotateY, 0, "reset data-rotate-y" );
      assert.equal( reset.dataset.rotateZ, 0, "reset data-rotate-z" );
      assert.equal( reset.dataset.rotateOrder, "zyx", "reset data-rotate-order" );

      assert.equal( rotate.dataset.x, 0, "rotate data-x attribute" );
      assert.equal( rotate.dataset.y, 0, "rotate data-y attribute" );
      assert.equal( rotate.dataset.z, 0, "rotate data-z attribute" );
      assert.equal( rotate.dataset.rotateX, 0, "rotate data-rotate-x" );
      assert.equal( rotate.dataset.rotateY, 0, "rotate data-rotate-y" );
      assert.equal( rotate.dataset.rotateZ, 123, "rotate data-rotate-z" );
      assert.equal( rotate.dataset.rotateOrder, "xyz", "rotate data-rotate-order" );

      done();
      console.log( "End rotation test (sync)" );
    } )
  } ); // LoadIframe()
} );

