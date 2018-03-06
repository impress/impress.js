/**
 * Polar Coordinate Positioning Plugin
 *
 * This plugin provides support for defining the coordinates of a step in polar coordinates.
 * It supports absolute and relative coordinates.
 * The angles used are degrees in mathematically positive count (starting at the right 
 * and counting counterclockwise)
 * 
 * In addition to plain numbers, which are pixel values, it is also possible to
 * define lengths as a multiple of standard step height, width or diagonal, using
 * a unit of "h", "w" or "d", respectively, appended to the number.
 *
 * For the allowed HTML attributes see the documentation for the positioning substeps.
 * 
 * Instead of using the previous step (default), any <em>preceding</em> step can be referenced by
 * adding an attribute with the id of the referenced step. These are different for 
 * cartesian and polar coordinates:
 *
 *      data-rel-ref
 *      data-polar-rel-ref
 *
 * If not given, the relative values are inherited from the referenced step.
 * 
 * If any absolute positioning is defined (x, y, z or rho), subsequent absolute or relative
 * positions are ignored (to avoid inadvertent inheritance). This is done by adding an attribute
 * data-pos-abs="yes".
 * 
 * This plugin is a *pre-init plugin*. It is called synchronously from impress.js
 * core at the beginning of `impress().init()`. This allows it to process its own
 * data attributes first, and possibly alter the data-x, data-y and data-z attributes
 * that will then be processed by `impress().init()`.
 * 
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

    const   absolute_flag   = "data-pos-abs";
    var     startingState   = {};

    /**
     * Copied from core impress.js. We currently lack a library mechanism
     * to share utility functions like this.
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
     * Sets the (absolute) cartesian coordinate attributes from the x/y/z components of a data set.
     * @param   astep   the step element to add the attributes to
     * @param   apos    the data set to take the x, y and z values from
     * @return          the modified step element
     */
    var setCartesians = function ( astep, apos )    {
        console.info("    coordinates set to " + apos.x + " / " + apos.y + " / " + apos.z);
        astep.setAttribute( "data-x", Math.round( apos.x ) );
        astep.setAttribute( "data-y", Math.round( apos.y ) );
        astep.setAttribute( "data-z", Math.round( apos.z ) );
        return astep;
    };
    
    /**
     * Calculates the absolute cartesian coordinates in pixels from existing attributes.
     * Accounted attributes are:
     *  data-x
     *  data-y
     *  data-z
     * Replaces units of w = width, h = height and d = diagonal with the proper scale.
     * If the 'absolute' attribute is set, the step element is returned unchanged.
     * @param   astep   the step element to position
     * @return          the updated step
     */
    var computeAbsCartesianPosition = function ( astep )    {
        //  don't change anything, if absolute position already defined.
        if ( astep.hasAttribute(absolute_flag) )    {
            console.info("    absolute cartesians skipped.")
            return astep;
        }
        console.info("    calculating absolute cartesians.")
        
        var data = {
                x:      astep.getAttribute("data-x"),
                y:      astep.getAttribute("data-y"),
                z:      astep.getAttribute("data-z"),
        }
        //  if any absolute coordinate is defined, set the 'absolute' attribute
        if ( ( data.x ) || ( data.y ) || ( data.z ) )   {
            astep.setAttribute(absolute_flag, "");
        };
        var pos = {
                x:      toNumberAdvanced( data.x, 0 ),
                y:      toNumberAdvanced( data.y, 0 ),
                z:      toNumberAdvanced( data.z, 0 )
        };
        return setCartesians( astep, pos );        
    };
    
    /**
     * Calculates the absolute cartesian coordinates in pixels from existing attributes.
     * Accounted attributes are (angles in degrees):
     *  data-polar-rho      for the radius
     *  data-polar-phi      for the rotation angle around the z-axis
     *  data-polar-theta    for the elevation angle relative to the x-y-plane
     *  data-polar-z        for the elevation, alternative to theta
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * If the 'absolute' attribute is set, the step element is returned unchanged.
     * @param   astep   the step element to position
     * @return          the updated step
     */
    var computeAbsPolarPosition    = function ( astep )    {
        //  don't change anything, if absolute position already defined.
        if ( astep.hasAttribute(absolute_flag) )    {
            console.info("    absolute polars skipped.")
            return astep;
        }
        console.info("    calculating absolute polars.")
        
        var data = {
                rho:    astep.getAttribute("data-polar-rho"),
                phi:    astep.getAttribute("data-polar-phi"),
                theta:  astep.getAttribute("data-polar-theta"),
                z:      astep.getAttribute("data-polar-z")
        }
        //  if absolute polar coordinates are defined (without rho angles make no sense), 
        //  set the 'absolute' attribute
        if ( data.rho )   {
            astep.setAttribute(absolute_flag, "");
        };
        
        var pos = {
                rho:    toNumberAdvanced(  data.rho, 0 ),
                phi:    toNumber( data.phi, 0 ),
                theta:  toNumber( data.theta, 0 ),
                z:      toNumberAdvanced( data.z, 0 )
        };
        console.log("    polars of " + pos.rho + " / " + pos.phi + "° / " + pos.theta + "°");
        
        var phiarc      = pos.phi   * Math.PI/180;
        var thetaarc    = pos.theta * Math.PI/180;
        
        pos.x = + pos.rho * Math.cos(phiarc) * Math.cos(thetaarc);
        pos.y = - pos.rho * Math.sin(phiarc) * Math.cos(thetaarc);
        pos.z = pos.z + pos.rho * Math.sin(thetaarc);

        return setCartesians( astep, pos );        
    };
    
    /**
     * Calculates the absolute cartesian coordinates from those given in the reference
     * and relative positions given either in the current step or inherited from the reference.
     * Accounted attributes are:
     *  data-rel-x
     *  data-rel-y
     *  data-rel-z
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * Keeps relative positioning attributes for possible inheritance by the next step.
     * If the 'absolute' attribute is set, the step element is returned unchanged.
     * @param   astep           the step element to position
     * @param   areferencestep  the referenced step to position relative to
     * @return                  the updated step
     */
    var computeRelCartesianPosition    = function ( astep, areferencestep )    {
        //  don't change anything, if absolute position already defined.
        if ( astep.hasAttribute(absolute_flag) )    {
            console.info("    relative cartesians skipped.")
            return astep;
        }
        
        //  get the reference position attributes or provide a default
        if ( !areferencestep )   {
            var refdata = { x: "0", y: "0", z: "0", relative: { x: "0", y: "0", z: "0" } };
        }   else    {
            var refdata = {
                    x:  areferencestep.getAttribute("data-x"),
                    y:  areferencestep.getAttribute("data-y"),
                    z:  areferencestep.getAttribute("data-z"),
                    relative: {
                        x: areferencestep.getAttribute("data-rel-x"),
                        y: areferencestep.getAttribute("data-rel-y"),
                        z: areferencestep.getAttribute("data-rel-z")
                    }
            }
        }
        //  extract the reference position in pixel (should be transformed already),
        //  and the relative positions for inheritance.
        var refpos  = {
                x: toNumber(refdata.x, 0),
                y: toNumber(refdata.y, 0),
                z: toNumber(refdata.z, 0),
                relative: {
                    x:  toNumberAdvanced(refdata.relative.x, 0),
                    y:  toNumberAdvanced(refdata.relative.y, 0),
                    z:  toNumberAdvanced(refdata.relative.z, 0)
                }
        }
        
        if ( !areferencestep )   { 
            console.warn("    no reference given");
        }   else    {
            console.info("    reference \"" + areferencestep.id + "\" as " 
                    + refpos.x + " / " + refpos.y + " / " + refpos.z
                    + ", inherited " + refpos.relative.x + " / " + refpos.relative.y + " / " + refpos.relative.z);
        }

        var data    = {
                //  absolute coordinates not required, as taken from reference
                relative:   {
                    x: astep.getAttribute("data-rel-x"),
                    y: astep.getAttribute("data-rel-y"),
                    z: astep.getAttribute("data-rel-z")
                }
        }
        
        if ( ( ! data.relative.x ) && ( ! data.relative.y ) && ( ! data.relative.z ) 
                &&  ( ! refdata.relative.x ) && ( ! refdata.relative.y ) && ( ! refdata.relative.z ) )  {
            console.info("    no relative cartesians given or inherited.")
            return astep;
        }
        console.info("    calculating relative cartesians.")
        
        var pos  = {
                relative:   {
                    x: toNumberAdvanced( data.relative.x, refpos.relative.x),
                    y: toNumberAdvanced( data.relative.y, refpos.relative.y),
                    z: toNumberAdvanced( data.relative.z, refpos.relative.z),
                }
        }
        console.info("    relatives are " + pos.relative.x + " / " + pos.relative.y + " / " + pos.relative.z);
        
        pos.x   = refpos.x + pos.relative.x;
        pos.y   = refpos.y + pos.relative.y;
        pos.z   = refpos.z + pos.relative.z;

        return setCartesians( astep, pos );        
    };
    
    /**
     * Calculates the absolute cartesian coordinates from those given in the reference
     * and relative polar positions given either in the current step or inherited from the reference.
     * Accounted attributes are (angles in degrees):
     *  data-polar-rel-rho      for the radius from the reference
     *  data-polar-rel-phi      for the rotation angle around the z-axis
     *  data-polar-rel-theta    for the elevation angle relative to the x-y-plane
     *  data-polar-rel-z        for the elevation, alternative to theta
     * Replaces units of w (= width), h (= height) and d (= diagonal) with the proper scale.
     * Keeps relative positioning attributes for possible inheritance by the next step.
     * If the 'absolute' attribute is set, the step element is returned unchanged.
     * @param   astep           the step element to position
     * @param   areferencestep  the referenced step to position relative to
     * @return                  the updated step
     */
    var computeRelPolarPosition    = function ( astep, areferencestep )    {
        //  don't change anything, if absolute position already defined.
        if ( astep.hasAttribute(absolute_flag) )    {
            console.info("    relative polars skipped.")
            return astep;
        }
        
        //  get the reference position attributes or provide a default
        if ( !areferencestep )   {
            var refdata = { x: "0", y: "0", z: "0", relative: { rho: "0", phi: "0", theta: "0" } };
        }   else    {
            var refdata = {
                    x:  areferencestep.getAttribute("data-x"),
                    y:  areferencestep.getAttribute("data-y"),
                    z:  areferencestep.getAttribute("data-z"),
                    relative: {
                        rho:    areferencestep.getAttribute("data-polar-rel-rho"),
                        phi:    areferencestep.getAttribute("data-polar-rel-phi"),
                        theta:  areferencestep.getAttribute("data-polar-rel-theta"),
                        z:      areferencestep.getAttribute("data-polar-rel-z")
                    }
            }
        }
        //  extract the reference position in pixel (should be transformed already),
        //  and the relative positions for inheritance.
        var refpos  = {
                x: toNumber(refdata.x, 0),
                y: toNumber(refdata.y, 0),
                z: toNumber(refdata.z, 0),
                relative: {
                    rho:    toNumberAdvanced(refdata.relative.rho, 0),
                    phi:    toNumber(refdata.relative.phi, 0),
                    theta:  toNumber(refdata.relative.theta, 0),
                    z:      toNumberAdvanced(refdata.relative.z, 0)
                }
        }

        if ( !areferencestep )   { 
            console.warn("    no reference given");
        }   else    {
            console.info("    reference \"" + areferencestep.id + "\" as " 
                    + refpos.x + " / " + refpos.y + " / " + refpos.z
                    + ", inherited " + refpos.relative.rho + " / " + refpos.relative.phi + "° / " + refpos.relative.theta + "° / " + refpos.relative.z);
        }

        var data    = {
                //  absolute coordinates not required, as taken from reference
                relative:   {
                    rho:    astep.getAttribute("data-polar-rel-rho"),
                    phi:    astep.getAttribute("data-polar-rel-phi"),
                    theta:  astep.getAttribute("data-polar-rel-theta"),
                    z:      astep.getAttribute("data-polar-rel-z")
                }
        }
        
        if ( ( ! data.relative.rho ) && ( ! refdata.relative.rho ) ) {
            console.info("    no relative polars given or inherited.")
            return astep;
        }
        console.info("    calculating relative polars.")
        
        var pos  = {
                relative:   {
                    rho:    toNumberAdvanced( data.relative.rho, refpos.relative.rho),
                    phi:    toNumber( data.relative.phi, refpos.relative.phi ),
                    theta:  toNumber( data.relative.theta, refpos.relative.theta ),
                    z:      toNumberAdvanced( data.relative.z, refpos.relative.z )
                }
        }
        console.info("    relatives are " + pos.relative.rho + " / " + pos.relative.phi + "° / " + pos.relative.theta +"°");
        
        var phiarc      = pos.relative.phi   * Math.PI/180;
        var thetaarc    = pos.relative.theta * Math.PI/180;

        pos.x = refpos.x + pos.relative.rho * Math.cos(phiarc) * Math.cos(thetaarc);
        pos.y = refpos.y - pos.relative.rho * Math.sin(phiarc) * Math.cos(thetaarc);
        pos.z = refpos.z + pos.relative.z + pos.relative.rho * Math.sin(thetaarc);

        return setCartesians( astep, pos );        
    };
    
            
    var polar = function(root) {
        var steps = root.querySelectorAll(".step");
        var referencecartesian;
        var referencepolar;
        
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
            el = computeAbsCartesianPosition(el);
            el = computeAbsPolarPosition(el);
            
            //	check if a reference id for relative positioning is given
            var relref  = el.getAttribute("data-rel-ref");
            var polref  = el.getAttribute("data-polar-rel-ref");
            if ( ( relref !== undefined ) || ( polref !== undefined ) ) {
            	//	if yes, find the step with the reference id
            	for ( var j = 0; j < i; j++ )	{
                    if ( steps[j].id == relref )    {
                        referencecartesian = steps[j]; 
                    }
                    if ( steps[j].id == polref )    {
                        referencepolar = steps[j]; 
                    }
            	}
            }
            el = computeRelCartesianPosition( el, referencecartesian );
            el = computeRelPolarPosition( el, referencepolar );
            
            //  keep the current step as possible reference for the next step
            referencecartesian  = el;
            referencepolar      = el;
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
