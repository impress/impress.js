(function ( document, window ) {
	'use strict';
	
	// `arraify` takes an array-like object and turns it into real Array
    // to make all the Array.prototype goodness available.
    var arrayify = function ( a ) {
        return [].slice.call( a );
    };
	
	// `$$` return an array of elements for given CSS `selector` in the `context` of
    // the given element or whole document.
    var $$ = function ( selector, context ) {
        context = context || document;
        return arrayify( context.querySelectorAll(selector) );
    };
	
	// `pfx` is a function that takes a standard CSS property name as a parameter
    // and returns it's prefixed version valid for current browser it runs in.
    // The code is heavily inspired by Modernizr http://www.modernizr.com/
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

	
	// `translate` builds a translate transform string for given data.
    var translate = function ( t, unit ) {
    	unit = (unit === undefined) ? "px" : unit;
        return " translate3d(" + t.x + unit +"," + t.y + unit +"," + t.z + unit +") ";
    };
    
    // `rotate` builds a rotate transform string for given data.
    // By default the rotations are in X Y Z order that can be reverted by passing `true`
    // as second parameter.
    var rotate = function ( r, revert ) {
        var rX = " rotateX(" + r.x + "deg) ",
            rY = " rotateY(" + r.y + "deg) ",
            rZ = " rotateZ(" + r.z + "deg) ";
        
        return revert ? rZ+rY+rX : rX+rY+rZ;
    };
    
    // `scale` builds a scale transform string for given data.
    var scale = function ( s ) {
        return " scale(" + s + ") ";
    };
	
	// `css` function applies the styles given in `props` object to the element
    // given as `el`. It runs all property names through `pfx` function to make
    // sure proper prefixed version of the property is used.
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
    
    // `toNumber` takes a value given as `numeric` parameter and tries to turn
    // it into a number. If it is not possible it returns 0 (or other value
    // given as `fallback`).
    var toNumber = function (numeric, fallback) {
        return isNaN(numeric) ? (fallback || 0) : Number(numeric);
    };
	
	var animationData = {};
	
	var animationInit = function(step, data) {
		animationData["impress-animation-" + step.id] = data;
	};
	
	var isSubstep = function(step) {
    	return step.classList.contains("substep");
    };
	
	var animationPresent = function(step, play) {
		var animData = animationData["impress-animation-" + step.id];
		var duration = (play) ? animData.present.duration : 0;
		var moveCenter = (isSubstep(step)) ? "" : "translate(-50%,-50%) ";
		css(step, {
            transform: moveCenter +
	        	translate(animData.origin.translate) +
				translate(animData.present.translate, "") +
				rotate(animData.origin.rotate) +
				rotate(animData.present.rotate) +
				scale(animData.origin.scale) +
				scale(animData.present.scale),
			transition: "all " + duration + "ms",
            transitionDelay: animData.present.delay + "ms"
        });
	};
	
	var animationPast = function(step, play) {
		var animData = animationData["impress-animation-" + step.id];
		var duration = (play) ? animData.past.duration : 0;
		var moveCenter = (isSubstep(step)) ? "translate3d(0px,0px,0px) " : "translate(-50%,-50%) ";
		css(step, {
            transform: moveCenter +
            	translate(animData.origin.translate) +
				translate(animData.past.translate, "") +
				rotate(animData.origin.rotate) +
				rotate(animData.past.rotate) +
				scale(animData.origin.scale) +
				scale(animData.past.scale),
			transition: "all " + duration + "ms",
            transitionDelay: animData.past.delay + "ms"
        });
	};
	
	var animationFuture = function(step, play) {
		var animData = animationData["impress-animation-" + step.id];
		var duration = (play) ? animData.future.duration : 0;
		var moveCenter = (isSubstep(step)) ? "" : "translate(-50%,-50%) ";
		css(step, {
            transform: moveCenter +
            	translate(animData.origin.translate) +
				translate(animData.future.translate, "") +
				rotate(animData.origin.rotate) +
				rotate(animData.future.rotate) +
				scale(animData.origin.scale) +
				scale(animData.future.scale),
			transition: "all " + duration + "ms",
            transitionDelay: animData.future.delay + "ms"
        });
	};
	
	var getStepData = function(step) {
		var data = step.dataset;
		var stepData = {
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
            duration: 1000,
            delay: 0,
		};
		return stepData;
	};
	
	var copyStepData = function(stepDataSource) {
		var stepData = {
            translate: {
                x: stepDataSource.translate.x,
                y: stepDataSource.translate.y,
                z: stepDataSource.translate.z
            },
            rotate: {
                x: stepDataSource.rotate.x,
                y: stepDataSource.rotate.y,
                z: stepDataSource.rotate.z
            },
            scale: stepDataSource.scale,
            duration: stepDataSource.duration,
		};
		return stepData;
	};
	
	var getBasicAnimData = function(step) {
		var stepData = getStepData(step);
		var animData = {
			origin : stepData,
			present : copyStepData(stepData),
			past : copyStepData(stepData),
			future : copyStepData(stepData),
        };
		return animData;
	};
	
	var animations = {
		"slide_left" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.x = "100%";
			return animData;
		},
		"slide_right" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.x = "-100%"; 
			return animData;
		},
		"slide_left_right" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.x = "100%";
			animData.past.translate.x = "-100%";
			return animData;
		},
		"slide_up" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.y = "100%"; 
			return animData;
		},
		"slide_down" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.y = "-100%"; 
			return animData;
		},
		"slide_through" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.translate.x = "-100%";
			animData.past.translate.x = "100%"; 
			return animData;
		},
		"upside_down_rotate_counter" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.z = 180;
			return animData;
		},
		"upside_down_rotate" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.z = 180;
			return animData;
		},
		"upside_down_flip" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.x = 180; 
			return animData;
		},
		"upside_down_flip_counter" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.x = 180; 
			return animData;
		},
		"swing_left" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.y = 90;
			animData.future.translate.z = "100px";
			return animData;
		},
		"swing_right" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.y = -90;
			animData.future.translate.z = "100px";
			return animData;
		},
		"swing_up" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.x = 90;
			animData.future.translate.z = "100px";
			return animData;
		},
		"swing_down" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.x = -90;
			animData.future.translate.z = "100px";
			return animData;
		},
		"spin_inner" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.z = 360;
			animData.future.scale = 0.25;
			return animData;
		},
		"spin_outer" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.z = 360;
			animData.future.scale = 4;
			return animData;
		},
		"slow_entrance" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.scale = 8;
			animData.future.translate.z = "300px";
			animData.present.duration = 4000;
			return animData;
		},
		"spin_through" : function(step) {
			var animData = getBasicAnimData(step);
			animData.future.rotate.z = 180;
			animData.future.translate.y = "-100%";
			animData.future.translate.x = "100%";
			animData.past.rotate.z = -180;
			animData.past.translate.y = "100%";
			animData.past.translate.x = "-100%";
			animData.past.duration = 4000;
			animData.present.duration = 4000;
			return animData;
		},
	};
	
	var processAnimations = function (step, event, forward, play) {
		var dataset = step.dataset;
		var animation = dataset.animation;
		if (animation === undefined) {
			return;
		}
		var animation = dataset.animation;
		switch (event) {
			case "init": {
				animationInit(step, animations[animation](step));
				animationFuture(step, false);
				break;
			}
			case "enter": {
				animationPresent(step, play);
				break;
			}
			case "leave": {
				if (forward) {
					animationPast(step, play);
				} else {
					animationFuture(step, play);
				}
				
				break;
			}
		};
	};
	
	var playSounds = function(selector, context) {
    	context = (context === undefined) ? document : context;
    	var sounds = $$(selector, context);
    	sounds.forEach(function(sound) {
    		sound.play();
    	});
    };
	
	var processSounds = function (step, event, play) {
		if (! play) {
			return;
		}
		switch (event) {
			case "enter": {
				if (! isSubstep(step)){
					playSounds("#global_step_enter_effect");
				} else {
					playSounds("#global_substep_enter_effect");
				}
				playSounds(".enter_effet", step);
				break;
			}
			case "leave": {
				if (! isSubstep(step)){
	    			playSounds("#global_step_leave_effect");
	    		} else {
	    			playSounds("#global_substep_leave_effect");
	    		}
	    		playSounds(".step_leave_effect", step);
			}
		};
	};
	
	var isSkip = function(step) {
		return step.classList.contains("skip");
	};
	
    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {
    	var api = event.detail.api;
    	var root = event.target;
    	
    	var steps = $$(".step, .substep", root);
    	
	    // STEP CLASSES
	    steps.forEach(function (step, index) {
	    	processAnimations(step, "init");
	    });
	    
	    // Special for the solar system presentation
	    var planetsFaceCanvas = function (step, resetFacing) {
	    	if (isSubstep(step)) {
	    		return;
	    	}
	    	var duration = 500;
	    	var planets = $$("img.planet");
	    	var data = getStepData(step);
	    	var currentPlanet = $$("img.planet", step);
	    	var rotateData = {
                x: data.rotate.x,
                y: data.rotate.y,
                z: data.rotate.z
	    	};
	    	var resetData = {
                x: 0,
                y: 0,
                z: 0
	    	};
	    	if (resetFacing === true) {
	    		rotateData = resetData;
	    	}
	    	planets.forEach(function(planet) {
	    		if (planet == currentPlanet[0]){
	    			css(planet, {
			            transform: rotate(resetData),
						transition: "all " + duration + "ms",
			        });
	    		} else {
	    			css(planet, {
			            transform: rotate(rotateData),
						transition: "all " + duration + "ms",
			        });
	    		}
	    		
	    	});
	    }
	        
	    var stepEnterListener = function (event) {
	    	var step = event.target;
	    	var forward = event.detail.forward;
	    	var play = (event.detail.play === undefined) ? true : event.detail.play;
	    	
	    	if (isSkip(step)) {
	    		if (forward) {
	    			api.next();
	    		} else {
	    			api.prev();
	    		}
	    	} else {
	    		processSounds(step, "enter", play);
	    	}
	    	//planetsFaceCanvas(step, false);
	    	processAnimations(step, "enter", forward, play);
	    };
	    
	    var stepLeaveListener = function (event) {
	    	var step = event.target;
	    	var forward = event.detail.forward;
	    	var play = (event.detail.play === undefined) ? true : event.detail.play;
	    	if (!isSkip(step)) {
	    		processSounds(step, "leave", play);
	    	}
	    	//planetsFaceCanvas(step, true);
	    	processAnimations(step, "leave", forward, play);
	    };
	    
	    document.addEventListener("impress:stepenter", stepEnterListener, false);
	    document.addEventListener("impress:stepleave", stepLeaveListener, false);
	    document.addEventListener("impress:substepenter", stepEnterListener, false);
	    document.addEventListener("impress:substepleave", stepLeaveListener, false);
	    
	    var autoSwitchTimeout = null;
	    
	    var autoSwitch = function (event) {
	    	var step = event.target;
	    	var forward = (event.detail.forward === undefined) ? true : event.detail.forward;
	    	var timed = toNumber(step.dataset.timed, -1);
	    	if (forward && timed !== undefined && timed >= 0) {
	    		timed = timed * 1000;
	    		window.clearTimeout(autoSwitchTimeout);
		    	
	    		autoSwitchTimeout = window.setTimeout(function() {
                	api.next();
                }, timed);
	    	}
	    };
	    document.addEventListener("impress:stepenter", autoSwitch, false);
	    document.addEventListener("impress:substepenter", autoSwitch, false);
	    
	    playSounds("#global_music_effect");
	    
	}, false);
})(document, window);