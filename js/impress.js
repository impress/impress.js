(function ( document ) {

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
        return [].slice.call( context.querySelectorAll(selector) );
    };
    
    var translate = function (x,y) { return " translate3d(" + x + "px," + y + "px, 0) "; }
    var rotate = function (a) { return " rotate(" + a + "deg) "; }
    var scale = function (s) { return " scale(" + s + ") "; }
    
    // DOM ELEMENTS
    
    var impress = document.getElementById("impress");
    var canvas = $(".canvas", impress);
    
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
        top: "50%",
        left: "50%",
        transformOrigin: "top left",
        transition: "all 1s ease-in-out"
    }
    
    css(impress, props);
    css(canvas, props);
    
    var current = {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1
    };

    steps.forEach(function ( el, idx ) {
        var step = el.dataset;
        
        step.x = step.x || 0;
        step.y = step.y || 0;
        step.rotate = step.rotate || 0;
        step.scale = step.scale || 1;
        
        if ( !el.id ) {
            el.id = "step-" + idx;
        }
        
        css(el, {
            position: "absolute",
            transform: "translate(-50%,-50%)" +
                       translate(step.x, step.y) +
                       rotate(step.rotate) +
                       scale(step.scale)
        });
        
    });

    // making given step active

    var select = function ( el ) {
        var step = el.dataset;

        if ( $(".step.active", impress) ) {
            $(".step.active", impress).classList.remove("active");
        }
        el.classList.add("active");

        impress.className = "step-" + el.id;
        
        var target = {
            rotate: -parseInt(step.rotate, 10),
            scale: 1 / parseFloat(step.scale),
            x: -step.x,
            y: -step.y
        };

        css(impress, {
            transform: scale(target.scale),
            transitionDelay: (target.scale > current.scale ? "300ms" : "0")
        });
        
        css(canvas, {
            transform: rotate(target.rotate) + translate(target.x, target.y),
            transformDelay: (target.scale > current.scale ? "0" : "300ms")
        });
        
        current = target;
    }
    
    // EVENTS
    
    document.addEventListener("keydown", function ( event ) {
        if( event.keyCode == 32 || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            var next = null;
            var active = $(".step.active", impress);
            switch( event.keyCode ) {
                case 37: ; // left
                case 38:   // up
                         next = steps.indexOf( active ) - 1;
                         next = next >= 0 ? steps[ next ] : steps[ steps.length-1 ];
                         break; 
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
    
    // START 
    // by selecting first step of presentation
    select(steps[0]);

})(document);

