/**
 * Polar Coordinate Positioning Plugin
 *
 * This plugin provides support for defining the coordinates of a step in polar coordinates.
 * It supports absolute and relative coordinates.
 * The angles used are degrees in mathematically positive count (starting at the right 
 * and counting counterclockwise)
 * 
 * Following html attributes are supported for step elements (angles in degrees):
 * 
 *     data-rho
 *     data-phi
 *     data-rel-x
 *     data-rel-y
 *     data-rel-z
 *     data-rel-rho
 *     data-rel-phi
 *
 * The relative x/y/z values are also inherited from the previous step.
 * 
 * Instead of using the previous step, any preceding step can be referenced by
 * adding the attribute "data-rel-ref" with the id of the referenced step.
 *
 * 	   data-rel-ref
 *
 * In addition to plain numbers, which are pixel values, it is also possible to
 * define relative positions as a multiple of standard step height and width or diagonal, using
 * a unit of "h", "w" or "d", respectively, appended to the number.
 *
 * The following positioning rules apply:
 * 	If no absolute positions are given:
 *		if relative rx/ry are given (or inherited!):
 *			these will be used wrto the previous (or referenced) position, rphi/rrho are ignored 
 *		if relative rphi/rrho are given:
 *			these will be used wrto the previous (or referenced) position, unless rx/ry are defined
 *	If absolute x/y are given:
 *		if relative rphi/rrho are given:
 *			these will be used wrto the absolute x/y
 *		everything else is ignored now
 *	If absolute phi/rho are given:
 *		any relative coordinates are ignored
 * 
 * This plugin is a *pre-init plugin*. It is called synchronously from impress.js
 * core at the beginning of `impress().init()`. This allows it to process its own
 * data attributes first, and possibly alter the data-x, data-y and data-z attributes
 * that will then be processed by `impress().init()`.
 * ATTN: TO WORK PROPERLY, THIS PLUGIN MUST NOT BE USED TOGETHER WITH THE ORIGINAL RELATIVE PLUGIN!
 *
 * 2018-01-10	LWH		created
 *
 * Relative part 	Copyright 2016 Henrik Ingo (@henrikingo)
 * Polar additions	Copyright 2018 LWH brainware	www.lwh-brainware.de
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    var startingState = {};
	var lib	= window.impress().lib;

	// get sizes from the root node, if given there, else use defaults.
	//TODO: replace literal constants by "global" variables
    var root 		= lib.util.byId( "impress" );
    var rootData	= root.dataset;
   	var	mwdt 		= lib.util.toNumber( rootData.width, 1024);
   	var mhgt 		= lib.util.toNumber( rootData.height, 768);
	console.info("frame size " + mwdt + " by " + mhgt);
	
    /**
     * Extends toNumber() to correctly compute also size values given 
     * as multiples of step dimensions.
     * Returns the computed value in pixels with postfix removed.
     */
    var toNumberAdvanced = function (numeric, fallback) {
        if (!(typeof numeric == 'string')) {
            return lib.util.toNumber(numeric, fallback);
        }
        var ratio = numeric.match(/^([+-]*[\d\.]+)([dwh])$/);
        if (ratio == null) {
            return lib.util.toNumber(numeric, fallback);
        } else {
            var value 		= parseFloat(ratio[1]);
            var multiplier	= 1;
            switch (ratio[2])	{
            	case "d":
            		multiplier = Math.sqrt(mwdt*mwdt + mhgt*mhgt);
            		break;
            	case "w":
            		multiplier = mwdt;
            		break;
            	case "h":
            		multiplier = mhgt;
            		break;
            }
            return value * multiplier;
        }
    };

    var computePolarPositions = function ( el, prev ) {
        var data = el.dataset;
        
        if( !prev ) {
            // For the first step, inherit these defaults
            var prev = { x:0, y:0, z:0, relative: {x:0, y:0, z:0, rho:0, phi:0} };
        }

        var step = {
            x:   lib.util.toNumber( data.x, prev.x ),
            y:   lib.util.toNumber( data.y, prev.y ),
            z:   lib.util.toNumber( data.z, prev.z ),
            rho: toNumberAdvanced(  data.rho, 0 ),
            phi: lib.util.toNumber( data.phi, 0 ),
            relative: {
                x:   toNumberAdvanced( data.relX, prev.relative.x ),
                y:   toNumberAdvanced( data.relY, prev.relative.y ),
                z:   toNumberAdvanced( data.relZ, prev.relative.z ),
                rho: toNumberAdvanced( data.relRho, 0 ),
                phi: lib.util.toNumber(data.relPhi, 0 )
            }
        };
        
        // Relative positions are ignored/zero if absolute is given.
        // Note that this also has the effect of resetting any inherited relative values.
        if ( data.x !== undefined ) {
            step.relative.x = 0;
        }
        if ( data.y !== undefined ) {
            step.relative.y = 0;
        }
        if ( data.z !== undefined ) {
            step.relative.z = 0;
        }
        if ( data.rho !== undefined )	{
        	step.relative.rho = 0;
        }
        if ( data.phi !== undefined ) 	{
        	step.relative.phi = 0;
        }
        //	if absolute polar coordinates are given, they count always from 0/0
        if (( data.rho !== undefined ) || ( data.phi !== undefined )) 	{
        	step.x	= 0;
        	step.y	= 0;
            step.relative.x = 0;
            step.relative.y = 0;
        }
        // absolute polar position is ignored/zero if absolute cartesian is already given.
        // relative polar position may still be added.
        if ((data.x !== undefined) || (data.y !== undefined))	{
        	step.rho = 0;
        	step.phi = 0;
        }
//        	else	{
//        	// if positions are 0 and relatives are defined, use previous coordinates
//        	if ((data.relRho !== undefined) || (data.relPhi !== undefined))	{
//        		step.x	= prev.x;
//        		step.y	= prev.y;
//        	}
//        }
//        
        // Apply relative position to absolute position, if non-zero
        // Note that at this point, the relative values contain a number value of pixels.
        step.x = step.x + step.relative.x + step.rho * Math.cos(step.phi * Math.PI/180) + step.relative.rho *Math.cos(step.relative.phi * Math.PI/180);
        step.y = step.y + step.relative.y - step.rho * Math.sin(step.phi * Math.PI/180) - step.relative.rho *Math.sin(step.relative.phi * Math.PI/180);
        step.z = step.z + step.relative.z;
		
        return step;        
    };
            
    var polar = function(root) {
        var steps = root.querySelectorAll(".step");
        var prev;
        startingState[root.id] = [];
        for ( var i = 0; i < steps.length; i++ ) {
            var el = steps[i];
            startingState[root.id].push({
                el: el,
                x:   el.getAttribute("data-x"),
                y:   el.getAttribute("data-y"),
                z:   el.getAttribute("data-z"),
                rho: el.getAttribute("data-rho"),
                phi: el.getAttribute("data-phi")
            });
            //	check if a reference id for the relative positioning is given
            var relref 	= el.getAttribute("data-rel-ref");
            if ( relref !== "undefined" )	{
            	//	if yes, find the step with the reference id
            	for ( var j = 0; j < i; j++ )	{
            		if ( steps[j].id == relref )	{
            			//	and set it as the previous one
            			prev = { 
                			x:   lib.util.toNumber( steps[j].getAttribute("data-x"), 0 ),
                			y:   lib.util.toNumber( steps[j].getAttribute("data-y"), 0 ),
                			z:   lib.util.toNumber( steps[j].getAttribute("data-z"), 0 ),
                			rho: toNumberAdvanced(  steps[j].getAttribute("data-rho"), 0 ),
                			phi: lib.util.toNumber( steps[j].getAttribute("data-phi"), 0 ),
            				relative: {
            					x:0, 
            					y:0, 
            					z:0, 
            					rho:0, 
            					phi:0
            				} 
            			};
            		}
            	}
            }
            var step 	= computePolarPositions( el, prev );
            
            // Apply polar position as cartesians (if non-zero)
            el.setAttribute( "data-x", step.x );
            el.setAttribute( "data-y", step.y );
            el.setAttribute( "data-z", step.z );
            prev = step;
        }
    };
    
    // Register the plugin to be called in pre-init phase (should be after other positioning, f.i rel)
    impress.addPreInitPlugin( polar );
    
    // Register teardown callback to reset the data.x, .y, .z values.
    document.addEventListener( "impress:init", function(event) {
        var root = event.target;
        event.detail.api.lib.gc.pushCallback( function(){
            var steps = startingState[root.id];
            var step;
            while( step == steps.pop() ){
                if( step.x === null ) {
                    step.el.removeAttribute( "data-x" );
                } else {
                    step.el.setAttribute( "data-x", step.x );
                }
                if( step.y === null ) {
                    step.el.removeAttribute( "data-y" );
                } else {
                    step.el.setAttribute( "data-y", step.y );
                }
                if( step.z === null ) {
                    step.el.removeAttribute( "data-z" );
                } else {
                    step.el.setAttribute( "data-z", step.z );
                }
            }
            delete startingState[root.id];
        });
    }, false);
})(document, window);
