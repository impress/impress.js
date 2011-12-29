(function() {

    var _pfx = (function () {

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

    var $ = function(s) {
        return document.querySelector(s);
    };
    
    var $$ = function(selector){
        return [].slice.call(document.querySelectorAll(selector));
    };
    
    var impress = document.getElementById("impress");
    
    var canvas = document.getElementById("canvas");
    canvas.rotate = canvas.querySelector(".rotate");
    
    document.documentElement.style.height = "100%";
    
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    impress.style.position = "absolute";
    impress.style.top = "50%";
    impress.style.left = "50%";

    canvas.style["position"] = canvas.rotate.style["position"] = "absolute";
    canvas.style[_pfx("transformOrigin")] = canvas.rotate.style[_pfx("transformOrigin")] = "top left";
    canvas.style[_pfx("transition")] = canvas.rotate.style[_pfx("transition")] = "all 1s ease-in-out";
    
    canvas.dataset["x"] = "0";
    canvas.dataset["y"] = "0";
    canvas.dataset["rotate"] = "0";
    canvas.dataset["scale"] = "1";

    var current = canvas.dataset;

    var translate = function (x,y) { return " translate3d(" + x + "px," + y + "px, 0) "; }
    var rotate = function (a) { return " rotate(" + a + "deg) "; }
    var scale = function (s) { return " scale(" + s + ") "; }
    
    var steps = $$(".step");
        
    steps.forEach(function(el){
        var step = el.dataset;
        
        step.x = step.x || 0;
        step.y = step.y || 0;
        step.rotate = step.rotate || 0;
        step.scale = step.scale || 1;
        
        el.style["position"] = "absolute";
        el.style[_pfx("transform")] =  "translate(-50%,-50%)" +
                                 translate(step.x, step.y) +
                                 rotate(step.rotate) +
                                 scale(step.scale);
        
    });
    
    function select(el) {
        var step = el.dataset;

        if ($(".step.active")) {
            $(".step.active").classList.remove("active");
        }
        el.classList.add("active");

        impress.className = "step-" + el.id;
        
        var target = {
            rotate: -parseInt(step.rotate, 10),
            scale: 1 / parseFloat(step.scale)
        };
        
        target.x = -step.x;
        target.y = -step.y;

        canvas.style[ _pfx("transform") ] = scale(target.scale);
        canvas.style[ _pfx("transitionDelay") ] = (target.scale > current.scale ? "300ms" : "0");
        
        canvas.rotate.style[ _pfx("transform") ] = rotate(target.rotate) + translate(target.x, target.y);
        canvas.rotate.style[ _pfx("transformDelay") ] = (target.scale > current.scale ? "0" : "300ms");
        
        current["x"] = target["x"];
        current["y"] = target["y"];
        current["rotate"] = target["rotate"];
        current["scale"] = target["scale"];
    }
    
    document.addEventListener("keydown", function(event){
        if( event.keyCode == 32 || (event.keyCode >= 37 && event.keyCode <= 40) ) {
            var next = null;
            var active = document.querySelector(".step.active");
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
    
    select(steps[0]);
})();

