/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 *
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.3
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 */

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
    
    var byId = function ( id ) {
        return document.getElementById(id);
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
            rZ = " rotateZ(" + r.z + "deg) ";
        
        return revert ? rZ+rY+rX : rX+rY+rZ;
    };
    
    var scale = function ( s ) {
        return " scale(" + s + ") ";
    };
    
    var getElementFromUrl = function () {
        // get id from url # by removing `#` or `#/` from the beginning,
        // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
        return byId( window.location.hash.replace(/^#\/?/,"") );
    };
    
    // CHECK SUPPORT
    
    var ua = navigator.userAgent.toLowerCase();
    var impressSupported = ( pfx("perspective") != null ) &&
                           ( document.body.classList ) &&
                           ( document.body.dataset ) &&
                           ( ua.search(/(iphone)|(ipod)|(android)/) == -1 );
    
    var roots = {};
    
    var impress = window.impress = function ( rootId ) {

        rootId = rootId || "impress";
        
        // if already initialized just return the API
        if (roots["impress-root-" + rootId]) {
            return roots["impress-root-" + rootId];
        }
        
        // DOM ELEMENTS
        
        var root = byId( rootId );
        
        if (!impressSupported) {
            root.className = "impress-not-supported";
            return;
        } else {
            root.className = "";
        }
        
        // viewport updates for iPad
        var meta = $("meta[name='viewport']") || document.createElement("meta");
        // hardcoding these values looks pretty bad, as they kind of depend on the content
        // so they should be at least configurable
        meta.content = "width=1024, minimum-scale=0.75, maximum-scale=0.75, user-scalable=no";
        if (meta.parentNode != document.head) {
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        
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
        
        css(document.body, {
            height: "100%",
            overflow: "hidden"
        });

        var props = {
            position: "absolute",
            transformOrigin: "top left",
            transition: "all 0s ease-in-out",
            transformStyle: "preserve-3d"
        }
        
        css(root, props);
        css(root, {
            top: "50%",
            left: "50%",
            perspective: "1000px"
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
        }
        
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
                    scale: data.scale || 1,
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
        
        var goto = function ( el ) {
            if ( !isStep(el) || el == active) {
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
            }
            el.classList.add("active");
            
            root.className = "step-" + el.id;
            
            // `#/step-id` is used instead of `#step-id` to prevent default browser
            // scrolling to element in hash
            //
            // and it has to be set after animation finishes, because in chrome it
            // causes transtion being laggy
            window.clearTimeout( hashTimeout );
            hashTimeout = window.setTimeout(function () {
                window.location.hash = "#/" + el.id;
            }, 1000);
            
            var target = {
                rotate: {
                    x: -parseInt(step.rotate.x, 10),
                    y: -parseInt(step.rotate.y, 10),
                    z: -parseInt(step.rotate.z, 10)
                },
                translate: {
                    x: -step.translate.x,
                    y: -step.translate.y,
                    z: -step.translate.z
                },
                scale: 1 / parseFloat(step.scale)
            };
            
            // check if the transition is zooming in or not
            var zoomin = target.scale >= current.scale;
            
            // if presentation starts (nothing is active yet)
            // don't animate (set duration to 0)
            var duration = (active) ? "1s" : "0";
            
            css(root, {
                // to keep the perspective look similar for different scales
                // we need to 'scale' the perspective, too
                perspective: step.scale * 1000 + "px",
                transform: scale(target.scale),
                transitionDuration: duration,
                transitionDelay: (zoomin ? "500ms" : "0ms")
            });
            
            css(canvas, {
                transform: rotate(target.rotate, true) + translate(target.translate),
                transitionDuration: duration,
                transitionDelay: (zoomin ? "0ms" : "500ms")
            });
            
            current = target;
            active = el;
            
            return el;
        };
        
        var prev = function () {
            var prev = steps.indexOf( active ) - 1;
            prev = prev >= 0 ? steps[ prev ] : steps[ steps.length-1 ];
            
            return goto(prev);
        };
        
        var next = function () {
            var next = steps.indexOf( active ) + 1;
            next = next < steps.length ? steps[ next ] : steps[ 0 ];
            
            return goto(next);
        };
        
        window.addEventListener("hashchange", function () {
            goto( getElementFromUrl() );
        }, false);
        
        window.addEventListener("orientationchange", function () {
            window.scrollTo(0, 0);
        }, false);
        
        // START 
        // by selecting step defined in url or first step of the presentation
        goto(getElementFromUrl() || steps[0]);

        return (roots[ "impress-root-" + rootId ] = {
            goto: goto,
            next: next,
            prev: prev
        });

    }
})(document, window);

// EVENTS

(function ( document, window ) {
    'use strict';
    
    // keyboard navigation handler
    document.addEventListener("keydown", function ( event ) {
        if ( event.keyCode == 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            switch( event.keyCode ) {
                case 33: ; // pg up
                case 37: ; // left
                case 38:   // up
                         impress().prev();
                         break;
                case 9:  ; // tab
                case 32: ; // space
                case 34: ; // pg down
                case 39: ; // right
                case 40:   // down
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
        while ( (target.tagName != "A") &&
                (target != document.body) ) {
            target = target.parentNode;
        }
        
        if ( target.tagName == "A" ) {
            var href = target.getAttribute("href");
            
            // if it's a link to presentation step, target this step
            if ( href && href[0] == '#' ) {
                target = document.getElementById( href.slice(1) );
            }
        }
        
        if ( impress().goto(target) ) {
            event.stopImmediatePropagation();
            event.preventDefault();
        }
    }, false);
    
    // delegated handler for clicking on step elements
    document.addEventListener("click", function ( event ) {
        var target = event.target;
        // find closest step element
        while ( !target.classList.contains("step") &&
                (target != document.body) ) {
            target = target.parentNode;
        }
        
        if ( impress().goto(target) ) {
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
})(document, window);

