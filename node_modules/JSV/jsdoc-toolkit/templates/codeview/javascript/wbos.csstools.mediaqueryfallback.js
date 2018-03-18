/**
 * @fileOverview Media Query FallBack
 * @author Wouter Bos (www.thebrightlines.com)
 * @since 1.0 - 2010-09-10
 * @version 1.0 - 2010-09-10
 */






if (typeof(wbos) == "undefined") {
	/**
	 * @namespace wbos = Wouter Bos (www.thebrightlines.com)
	 */
	wbos = {}
}
if (typeof(wbos.CssTools) == "undefined") {
	/**
	 * @namespace Namespace for CSS-related functionality
	 */
	wbos.CssTools = {}
}




/**
 * @namespace Fallback for CSS advanced media query
 * @class
 * @since 1.0 - 2010-09-10
 * @version 1.0 - 2010-09-10
 */
wbos.CssTools.MediaQueryFallBack = ( function() {
	var config = {
		cssScreen: "/css/screen.css",
		cssHandheld: "/css/handheld.css",
		mobileMaxWidth: 660,
		testDivClass: "cssLoadCheck",
		dynamicCssLinkId: "DynCssLink",
		resizeDelay: 30
	}
	var noMediaQuery = false;
	var delay;
	var currentCssMediaType;

	// Adding events to elements in the DOM without overwriting it
	function addEvent(element, newFunction, eventType) {
		var oldEvent = eval("element." + eventType);
		var eventContentType = eval("typeof element." + eventType)
		
		if ( eventContentType != 'function' ) {
			eval("element." + eventType + " = newFunction")
		} else {
			eval("element." + eventType + " = function(e) { oldEvent(e); newFunction(e); }")
		}
	}
	
	// Get the the inner width of the browser window
	function getWindowWidth() {
		if (window.innerWidth) {
			return window.innerWidth;
		} else if (document.documentElement.clientWidth) {
			return document.documentElement.clientWidth;
		} else if (document.body.clientWidth) {
			return document.body.clientWidth;
		} else{
			return 0;	
		}
	}
	
	function addCssLink(cssHref) {
		var cssNode = document.createElement('link');
		var windowWidth;
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.media = 'screen, handheld, fallback';
		//cssNode.id = config.dynamicCssLinkId;
		cssNode.href = cssHref;
		document.getElementsByTagName("head")[0].appendChild(cssNode);
	}
	


	/* Start public */
	return {
  		/**
		 * Adds link to CSS in the head if no CSS is loaded
		 *
		 * @since 1.0 - 2010-08-21
		 * @version 1.0 - 2010-08-21
		 * @param {String|Object} cssScreen URL to CSS file for larger screens
		 * @param {String|Object} cssHandheld URL to CSS file for smaller screens
		 * @param {Number} mobileMaxWidth Maximum  width for handheld devices
		 * @example
		 * wbos.CssTools.MediaQueryFallBack.LoadCss(['screen.css', 'screen2.css'], 'mobile.css', 480)
		 */
		LoadCss: function(cssScreen, cssHandheld, mobileMaxWidth) {
			// Set config values
			if (typeof(cssScreen) != "undefined") {
				config.cssScreen = cssScreen;	
			}
			if (typeof(cssHandheld) != "undefined") {
				config.cssHandheld = cssHandheld;	
			}
			if (typeof(mobileMaxWidth) != "undefined") {
				config.mobileMaxWidth = mobileMaxWidth;	
			}
			
			// Check if CSS is loaded
			var cssloadCheckNode = document.createElement('div');
			cssloadCheckNode.className = config.testDivClass;
			document.getElementsByTagName("body")[0].appendChild(cssloadCheckNode);
			if (cssloadCheckNode.offsetWidth != 100 && noMediaQuery == false) {
				noMediaQuery = true;
			}
			cssloadCheckNode.parentNode.removeChild(cssloadCheckNode)
			
			if (noMediaQuery == true) {
				// Browser does not support Media Queries, so JavaScript will supply a fallback 
				var cssHref = "";
				
				// Determines what CSS file to load
				if (getWindowWidth() <= config.mobileMaxWidth) {
					cssHref = config.cssHandheld;
					newCssMediaType = "handheld";
				} else {
					cssHref = config.cssScreen;
					newCssMediaType = "screen";
				}
				
				// Add CSS link to <head> of page
				if (cssHref != "" && currentCssMediaType != newCssMediaType) {
					var currentCssLinks = document.styleSheets
					for (var i = 0; i < currentCssLinks.length; i++) {
						for (var ii = 0; ii < currentCssLinks[i].media.length; ii++) {
							if (typeof(currentCssLinks[i].media) == "object") {
								if (currentCssLinks[i].media.item(ii) == "fallback") {
									currentCssLinks[i].ownerNode.parentNode.removeChild(currentCssLinks[i].ownerNode)
									i--
									break;
								}
							} else {
								if (currentCssLinks[i].media.indexOf("fallback") >= 0) {
									currentCssLinks[i].owningElement.parentNode.removeChild(currentCssLinks[i].owningElement)
									i--
									break;
								}
							}
						}
					}
					if (typeof(cssHref) == "object") {
						for (var i = 0; i < cssHref.length; i++) {
							addCssLink(cssHref[i])
						}
					} else {
						addCssLink(cssHref)
					}
										
					currentCssMediaType = newCssMediaType;
				}

				
				// Check screen size again if user resizes window 
				addEvent(window, wbos.CssTools.MediaQueryFallBack.LoadCssDelayed, 'onresize')
			}
		},
		
  		/**
		 * Runs LoadCSS after a short delay
		 *
		 * @since 1.0 - 2010-08-21
		 * @version 1.0 - 2010-08-21
		 * @example
		 * wbos.CssTools.MediaQueryFallBack.LoadCssDelayed()
		 */
		LoadCssDelayed: function() {
			clearTimeout(delay);
			delay = setTimeout( "wbos.CssTools.MediaQueryFallBack.LoadCss()", config.resizeDelay)
		}
		
	}
	/* End public */
})();
