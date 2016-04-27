QUnit.begin(function( details ) {
  // In case tests didn't complete, we are left with a hash/anchor pointing somewhere. But we want to start from scratch:
  window.location.hash = "";    
});

QUnit.test( "Initialize Impress.js", function( assert ) {
  assert.ok( impress, 
             "impress declared in global scope" );
  assert.strictEqual( impress().init(), undefined,
                    "impress().init() called." );
  assert.strictEqual( impress().init(), undefined,
                    "It's ok to call impress().init() a second time, it's a no-op." );
  var notSupportedClass = document.body.classList.contains("impress-not-supported");
  var yesSupportedClass = document.body.classList.contains("impress-supported");
  if ( !_impressSupported() ) {
    assert.ok( notSupportedClass,
               "body.impress-not-supported class still there." );
    assert.ok( !yesSupportedClass,
               "body.impress-supported class was NOT added." );
  } else {
    assert.ok( !notSupportedClass,
               "body.impress-not-supported class was removed." );
    assert.ok( yesSupportedClass,
               "body.impress-supported class was added." );
               
    // To be pedantic, we run the rest of these tests inside the else 
    // brackets as well, meaning that impress.js is tested to be supported.
    // However, other QUnit.test() blocks than this will fail miserably if it
    // weren't supported.
    assert.ok( !document.body.classList.contains("impress-disabled"),
               "body.impress-disabled is removed." );
    assert.ok( document.body.classList.contains("impress-enabled"),
               "body.impress-enabled is added." );
    
    var canvas = document.querySelector( "div#impress > div" );
    assert.ok( !canvas.classList.contains("step") && canvas.id === "",
               "Additional 'canvas' div inserted between div#impress root and steps." );
    assert.equal( canvas.style.transform,
                  "rotateZ(0deg) rotateY(0deg) rotateX(0deg) translate3d(1000px, 0px, 0px)",
                  "canvas.style.transform initialized correctly" );
    assert.equal( canvas.style.transformOrigin,
                  "left top 0px",
                  "canvas.style.transformOrigin initialized correctly" );
    assert.equal( canvas.style.transformStyle,
                  "preserve-3d",
                  "canvas.style.transformStyle initialized correctly" );
    assert.equal( canvas.style.transitionDelay,
                  "0ms",
                  "canvas.style.transitionDelay initialized correctly" );
    // impress.js default values tries to set this to 1000ms, I'm completely confused about why that's not actually set in the browser?
    assert.equal( canvas.style.transitionDuration,
                  "0ms",
                  "canvas.style.transitionDuration initialized correctly" );
    assert.equal( canvas.style.transitionProperty,
                  "all",
                  "canvas.style.transitionProperty initialized correctly" );
    assert.equal( canvas.style.transitionTimingFunction,
                  "ease-in-out",
                  "canvas.style.transitionTimingFunction initialized correctly" );
                  
    assert.equal( document.documentElement.style.height,
                  "100%",
                  "documentElement.style.height is 100%" );
    
    // Steps initialization
    var step1 = document.querySelector( "div#step-1" );
    assert.equal( step1.style.position,
                  "absolute",
                  "Step position is 'absolute'." );

    assert.ok( step1.classList.contains("active"),
               "Step 1 has active css class." );
  }
});

// Note: Here we focus on testing the core functionality of moving between
// steps, the css classes set and unset, and events triggered.
// TODO: more complex animations and check position, transitions, delays, etc...
// Those need to be separate html files, and there could be several of them.
//
// For now this just contains a single transition in order to get QUnit committed.
// Complete test coverage needs to be added later.
QUnit.test( "Impress Core API - Work in progress", function( assert ) {
  // impress.js itself uses event listeners to manipulate most CSS classes. 
  // Wait a short while before checking, to avoid race. 
  // (See assertStepEnterWrapper and assertStepLeaveWrapper.)
  var wait = 5; // milliseconds

  var done = assert.async();
  var step1 = document.querySelector( "div#step-1" );
  var step2 = document.querySelector( "div#step-2" );
  var root  = document.querySelector( "div#impress" );

  // Things to check on impress:stepenter event -----------------------------//
  var assertStepEnter = function( event ) {
    assert.equal( event.target, step2,
                  event.target.id + " triggered impress:stepenter event." );
    assert.ok( step2.classList.contains("present"),
               event.target.id + " set present css class." );
    assert.ok( !step2.classList.contains("future"),
               event.target.id + " unset future css class." );
    assert.ok( !step2.classList.contains("past"),
               event.target.id + " unset past css class." );
    done();
  };
  
  root.addEventListener( "impress:stepenter",  function(event) { 
                                                   setTimeout( function() { assertStepEnter( event ) }, wait );
                                               } 
  );

  // Do no-op tests first, then trigger a transition. //

  assert.strictEqual( impress().goto(document.querySelector( "div#impress" )),
                    false,
                    "goto() to a non-step element fails, as it should." );
  assert.strictEqual( impress().goto(),
                    false,
                    "goto(<nothing>) fails, as it should." );

  assert.ok( impress().next(),
             "next() called and returns ok (1->2)" );
  assert.ok( step2.classList.contains("active"),
             step2.id + " set active css class." );
  assert.ok( !step1.classList.contains("active"),
             step1.id + " unset active css class." );      
});


// Cleanup
QUnit.done(function( details ) {
  // Impress.js will set the hash part of the url, we want to unset it when finished
  // Otherwise a refresh of browser page would not start tests from step 1
  window.location.hash = "";    
  // Add back vertical scrollbar so we can read results if there were failures. 
  document.body.style.overflow = 'auto';
});

