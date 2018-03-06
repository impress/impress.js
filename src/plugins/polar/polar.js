/**
 * Polar Coordinate Positioning Plugin
 *
 * This plugin provides support for defining the coordinates of a step in cartesian and 
 * polar coordinates.
 * It supports absolute and relative positioning.
 * The angles used are degrees in mathematically positive count (starting at the right 
 * and counting counterclockwise).
 * 
 * In addition to plain numbers, which are pixel values, it is also possible to
 * define lengths as a multiple of standard step height, width or diagonal, using
 * a unit of "h", "w" or "d", respectively, appended to the number.
 *
 * For the allowed HTML attributes see the documentation for the positioning substeps.
 * 
 * Absolute coordinates are by default counting from 0,0,0. This can be changed for a single step
 * by adding the attribute "data-pos-ref" with the id of a previous step as reference.
 *      <div id="step5" class="step" data-x="2w">
 * will be positioned two frame widths right of the origin (0,0,0), while
 *      <div id="step12" class="step" data-x="2w" data-pos-ref="step5" data-x="-1w">
 * will be positioned one frame width left of step5, i.e. one frame width right of the origin (0,0,0).
 *      
 * Relative positioning (either cartesian or polar) always references the previous step.
 * If no relative tags are given, they will be inherited from the previous step as well,
 * thus allowing sequences of equally-spaced steps.
 * If any absolute coordinates are defined (x, y or z), these override any relative positions.
 * 
 * Angles are always absolute, as only the position of the reference is kept, not its creation.
 * 
 * This plugin is a *pre-init plugin*. It is called synchronously from impress.js
 * core at the beginning of `impress().init()`. This allows it to process its own
 * data attributes first, and possibly alter the data-x, data-y and data-z attributes
 * that will then be processed by `impress().init()`.
 * 
 * ATTN: TO WORK PROPERLY, THIS PLUGIN MUST NOT BE USED TOGETHER WITH THE ORIGINAL RELATIVE PLUGIN!
 *
 * 2018-01-10   LWH     created
 * 2018-03-06   LWH     rewritten as separate positioning modules
 *
 * Relative part 	Copyright 2016 Henrik Ingo (@henrikingo)
 * Polar additions	Copyright 2018 LWH brainware	www.lwh-brainware.de
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';

    var     startingState   = {};

    /**
     * Changed from lib function to also cover a numeric of <code>null</code>.
     */
    var toNumber = function( numeric, fallback ) {
        if ( ( numeric === null ) || isNaN( numeric ) ) {
            return fallback;
        }
        return Number( numeric );
    };

	// get sizes from the root node, if given there, else use defaults.
	//TODO: replace literal constants by "global" variables
    var root 		= document.getElementById( "impress" );
    var rootData	= root.dataset;
   	var	mwdt 		= toNumber( rootData.width, 1024);
   	var mhgt 		= toNumber( rootData.height, 768);
	
    /**
     * Extends toNumber() to correctly compute also size values given 
     * as multiples of step dimensions.
     * Returns the computed value in pixels with dimension removed.
     */
    var toNumberAdvanced = function (numeric, fallback) {
        if (!(typeof numeric == 'string')) {
            return toNumber(numeric, fallback);
        }
    	
        var ratio = numeric.match(/^([+-]*[\d\.]+)([dwh])$/);
        if (ratio == null) {
            return toNumber(numeric, fallback);
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

    /**
     * Computes origin coordinates for absolute positioning. If given, uses
     * the position of an existing step whose id is defined by the attribute
     *  "data-pos-ref". Otherwise, the coordinates will be 0, 0, 0.
     * @param   astep       the current step
     * @param   asteplist   a NodeList of all steps to searched for the reference
     * @return              an object with the x, y and z coordinates
     */
    var getOrigin   = function ( astep, asteplist )    {
        //  get a possible reference position
        var referenceid   = astep.getAttribute("data-pos-ref");
        if ( !referenceid )   {
            //  if undefined, origin is 0, 0, 0
            var refdata = { x: "0", y: "0", z: "0" };
        }   else    {
            // else get the referenced step and use as origin 
            for ( var j = 0; j < asteplist.length; j++ )   {
                if ( asteplist[j].id == referenceid )    {
                    var refdata = {
                            x: asteplist[j].getAttribute( "data-x" ),
                            y: asteplist[j].getAttribute( "data-y" ),
                            z: asteplist[j].getAttribute( "data-z" ),
                    }
                    break; 
                }
            }
        }
        var origin  = {
                x: toNumber( refdata.x, 0 ),
                y: toNumber( refdata.y, 0 ),
                z: toNumber( refdata.z, 0 )
        };
        return origin;
    }
    
    /**
     * Finds the step before the given step.
     *  @param  astep       the current step
     *  @param  asteplist   a NodeList of all steps to get the previous from
     *  @return             the previous step, or <code>null</code> if the current is the first
     */
    var getPreviousStep = function ( astep, asteplist )    {
        for ( var j = 1; j < asteplist.length; j++ )   {
            if (asteplist[j] === astep) {
                return asteplist[j-1];
            }
        }
        return null;
    }
    
    /**
     * Calculates the absolute cartesian coordinates in pixels from existing attributes.
     * Accounted attributes are:
     *  data-x
     *  data-y
     *  data-z
     * Replaces units of w = width, h = height and d = diagonal with the proper scale.
     * Coordinates count from the origin (0,0,0), unless the id of a reference step is given
     * by the attribute "data-pos-ref", in which case that is the origin.
     * Only those coordinates are set which were explicitly defined. All others are assumed to be 0.
     * @param   astep       the step element to position
     * @param   asteplist   a NodeList of all steps to searched for a reference
     * @return              the updated step
     */
    var computeAbsCartesianPosition = function ( astep, asteplist )    {
        var origin = getOrigin( astep, asteplist );

        console.info( "    calculating absolute cartesians from " + origin.x + "/"  + origin.y + "/"  + origin.z )
        
        var data = {
                x: astep.getAttribute( "data-x" ),
                y: astep.getAttribute( "data-y" ),
                z: astep.getAttribute( "data-z" ),
        }
        var pos = {
                x: toNumberAdvanced( data.x, 0 ) + origin.x,
                y: toNumberAdvanced( data.y, 0 ) + origin.y,
                z: toNumberAdvanced( data.z, 0 ) + origin.z
        };
        console.info("    coordinates set to " + pos.x + " / " + pos.y + " / " + pos.z);
        if ( ( data.x ) || ( pos.x != 0 ) ) {
            astep.setAttribute( "data-x", Math.round( pos.x ) );
        }
        if ( ( data.y ) || ( pos.y != 0 ) ) {
            astep.setAttribute( "data-y", Math.round( pos.y ) );
        }
        if ( ( data.z ) || ( pos.z != 0 ) ) {
            astep.setAttribute( "data-z", Math.round( pos.z ) );
        }
        return astep;
    };
    
    /**
     * Calculates the absolute cartesian coordinates in pixels from existing attributes.
     * Accounted attributes are (angles in degrees):
     *  data-polar-rho      for the radius (required)
     *  data-polar-phi      for the rotation angle around the z-axis
     *  data-polar-theta    for the elevation angle relative to the x-y-plane
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * Coordinates count from the origin (0,0,0), unless the id of a reference step is given
     * by the attribute "data-pos-ref", in which case that is the origin.
     * The x and y coordinates are always updated, z only if theta is defined
     * @param   astep       the step element to position
     * @param   asteplist   a NodeList of all steps to searched for a reference
     * @return              the updated step
     */
    var computeAbsPolarPosition    = function ( astep, asteplist )    {
        var origin = getOrigin( astep, asteplist );

        console.info( "    calculating absolute polars from " + origin.x + "/"  + origin.y + "/"  + origin.z );
        
        var data = {
                rho:    astep.getAttribute( "data-polar-rho" ),
                phi:    astep.getAttribute( "data-polar-phi" ),
                theta:  astep.getAttribute( "data-polar-theta" )
        }
        //  if no rho defined, all other values would be zero, so rho is required
        if ( data.rho ) {
            var pos = {
                    rho:    toNumberAdvanced( data.rho, 0 ),
                    phi:    toNumber( data.phi, 0 ),
                    theta:  toNumber( data.theta, 0 )
            };
            console.log("    polars of " + pos.rho + " / " + pos.phi + "° / " + pos.theta + "°");

            var phiarc      = pos.phi   * Math.PI/180;
            var thetaarc    = pos.theta * Math.PI/180;

            pos.x = origin.x + pos.rho * Math.cos( phiarc ) * Math.cos( thetaarc );
            pos.y = origin.y - pos.rho * Math.sin( phiarc ) * Math.cos( thetaarc );
            pos.z = origin.z + pos.rho * Math.sin( thetaarc );

            console.info("    coordinates set to " + pos.x + " / " + pos.y + " / " + pos.z);
            if ( pos.x != 0 ) {
                astep.setAttribute( "data-x", Math.round( pos.x ) );
            }
            if ( pos.y != 0 ) {
                astep.setAttribute( "data-y", Math.round( pos.y ) );
            }
            if ( ( data.theta ) || ( pos.z != 0 ) ) {
                astep.setAttribute( "data-z", Math.round( pos.z ) );
            }
        }
        return astep;
    };

    /**
     * Calculates the absolute cartesian coordinates from the position of the previous step
     * and relative positions given either in the current step or inherited from the previous.
     * Accounted attributes are:
     *  data-rel-x
     *  data-rel-y
     *  data-rel-z
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * Does not overwrite any coordinates already defined.
     * Adds inherited relative positioning attributes for possible inheritance by the next step.
     * @param   astep       the step element to position
     * @param   asteplist   a NodeList of all steps to get the previous from
     * @return              the updated step
     */
    var computeRelCartesianPosition    = function ( astep, asteplist )    {
        //  get the previous step as reference
        var previousstep    = getPreviousStep( astep, asteplist );
        console.info(previousstep);
        if (!previousstep)    {
            var previousdata = { x: "0", y: "0", z: "0", relative: { x: "0", y: "0", z: "0" } };
        }   else    {
            var previousdata = {
                    x: previousstep.getAttribute( "data-x" ),
                    y: previousstep.getAttribute( "data-y" ),
                    z: previousstep.getAttribute( "data-z" ),
                    relative: {
                        x: previousstep.getAttribute( "data-rel-x" ),
                        y: previousstep.getAttribute( "data-rel-y" ),
                        z: previousstep.getAttribute( "data-rel-z" )
                    }
            }
        }
        //  extract the reference position in pixel (should be transformed already),
        //  and the relative positions for inheritance.
        var previouspos = {
                x: toNumber( previousdata.x, 0 ),
                y: toNumber( previousdata.y, 0 ),
                z: toNumber( previousdata.z, 0 ),
                relative: {
                    x: toNumberAdvanced( previousdata.relative.x, 0 ),
                    y: toNumberAdvanced( previousdata.relative.y, 0 ),
                    z: toNumberAdvanced( previousdata.relative.z, 0 )
                }
        }

        var data = {
                // absolute data needed to keep already defined values
                x: astep.getAttribute( "data-x" ),
                y: astep.getAttribute( "data-y" ),
                z: astep.getAttribute( "data-z" ),
                relative: {
                    x: astep.getAttribute( "data-rel-x" ),
                    y: astep.getAttribute( "data-rel-y" ),
                    z: astep.getAttribute( "data-rel-z" )
                }
        }
        if ( ( !data.relative.x ) && ( !data.relative.y ) && ( !data.relative.z ) 
          && ( !previousdata.relative.x ) && ( !previousdata.relative.y ) && ( !previousdata.relative.z ) ) {
            console.info( "    no relative cartesians given or inherited." )
            return astep;
        }
        console.info("    calculating relative cartesians from "  + previouspos.x + "/"  + previouspos.y + "/"  + previouspos.z )
        
        var pos  = {
                relative:   {
                    x: toNumberAdvanced( data.relative.x, previouspos.relative.x),
                    y: toNumberAdvanced( data.relative.y, previouspos.relative.y),
                    z: toNumberAdvanced( data.relative.z, previouspos.relative.z),
                }
        }
        console.info("    relatives are " + pos.relative.x + " / " + pos.relative.y + " / " + pos.relative.z);
        
        pos.x   = previouspos.x + pos.relative.x;
        pos.y   = previouspos.y + pos.relative.y;
        pos.z   = previouspos.z + pos.relative.z;

        console.info("    coordinates set to " + pos.x + " / " + pos.y + " / " + pos.z);
        //  add resulting absolute position, if not already defined
        if ( !data.x ) {
            astep.setAttribute( "data-x", Math.round( pos.x ) );
        }
        if ( !data.y ) {
            astep.setAttribute( "data-y", Math.round( pos.y ) );
        }
        if ( !data.z ) {
            astep.setAttribute( "data-z", Math.round( pos.z ) );
        }
        //  add inherited attributes for further inheritance
        if ( ( !data.x ) && ( !data.relative.x ) && ( previousdata.relative.x ) ) {
            astep.setAttribute( "data-rel-x", Math.round( previouspos.relative.x ) );
        }
        if ( ( !data.y ) && ( !data.relative.y ) && ( previousdata.relative.y ) ) {
            astep.setAttribute( "data-rel-y", Math.round( previouspos.relative.y ) );
        }
        if ( ( !data.z ) && ( !data.relative.z ) && ( previousdata.relative.z ) ) {
            astep.setAttribute( "data-rel-z", Math.round( previouspos.relative.z ) );
        }
        return astep;
    };
    
    /**
     * Calculates the absolute cartesian coordinates from the position of the previous step
     * and relative polar positions given either in the current step or inherited from the previous.
     * Accounted attributes are (angles in degrees):
     *  data-polar-rel-rho      for the radius from the reference (required)
     *  data-polar-rel-phi      for the rotation angle around the z-axis
     *  data-polar-rel-theta    for the elevation angle relative to the x-y-plane
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * Does not overwrite any coordinates already defined.
     * Adds inherited relative positioning attributes for possible inheritance by the next step.
     * @param   astep       the step element to position
     * @param   asteplist   a NodeList of all steps to get the previous from
     * @return              the updated step
     */
    var computeRelPolarPosition    = function ( astep, asteplist )    {
        //  get the previous step as reference
        var previousstep    = getPreviousStep( astep, asteplist );
        if (!previousstep)    {
            var previousdata = { x: "0", y: "0", z: "0", relative: { rho: "0", phi: "0", theta: "0" } };
        }   else    {
            var previousdata = {
                    x: previousstep.getAttribute( "data-x" ),
                    y: previousstep.getAttribute( "data-y" ),
                    z: previousstep.getAttribute( "data-z" ),
                    relative: {
                        rho:    previousstep.getAttribute("data-polar-rel-rho"),
                        phi:    previousstep.getAttribute("data-polar-rel-phi"),
                        theta:  previousstep.getAttribute("data-polar-rel-theta")
                    }
            }
        }
        //  extract the reference position in pixel (should be transformed already),
        //  and the relative positions for inheritance.
        var previouspos = {
                x: toNumber( previousdata.x, 0 ),
                y: toNumber( previousdata.y, 0 ),
                z: toNumber( previousdata.z, 0 ),
                relative: {
                    rho:    toNumberAdvanced( previousdata.relative.rho, 0 ),
                    phi:    toNumber( previousdata.relative.phi, 0 ),
                    theta:  toNumber( previousdata.relative.theta, 0 )
                }
        }

        var data    = {
                x:      astep.getAttribute("data-x"),
                y:      astep.getAttribute("data-y"),
                z:      astep.getAttribute("data-z"),
                relative:   {
                    rho:    astep.getAttribute("data-polar-rel-rho"),
                    phi:    astep.getAttribute("data-polar-rel-phi"),
                    theta:  astep.getAttribute("data-polar-rel-theta")
                }
        }
        
        if ( ( ! data.relative.rho ) && ( ! previousdata.relative.rho ) ) {
            console.info("    no relative polars given or inherited.")
            return astep;
        }
        console.info("    calculating relative polars.")
        
        var pos  = {
                relative:   {
                    rho:    toNumberAdvanced( data.relative.rho, previouspos.relative.rho),
                    phi:    toNumber( data.relative.phi, previouspos.relative.phi ),
                    theta:  toNumber( data.relative.theta, previouspos.relative.theta )
                }
        }
        console.info("    relatives are " + pos.relative.rho + " / " + pos.relative.phi + "° / " + pos.relative.theta +"°");
        
        var phiarc      = pos.relative.phi   * Math.PI/180;
        var thetaarc    = pos.relative.theta * Math.PI/180;

        pos.x = previouspos.x + pos.relative.rho * Math.cos(phiarc) * Math.cos(thetaarc);
        pos.y = previouspos.y - pos.relative.rho * Math.sin(phiarc) * Math.cos(thetaarc);
        pos.z = previouspos.z + pos.relative.rho * Math.sin(thetaarc);

        console.info("    coordinates set to " + pos.x + " / " + pos.y + " / " + pos.z);
        //  add resulting absolute position, if not already defined
        if ( !data.x ) {
            astep.setAttribute( "data-x", Math.round( pos.x ) );
        }
        if ( !data.y ) {
            astep.setAttribute( "data-y", Math.round( pos.y ) );
        }
        if ( !data.z ) {
            astep.setAttribute( "data-z", Math.round( pos.z ) );
        }
        //  add inherited attributes for further inheritance
        if ( ( !data.x ) && ( !data.y ) )   {
            if ((!data.relative.rho) && ( previousdata.relative.rho ) ) {
                astep.setAttribute( "data-polar-rel-rho",  previouspos.relative.rho );
            }
            if ((!data.relative.phi) && ( previousdata.relative.phi ) ) {
                astep.setAttribute( "data-polar-rel-phi",  previouspos.relative.phi );
            }
        }
        if ( !data.z )  {
            if ( ( !data.relative.theta ) && ( previousdata.relative.theta ) ) {
                astep.setAttribute( "data-polar-rel-theta", previouspos.relative.theta );
            }
        }
        return astep;
    };
    
            
    /**
     * Main entry function.
     * Creates a list of all steps and positions each sequentially.
     */
    var polar = function(root) {
        var steps = root.querySelectorAll(".step");
        
        startingState[root.id] = [];
        for ( var i = 0; i < steps.length; i++ ) {
            var el = steps[i];
            startingState[root.id].push({
                el: 	el,
                x:   	el.getAttribute("data-x"),
                y:   	el.getAttribute("data-y"),
                z:   	el.getAttribute("data-z"),
            });
            //  calculate and set absolute coordinates
            console.info("starting step \"" + el.id + "\"");
            el = computeAbsCartesianPosition(el, steps);
            el = computeAbsPolarPosition(el, steps);
            
            el = computeRelCartesianPosition( el, steps );
            el = computeRelPolarPosition( el, steps );
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
