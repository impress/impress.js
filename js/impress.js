/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.4.1
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 */

/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, latedef:true, newcap:true,
         noarg:true, noempty:true, undef:true, strict:true, browser:true */

(function ( document, window ) {
    'use strict';

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
        };

    })();

    var arrayify = function ( a ) {
        return [].slice.call( a );
    };
    
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };
    
    var toNumber = function (numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };
    
    var byId = function ( id ) {
        return document.getElementById(id);
    };
    
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
            rZ = " rotateZ(" + r.z + "deg) ";
        
        return revert ? rZ+rY+rX : rX+rY+rZ;
    };
    
    var scale = function ( s ) {
        return " scale(" + s + ") ";
    };
    
    var perspective = function ( p ) {
        return " perspective(" + p + "px) ";
    };
    
    var getElementFromUrl = function () {
        // get id from url # by removing `#` or `#/` from the beginning,
        // so both `#slide-id` and "legacy" `#/slide-id` will work
        return byId( window.location.hash.replace(/^#\/?/,"") );
    };
    
    // CHECK SUPPORT
    var body = document.body;
    
    var ua = navigator.userAgent.toLowerCase();
    var impressSupported = ( pfx("perspective") !== null ) &&
                           ( body.classList ) &&
                           ( body.dataset ) &&
                           ( ua.search(/(iphone)|(ipod)|(android)/) === -1 );
    
    if (!impressSupported) {
        // we can't be sure that `classList` is supported
        body.className += " impress-not-supported ";
    } else {
        body.classList.remove("impress-not-supported");
        body.classList.add("impress-supported");
    }
    
    var roots = {};
    
    var defaults = {
        width: 1024,
        height: 768,
        maxScale: 1,
        minScale: 0,
        
        perspective: 1000,
        
        transitionDuration: 1000
    };
    
    var impress = window.impress = function ( rootId ) {
        
        if (!impressSupported) {
            return null;
        }
        
        rootId = rootId || "impress";
        
        // if already initialized just return the API
        if (roots["impress-root-" + rootId]) {
            return roots["impress-root-" + rootId];
        }
        
        // DOM ELEMENTS
        
        var root = byId( rootId );
        
        // viewport updates for iPad
        var meta = $("meta[name='viewport']") || document.createElement("meta");
        // hardcoding these values looks pretty bad, as they kind of depend on the content
        // so they should be at least configurable
        meta.content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no";
        if (meta.parentNode !== document.head) {
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        
        // initialize configuration object
        var rootData = root.dataset;
        var config = {
            width: toNumber(rootData.width,    defaults.width),
            height: toNumber(rootData.height,   defaults.height),
            maxScale: toNumber(rootData.maxScale, defaults.maxScale),
            minScale: toNumber(rootData.minScale, defaults.minScale),
            
            perspective: toNumber(rootData.perspective, defaults.perspective),
            
            transitionDuration: toNumber(rootData.transitionDuration, defaults.transitionDuration)
        };
        
        var canvas = document.createElement("div");
        canvas.className = "canvas";
        
        arrayify( root.childNodes ).forEach(function ( el ) {
            canvas.appendChild( el );
        });
        root.appendChild(canvas);
        
        var steps = $$(".step", root);
        
        // SETUP
        // set initial values and defaults
        
        document.documentElement.style.height = "100%";
        
        css(body, {
            height: "100%",
            overflow: "hidden"
        });

        var props = {
            position: "absolute",
            transformOrigin: "top left",
            transition: "all 0s ease-in-out",
            transformStyle: "preserve-3d"
        };
        
        css(root, props);
        css(root, {
            top: "50%",
            left: "50%",
            transform: perspective( config.perspective )
        });
        css(canvas, props);
        
        var current = {
            translate: { x: 0, y: 0, z: 0 },
            rotate:    { x: 0, y: 0, z: 0 },
            scale:     1
        };

        var stepData = {};
        
        var isStep = function ( el ) {
            return !!(el && el.id && stepData["impress-" + el.id]);
        };
        
        var computeWindowScale = function () {
            var hScale = window.innerHeight / config.height,
                wScale = window.innerWidth / config.width,
                scale = hScale > wScale ? wScale : hScale;
            
            if (config.maxScale && scale > config.maxScale) {
                scale = config.maxScale;
            }
            
            if (config.minScale && scale < config.minScale) {
                scale = config.minScale;
            }
            
            return scale;
        };
        
        steps.forEach(function ( el, idx ) {
            var data = el.dataset,
                step = {
                    translate: {
                        x: toNumber(data.x),
                        y: toNumber(data.y),
                        z: toNumber(data.z)
                    },
                    rotate: {
                        x: toNumber(data.rotateX),
                        y: toNumber(data.rotateY),
                        z: toNumber(data.rotateZ || data.rotate)
                    },
                    scale: toNumber(data.scale, 1),
                    el: el
                };
            
            if ( !el.id ) {
                el.id = "step-" + (idx + 1);
            }
            
            stepData["impress-" + el.id] = step;
            
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

        var active = null;
        var hashTimeout = null;
        
        var windowScale = computeWindowScale();
        
        var stepTo = function ( el, force ) {
            if ( !isStep(el) || (el === active && !force) ) {
                // selected element is not defined as step or is already active
                return false;
            }
            
            // Sometimes it's possible to trigger focus on first link with some keyboard action.
            // Browser in such a case tries to scroll the page to make this element visible
            // (even that body overflow is set to hidden) and it breaks our careful positioning.
            //
            // So, as a lousy (and lazy) workaround we will make the page scroll back to the top
            // whenever slide is selected
            //
            // If you are reading this and know any better way to handle it, I'll be glad to hear about it!
            window.scrollTo(0, 0);
            
            var step = stepData["impress-" + el.id];
            
            if ( active ) {
                active.classList.remove("active");
                body.classList.remove("impress-on-" + active.id);
            }
            el.classList.add("active");
            
            body.classList.add("impress-on-" + el.id);
            
            // Setting fragment URL with `history.pushState`
            // and it has to be set after animation finishes, because in Chrome it
            // causes transtion being laggy
            // BUG: http://code.google.com/p/chromium/issues/detail?id=62820
            window.clearTimeout( hashTimeout );
            hashTimeout = window.setTimeout(function () {
                window.location.hash = "#/" + el.id;
            }, config.transitionDuration);
            
            var target = {
                rotate: {
                    x: -step.rotate.x,
                    y: -step.rotate.y,
                    z: -step.rotate.z
                },
                translate: {
                    x: -step.translate.x,
                    y: -step.translate.y,
                    z: -step.translate.z
                },
                scale: 1 / step.scale
            };
            
            // check if the transition is zooming in or not
            var zoomin = target.scale >= current.scale;
            
            // if presentation starts (nothing is active yet)
            // don't animate (set duration to 0)
            var duration = (active) ? config.transitionDuration + "ms" : "0ms",
                delay = (config.transitionDuration / 2) + "ms";
            
            if (force) {
                windowScale = computeWindowScale();
            }
            
            var targetScale = target.scale * windowScale;
            
            css(root, {
                // to keep the perspective look similar for different scales
                // we need to 'scale' the perspective, too
                transform: perspective( config.perspective / targetScale ) + scale( targetScale ),
                transitionDuration: duration,
                transitionDelay: (zoomin ? delay : "0ms")
            });
            
            css(canvas, {
                transform: rotate(target.rotate, true) + translate(target.translate),
                transitionDuration: duration,
                transitionDelay: (zoomin ? "0ms" : delay)
            });
            
            current = target;
            active = el;
            
            return el;
        };
        
        var prev = function () {
            var prev = steps.indexOf( active ) - 1;
            prev = prev >= 0 ? steps[ prev ] : steps[ steps.length-1 ];
            
            return stepTo(prev);
        };
        
        var next = function () {
            var next = steps.indexOf( active ) + 1;
            next = next < steps.length ? steps[ next ] : steps[ 0 ];
            
            return stepTo(next);
        };
        
        window.addEventListener("hashchange", function () {
            stepTo( getElementFromUrl() );
        }, false);
        
        window.addEventListener("orientationchange", function () {
            window.scrollTo(0, 0);
        }, false);
        
        // START 
        // by selecting step defined in url or first step of the presentation
        stepTo(getElementFromUrl() || steps[0]);

        return (roots[ "impress-root-" + rootId ] = {
            stepTo: stepTo,
            next: next,
            prev: prev
        });

    };
    
    impress.supported = impressSupported;
    
})(document, window);

// EVENTS

(function ( document, window ) {
    'use strict';
    
    var impress = window.impress;
    
    // if impress is not supported don't add any handlers
    if (!impress.supported) {
        return;
    }
    
    // throttling function calls, by Remy Sharp
    // http://remysharp.com/2010/07/21/throttling-function-calls/
    var throttle = function (fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    };
    
    // keyboard navigation handlers
    
    // prevent default keydown action when one of supported key is pressed
    document.addEventListener("keydown", function ( event ) {
        if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            event.preventDefault();
        }
    }, false);
    
    // trigger impress action on keyup
    document.addEventListener("keyup", function ( event ) {
        if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            switch( event.keyCode ) {
                case 33: // pg up
                case 37: // left
                case 38: // up
                         impress().prev();
                         break;
                case 9:  // tab
                case 32: // space
                case 34: // pg down
                case 39: // right
                case 40: // down
                         impress().next();
                         break;
            }
            
            event.preventDefault();
        }
    }, false);
    
    // delegated handler for clicking on the links to presentation steps
    document.addEventListener("click", function ( event ) {
        // event delegation with "bubbling"
        // check if event target (or any of its parents is a link)
        var target = event.target;
        while ( (target.tagName !== "A") &&
                (target !== document.documentElement) ) {
            target = target.parentNode;
        }
        
        if ( target.tagName === "A" ) {
            var href = target.getAttribute("href");
            
            // if it's a link to presentation step, target this step
            if ( href && href[0] === '#' ) {
                target = document.getElementById( href.slice(1) );
            }
        }
        
        if ( impress().stepTo(target) ) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    }, false);
    
    // delegated handler for clicking on step elements
    document.addEventListener("click", function ( event ) {
        var target = event.target;
        // find closest step element
        while ( !target.classList.contains("step") &&
                (target !== document.documentElement) ) {
            target = target.parentNode;
        }
        
        if ( impress().stepTo(target) ) {
            event.preventDefault();
        }
    }, false);
    
    // touch handler to detect taps on the left and right side of the screen
    document.addEventListener("touchstart", function ( event ) {
        if (event.touches.length === 1) {
            var x = event.touches[0].clientX,
                width = window.innerWidth * 0.3,
                result = null;
                
            if ( x < width ) {
                result = impress().prev();
            } else if ( x > window.innerWidth - width ) {
                result = impress().next();
            }
            
            if (result) {
                event.preventDefault();
            }
        }
    }, false);
    
    // rescale presentation when window is resized
    window.addEventListener("resize", throttle(function () {
        // force going to active step again, to trigger rescaling
        impress().stepTo( document.querySelector(".active"), true );
    }, 250), false);
})(document, window);

