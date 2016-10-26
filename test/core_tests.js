(function() {
  var registerEventListener = function( target, eventType, callback ) {
    target.addEventListener( eventType, callback );
    return function removeRegisteredEventListener() {
      target.removeEventListener( eventType, callback );
    };
  };

  QUnit.begin(function() {
    impress().init();
  });

  QUnit.module( "Initialization" );

    QUnit.test( "Global Scope", function( assert ) {
      assert.expect( 1 );
      assert.ok( impress, "impress declared in global scope" );
    });

    QUnit.test( "Multiple API instantiation", function( assert ) {
      assert.expect( 0 );
      impress().init();
    });

    QUnit.test( "Support Markup", function( assert ) {
      assert.expect( 4 );

      var impressNotSupported = document.body.classList.contains( "impress-not-supported" );
      var impressSupported = document.body.classList.contains( "impress-supported" );
      assert.ok( impressSupported, "Have class .impress-supported" );
      assert.notOk( impressNotSupported, "Don't have class .impress-not-supported" );

      var impressDisabled = document.body.classList.contains( "impress-disabled" );
      var impressEnabled = document.body.classList.contains( "impress-enabled" );
      assert.ok( impressEnabled, "Have class .impress-enabled" );
      assert.notOk( impressDisabled, "Don't have class .impress-disabled" );
    });

    QUnit.test( "Attributes", function( assert ) {
      assert.expect( 10 );

      var actual, expected;
      var root = document.querySelector( "#impress" );
      var canvas = document.querySelector( "div#impress > div" );

      var canvasIsNotAStep = !canvas.classList.contains("step") && canvas.id === "";
      assert.ok( canvasIsNotAStep, "Canvas do not have step element data" );

      actual = canvas.style.webkitTransform || canvas.style.transform;
      expected = "rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(1000px, 0px, 0px)";
      assert.strictEqual( actual, expected, "canvas.style.transform initialized correctly" );

      // Normalize result for IE 11 and Safari.
      actual = canvas.style.webkitTransformOrigin || canvas.style.transformOrigin;
      expected = "left top 0px";

      if ( actual === "left top" || actual === "0% 0%" ) {
        actual = expected;
      }
      assert.strictEqual( actual, expected, "canvas.style.transformOrigin initialized correctly" );

      actual = canvas.style.webkitTransformStyle || canvas.style.transformStyle;
      expected = "preserve-3d";
      assert.strictEqual( actual, expected, "canvas.style.transformStyle initialized correctly" );

      actual = canvas.style.transitionDelay;
      expected = "0ms";
      assert.strictEqual( actual, expected, "canvas.style.transitionDelay initialized correctly" );

      actual = canvas.style.transitionDuration;
      expected = "0ms";
      assert.strictEqual( actual, expected, "canvas.style.transitionDuration initialized correctly" );

      actual = canvas.style.transitionProperty;
      expected = "all";
      assert.strictEqual( actual, expected, "canvas.style.transitionProperty initialized correctly" );

      actual = canvas.style.transitionTimingFunction;
      expected = "ease-in-out";
      assert.strictEqual( actual, expected, "canvas.style.transitionTimingFunction initialized correctly" );

      actual = root.style.perspective;
      expected = "";
      assert.notStrictEqual( actual, expected, "root.style.perspective should be set explicitly for IE 11" );

      actual = document.documentElement.style.height;
      expected = "100%";
      assert.strictEqual( actual, expected, "documentElement.style.height is 100%" );
    });

    QUnit.test( "Steps", function( assert ) {
      assert.expect( 2 );

      var actual, expected;
      var step1 = document.querySelector( "div#step-1" );

      actual = step1.style.position;
      expected = "absolute";
      assert.strictEqual( actual, expected, "Step position is 'absolute'" );

      assert.ok( step1.classList.contains( "active" ), "Step 1 has active css class." );
    });

  QUnit.module( "Core API" );

    QUnit.test( ".next()", function( assert ) {
      assert.expect( 2 );

      var root = document.querySelector( "div#impress" );
      var step1 = document.querySelector( "div#step-1" );
      var step2 = document.querySelector( "div#step-2" );
      var done = assert.async();

      impress().next();

      assert.ok( step2.classList.contains( "active" ), step2.id + " add active css class." );
      assert.notOk( step1.classList.contains( "active" ), step1.id + " remove active css class." );

      // Reset to original state
      var removeStepEnterEvent = registerEventListener( root, "impress:stepenter",  function() {
        removeStepEnterEvent();
        done();
      });
      impress().goto( step1 );
    });

    QUnit.test( "impress:stepenter event", function( assert ) {
      assert.expect( 4 );

      var actual, expected;
      var root = document.querySelector( "div#impress" );
      var step1 = document.querySelector( "div#step-1" );
      var step2 = document.querySelector( "div#step-2" );
      var done = assert.async();

      var removeTestEvent = registerEventListener( root, "impress:stepenter",  function( event ) {
        actual = event.target;
        expected = step2;
        assert.strictEqual( actual, expected, "Triggered event for the second step" );

        assert.ok( step2.classList.contains( "present" ), event.target.id + " add present css class" );
        assert.notOk( step2.classList.contains( "future" ), event.target.id + " remove future css class" );
        assert.notOk( step2.classList.contains( "past" ), event.target.id + " remove active css class." );

        removeTestEvent();

        // Reset to original state
        var removeCleanupEvent = registerEventListener( root, "impress:stepenter",  function() {
          removeCleanupEvent();
          done();
        });

        impress().goto( step1 );
      });

      impress().next();
    });

  QUnit.done(function( details ) {
    // Impress.js will set the hash part of the url, we want to unset it when finished
    // Otherwise a refresh of browser page would not start tests from the last step step
    window.location.hash = "";
    // Add back vertical scrollbar so we can read results if there were failures.
    document.body.style.overflow = 'auto';
  });
}());
