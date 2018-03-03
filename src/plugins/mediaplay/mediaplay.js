
/**
 * Media play plugin - Automatically start video or audio if so desired.
 * The media tag must then have the property "autostart" as in
 * 	<video width="800" height="600" autostart>
 * ATTN: using "autoplay" will start the video immediately when the presentation is loaded!
 *
 * If the video has the class "noconsole", the video will not be shown in the console,
 * but be replaced by either the alternative image given in the video tag or a text with the video name.
 *
 * The property "transition" will play the (usually) audio when the previous step is left, thus allowing 
 * a transition sound (like a swoosh or such).
 *
 * If media clips have different volumes, this can be levelled by using the attribute "data-volume"
 * and a value between 0.0 (silent) and 1.0 (default), e.g.:
 * 	<video width="800" height="600" autostart data-volume="0.8"> will turn the volume down by 20%.
 * ATTN: Putting the volume up is not possible, if one clip is too low, all the others must be silenced!
 *
 * 2017-08-27	LWH		created
 * 2018-01-25	LWH		audio added
 *
 * Copyright 2017..18	Harald Martin (LWH), www.lwh-brainware.de
 * Released under the MIT license.
 */
(function ( document, window ) {
    'use strict';
    //	property and class names
    const	prop_autostart	= "autostart";
    const	class_noconsole	= "noconsole";
    const	prop_transition = "transition";
    const	prop_volume 	= "data-volume";

	var 	lib	= window.impress().lib;

	/**
	 *	Looks for the volume property and returns its value.
	 *	@param	mediel	the media element to search
	 *	@return	the volume setting, or 1.0
	 */
	var setVolume	= function(mediel)	{
		var avol = mediel.getAttribute(prop_volume);
		if ( avol )	{
			var vol = lib.util.toNumber(avol, 1.0);
			mediel.volume = vol;
			return vol;
		}
		return 1.0;
	};
	
    /**
     *	Finds all videos in the presentation and prepares them for proper display.
     *	Optionally creates a placeholder for the presenter console.
     */
    document.addEventListener("impress:init", function (event) {
        var myframe		= window.frameElement;
    	//	find all video tags
    	var videos		= document.getElementsByTagName("video");
		for	(var i = 0; i < videos.length; i++) {
			var video 	= videos[i];
			// remove controls if autostart, just in case
			if (video.hasAttribute(prop_autostart))	{
				video.removeAttribute("controls");
				if ((myframe) && (myframe.id == "slideView"))	{
					video.setAttribute("muted", "muted");
				}
			}
			//	enforce proper use as class
			if (video.hasAttribute(class_noconsole))	{
				//	this should be used as class, not property, so just in case...
				video.removeAttribute(class_noconsole);
				video.setAttribute("class", class_noconsole)
			}
			var vid_classes	= video.getAttribute("class");
			//	if it is not to be shown at all in the console, create an alternative
			if 	((vid_classes) && (vid_classes.includes(class_noconsole)))	{
				//	get video attributes
				var sizex	= toNumber(video.getAttribute("width"), 0);
				var sizey	= toNumber(video.getAttribute("height"), 0);
				var vname	= "Video";
				var iname	= "./media/Video-default.png";	// provide a default here
				var brats	= video.children;
				for	(var j = 0; j < brats.length; j++) {
					//	get the url of the video
					if (brats[j].tagName.toLowerCase() == "source")	{
						vname = brats[j].getAttribute("src");
					}
					//	get the url of an alternative image, if given
					if (brats[j].tagName.toLowerCase() == "img")	{
						iname = brats[j].getAttribute("src");
					}
				}
				//	create an alternative image or text box
				var	altnode	= document.createElement("div");
				//	if an image is given (usually at least the default), add an image node
				if (iname != "") {
					var imgnode	= document.createElement("img");
					imgnode.setAttribute("src", iname);
					imgnode.setAttribute("alt", "video replacement");	// just stick to the rules...
					if (sizex > 0)	{
						imgnode.setAttribute("width", sizex);
					}
					if (sizey > 0)	{
						imgnode.setAttribute("height", sizey);
					}
					altnode.appendChild(imgnode);
				} else	{
					//	if not, add a text paragraph. The class can be used for styles.	
					altnode.innerHTML	= "<p class=\"videoph\">Video:<br>" + vname + "</p>";
				}
				//	set the size to the size of the video, if given
				altnode.setAttribute("class", "novideo");
				if (sizex > 0)	{
					altnode.setAttribute("width", sizex);
				}
				if (sizey > 0)	{
					altnode.setAttribute("height", sizey);
				}
				// add the alternative after the video node
				video.parentNode.appendChild(altnode);
			}
    	}
	}, false);
	
	/**
	 *	Autostarts videos on entering the step.
	 *	If in the console, either plays it muted or not at all.
	 */
    document.addEventListener("impress:stepenter", function (event) {
        var bodyclasses = document.body.getAttribute("class");
        var myframe		= window.frameElement;
        // check for video tags in active step
		var step = event.target;
		var step_classes = step.getAttribute("class");
		if ((step_classes) && (step_classes.includes("active")))	{
			if (step.childElementCount > 0)	{
				var brats	= step.children;
				for	(var i = 0; i < brats.length; i++) {
					//	 for all video tags
					if ((brats[i].tagName.toLowerCase() == "video") 
					||  (brats[i].tagName.toLowerCase() == "audio"))	{
						var	medeo	= brats[i];
        				if ((bodyclasses) && (bodyclasses.includes("impress-console")))	{
        					//	if shown in console
							if  (myframe.id == "slideView") {
								// 	if shown in main console window
								//	ATTN: does not work in Chrome!
								var medeo_classes	= medeo.getAttribute("class");
								if ((! medeo_classes) || (! medeo_classes.includes(class_noconsole)))	{
									//	if a video and has no class to be blocked in console
									if  ((medeo.tagName.toLowerCase() == "video")
									&&	 (medeo.hasAttribute(prop_autostart)))	{
										// if autostart and shown in current view frame and not blocked, play with no sound
										// for debugging: delay to identify duplicate sound
										// var date 	= new Date();
										// var curDate = null;
                                        // 
										// do { 
										// 	curDate = new Date();
										// }
										// while(curDate - date < 1000);
										medeo.volume = 0.0;
										medeo.play();
									}
								}
							}
						}	else	{
        					//	if shown in presentation
        					if (medeo.hasAttribute(prop_autostart))	{
        						//	if autostart, play it now with defined volume
        						setVolume(medeo);
        						medeo.play();
        					} else	{
        						if (!medeo.hasAttribute(prop_transition))	{
	        						//	if not transition (which was already played), 
	        						//	offer controls to start manually
	        						medeo.setAttribute("controls", "controls");
	        					}
        					}
						}
					}
				}
			}
		}
    }, false);
    
    /**
     *	When leaving, stops all videos and audios in the step 
     *	(actually pauses, so on stepping back it will continue).
     *	If the next step has a "transition" audio, plays it.
     */
    document.addEventListener("impress:stepleave", function (event) {
        var bodyclasses = document.body.getAttribute("class");
        // check for media tags in active step
		var step 		= event.target;
		var nextstep	= event.detail.next;
		if (step.childElementCount > 0)	{
			var brats	= step.children;
			for	(var i = 0; i < brats.length; i++) {
				if ((brats[i].tagName.toLowerCase() == "video")
				||	(brats[i].tagName.toLowerCase() == "audio")) {
					brats[i].pause();
				}
			}
		}
		if (nextstep.childElementCount > 0)	{
			var brats	= nextstep.children;
			for	(var i = 0; i < brats.length; i++) {
				if (brats[i].tagName.toLowerCase() == "audio") 	{
					// if not in console
        			if ((!bodyclasses) || (!bodyclasses.includes("impress-console")))	{
						if (brats[i].hasAttribute(prop_transition))	{
        					setVolume(brats[i]);
							brats[i].play();
						}
					}	
				}
			}
		}
		
    }, false);

})(document, window);

