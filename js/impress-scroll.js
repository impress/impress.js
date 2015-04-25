(function () {
	var instance = impress(), // get an instance of impress
		scripts = document.getElementsByTagName("script"),
		currentScript = scripts[scripts.length - 1], // see http://stackoverflow.com/a/3326554
		globalDelta = 0, // we're going to keep track of the current scrolling
		turnDelta = currentScript.getAttribute("data-threshold"); // specified in the script tag

	if (turnDelta != null) {
		// make sure the delta is positive. important for later comparison
		turnDelta = Math.abs(turnDelta);
	} else {
		turnDelta = 1; // default value
	}

	// add event listeners if possible
	if (document.addEventListener) {
		document.addEventListener("mousewheel", scrollImpress, false);
		document.addEventListener("DOMMouseScroll", scrollImpress, false);
	}


	// A simple method to switch slides by mouse
	function scrollImpress(e) {
		// see http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
		var e = window.event || e,
			delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

		// dividing numbers with different signs results in number <= 0
		if (globalDelta != 0 && delta / globalDelta < 0) { 
			globalDelta = delta;
		} else {
			globalDelta += delta;
		}


		if (Math.abs(globalDelta) >= turnDelta) {
			if (globalDelta <= -turnDelta) {
				instance.next();
			} else if (globalDelta >= turnDelta) {
				instance.prev();
			}
			
			globalDelta = 0;
		}
	}
})();