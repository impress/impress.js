/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Copyright 2011 Bartek Szopka (@bartaz)
 */

(function ( document, window ) {

    // HELPER FUNCTIONS
    
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
        }

    })();

    var arrayify = function ( a ) {
        return [].slice.call( a );
    };
    
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey != null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    }
    
    var $ = function ( selector, context ) {
        context = context || document;
        return context.querySelector(selector);
    };
    
    var $$ = function ( selector, context ) {
        context = context || document;
        return arrayify( context.querySelectorAll(selector) );
    };
    
    var translate = function ( t ) {
        return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
    };
    
    var rotate = function ( r, revert ) {
        var rX = " rotateX(" + r.x + "deg) ",
            rY = " rotateY(" + r.y + "deg) ",
            rZ = " rotatez(" + r.z + "deg) ";
        
        return revert ? rZ+rY+rX : rX+rY+rZ;
    };
    
    var scale = function ( s ) {
        return " scaleX(" + s.x + ") scaleY(" + s.y + ") scaleZ(" + s.z + ") ";
    }
    
    // CHECK SUPPORT
    
    var impressSupported = (pfx("perspective") != null);
    
    // DOM ELEMENTS
    
    var impress = document.getElementById("impress");
    
    if (!impressSupported) {
        impress.className = "impress-not-supported";
        return;
    } else {
        impress.className = "";
    }
    
    var canvas = document.createElement("div");
    canvas.className = "canvas";
    
    arrayify( impress.childNodes ).forEach(function ( el ) {
        canvas.appendChild( el );
    });
    impress.appendChild(canvas);
    
    var steps = $$(".step", impress);
    
    // SETUP
    // set initial values and defaults
    
    document.documentElement.style.height = "100%";
    
    css(document.body, {
        height: "100%",
        overflow: "hidden"
    });

    var props = {
        position: "absolute",
        transformOrigin: "top left",
        transition: "all 1s ease-in-out",
        transformStyle: "preserve-3d"
    }
    
    css(impress, props);
    css(impress, {
        top: "50%",
        left: "50%",
        perspective: "1000px"
    });
    css(canvas, props);
    
    var current = {
        translate: { x: 0, y: 0, z: 0 },
        rotate:    { x: 0, y: 0, z: 0 },
        scale:     { x: 1, y: 1, z: 1 }
    };

    steps.forEach(function ( el, idx ) {
        var data = el.dataset,
            step = {
                translate: {
                    x: data.x || 0,
                    y: data.y || 0,
                    z: data.z || 0
                },
                rotate: {
                    x: data.rotateX || 0,
                    y: data.rotateY || 0,
                    z: data.rotateZ || data.rotate || 0
                },
                scale: {
                    x: data.scaleX || data.scale || 1,
                    y: data.scaleY || data.scale || 1,
                    z: data.scaleZ || 1
                }
            };
        
        el.stepData = step;
        
        if ( !el.id ) {
            el.id = "step-" + idx;
        }
        
        css(el, {
            position: "absolute",
            transform: "translate(-50%,-50%)" +
                       translate(step.translate) +
                       rotate(step.rotate) +
                       scale(step.scale),
            transformStyle: "preserve-3d"
        });
        
    });

    // making given step active

    var select = function ( el ) {
        var step = el.stepData;

        if ( $(".step.active", impress) ) {
            $(".step.active", impress).classList.remove("active");
        }
        el.classList.add("active");

        impress.className = "step-" + el.id;
        
        var target = {
            rotate: {
                x: -parseInt(step.rotate.x, 10),
                y: -parseInt(step.rotate.y, 10),
                z: -parseInt(step.rotate.z, 10),
            },
            scale: {
                x: 1 / parseFloat(step.scale.x),
                y: 1 / parseFloat(step.scale.y),
                z: 1 / parseFloat(step.scale.z),
            },
            translate: {
                x: -step.translate.x,
                y: -step.translate.y,
                z: -step.translate.z
            }
        };

        var zoomin = target.scale.x >= current.scale.x;
        
        css(impress, {
            transform: scale(target.scale),
            transitionDelay: (zoomin ? "500ms" : "0ms")
        });
        
        css(canvas, {
            transform: rotate(target.rotate, true) + translate(target.translate),
            transitionDelay: (zoomin ? "0ms" : "500ms")
        });
        
        current = target;
    }
    
    // EVENTS
    
    document.addEventListener("keydown", function ( event ) {
        if ( event.keyCode == 9 || event.keyCode == 32 || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            var active = $(".step.active", impress);
            var next = active;
            switch( event.keyCode ) {
                case 37: ; // left
                case 38:   // up
                         next = steps.indexOf( active ) - 1;
                         next = next >= 0 ? steps[ next ] : steps[ steps.length-1 ];
                         break;
                case 9:  ; // tab
                case 32: ; // space
                case 39: ; // right
                case 40:   // down
                         next = steps.indexOf( active ) + 1;
                         next = next < steps.length ? steps[ next ] : steps[ 0 ];
                         break; 
            }
            
            select(next);
            
            event.preventDefault();
        }
    }, false);
    
    // Sometimes it's possible to trigger focus on first link with some keyboard action.
    // Browser in such a case tries to scroll the page to make this element visible
    // (even that body overflow is set to hidden) and it breaks our careful positioning.
    //
    // So, as a lousy (and lazy) workaround any scroll event will make the page scroll back to the top.
    //
    // If you are reading this and know any better way to handle it, I'll be glad to hear about it!
    window.addEventListener("scroll", function ( event ) {
        window.scrollTo(0, 0);
    }, false);
    
    // START 
    // by selecting first step of presentation
    select(steps[0]);

})(document, window);

