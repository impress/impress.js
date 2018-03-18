var syn = require('./synthetic');

// check if elementFromPageExists
(function dragSupport() {

	// document body has to exists for this test
	if (!document.body) {
		syn.schedule(dragSupport, 1);
		return;
	}
	var div = document.createElement('div');
	document.body.appendChild(div);
	syn.helpers.extend(div.style, {
		width: "100px",
		height: "10000px",
		backgroundColor: "blue",
		position: "absolute",
		top: "10px",
		left: "0px",
		zIndex: 19999
	});
	document.body.scrollTop = 11;
	if (!document.elementFromPoint) {
		return;
	}
	var el = document.elementFromPoint(3, 1);
	if (el === div) {
		syn.support.elementFromClient = true;
	} else {
		syn.support.elementFromPage = true;
	}
	document.body.removeChild(div);
	document.body.scrollTop = 0;
})();

//gets an element from a point
var elementFromPoint = function (point, element) {
	var clientX = point.clientX,
		clientY = point.clientY,
		win = syn.helpers.getWindow(element),
		el;

	if (syn.support.elementFromPage) {
		var off = syn.helpers.scrollOffset(win);
		clientX = clientX + off.left; //convert to pageX
		clientY = clientY + off.top; //convert to pageY
	}
	el = win.document.elementFromPoint ? win.document.elementFromPoint(clientX, clientY) : element;
	if (el === win.document.documentElement && (point.clientY < 0 || point.clientX < 0)) {
		return element;
	} else {
		return el;
	}
},
	//creates an event at a certain point
	createEventAtPoint = function (event, point, element) {
		var el = elementFromPoint(point, element);
		syn.trigger(el || element, event, point);
		return el;
	},
	// creates a mousemove event, but first triggering mouseout / mouseover if appropriate
	mouseMove = function (point, element, last) {
		var el = elementFromPoint(point, element);
		if (last !== el && el && last) {
			var options = syn.helpers.extend({}, point);

			// QUESTION: Should we also be sending a pointerleave event?
			options.relatedTarget = el;
			if(syn.support.pointerEvents){syn.trigger(last, 'pointerout', options);}
			syn.trigger(last, "mouseout", options);

			// QUESTION: Should we also be sending a pointerenter event?
			options.relatedTarget = last;
			if(syn.support.pointerEvents){syn.trigger(el, 'pointerover', options);}
			syn.trigger(el, "mouseover", options);
		}

		if(syn.support.pointerEvents){syn.trigger(el || element, "pointermove", point);}
		if(syn.support.touchEvents){syn.trigger(el || element, "touchmove", point);}
		syn.trigger(el || element, "mousemove", point);
		return el;
	},
	// start and end are in clientX, clientY
	startMove = function (start, end, duration, element, callback) {
		var startTime = new Date(),
			distX = end.clientX - start.clientX,
			distY = end.clientY - start.clientY,
			win = syn.helpers.getWindow(element),
			current = elementFromPoint(start, element),
			cursor = win.document.createElement('div'),
			calls = 0,
			move;
		move = function onmove() {
			//get what fraction we are at
			var now = new Date(),
				scrollOffset = syn.helpers.scrollOffset(win),
				fraction = (calls === 0 ? 0 : now - startTime) / duration,
				options = {
					clientX: distX * fraction + start.clientX,
					clientY: distY * fraction + start.clientY
				};
			calls++;
			if (fraction < 1) {
				syn.helpers.extend(cursor.style, {
					left: (options.clientX + scrollOffset.left + 2) + "px",
					top: (options.clientY + scrollOffset.top + 2) + "px"
				});
				current = mouseMove(options, element, current);
				syn.schedule(onmove, 15);
			} else {
				current = mouseMove(end, element, current);
				win.document.body.removeChild(cursor);
				callback();
			}
		};
		syn.helpers.extend(cursor.style, {
			height: "5px",
			width: "5px",
			backgroundColor: "red",
			position: "absolute",
			zIndex: 19999,
			fontSize: "1px"
		});
		win.document.body.appendChild(cursor);
		move();
	},
	startDrag = function (start, end, duration, element, callback) {
		if(syn.support.pointerEvents){createEventAtPoint("pointerdown", start, element);}
		if(syn.support.touchEvents){createEventAtPoint("touchstart", start, element);}
		createEventAtPoint("mousedown", start, element);
		startMove(start, end, duration, element, function () {
			if(syn.support.pointerEvents){createEventAtPoint("pointerup", end, element);}
			if(syn.support.touchEvents){createEventAtPoint("touchend", end, element);}
			createEventAtPoint("mouseup", end, element);
			callback();
		});
	},
	center = function (el) {
		var j = syn.jquery()(el),
			o = j.offset();
		return {
			pageX: o.left + (j.outerWidth() / 2),
			pageY: o.top + (j.outerHeight() / 2)
		};
	},
	convertOption = function (option, win, from) {
		var page = /(\d+)[x ](\d+)/,
			client = /(\d+)X(\d+)/,
			relative = /([+-]\d+)[xX ]([+-]\d+)/,
			parts;
		//check relative "+22x-44"
		if (typeof option === 'string' && relative.test(option) && from) {
			var cent = center(from);
			parts = option.match(relative);
			option = {
				pageX: cent.pageX + parseInt(parts[1]),
				pageY: cent.pageY + parseInt(parts[2])
			};
		}
		if (typeof option === "string" && page.test(option)) {
			parts = option.match(page);
			option = {
				pageX: parseInt(parts[1]),
				pageY: parseInt(parts[2])
			};
		}
		if (typeof option === 'string' && client.test(option)) {
			parts = option.match(client);
			option = {
				clientX: parseInt(parts[1]),
				clientY: parseInt(parts[2])
			};
		}
		if (typeof option === 'string') {
			option = syn.jquery()(option, win.document)[0];
		}
		if (option.nodeName) {
			option = center(option);
		}
		if (option.pageX != null) {
			var off = syn.helpers.scrollOffset(win);
			option = {
				clientX: option.pageX - off.left,
				clientY: option.pageY - off.top
			};
		}
		return option;
	},
	// if the client chords are not going to be visible ... scroll the page so they will be ...
	adjust = function (from, to, win) {
		if (from.clientY < 0) {
			var off = syn.helpers.scrollOffset(win);
			var top = off.top + (from.clientY) - 100,
				diff = top - off.top;

			// first, lets see if we can scroll 100 px
			if (top > 0) {

			} else {
				top = 0;
				diff = -off.top;
			}
			from.clientY = from.clientY - diff;
			to.clientY = to.clientY - diff;
			syn.helpers.scrollOffset(win, {
				top: top,
				left: off.left
			});
		}
	};
/**
 * @add syn prototype
 */
syn.helpers.extend(syn.init.prototype, {
	/**
		 * @function syn.move move()
	   * @parent mouse
		 * @signature `syn.move(from, options, callback)`
		 * Moves the cursor from one point to another.  
		 * 
		 * ### Quick Example
		 * 
		 * The following moves the cursor from (0,0) in
		 * the window to (100,100) in 1 second.
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: {clientX: 0, clientY: 0},
		 *            to: {clientX: 100, clientY: 100},
		 *            duration: 1000
		 *          })
		 * 
		 * ## Options
		 * 
		 * There are many ways to configure the endpoints of the move.
		 * 
		 * ### PageX and PageY
		 * 
		 * If you pass pageX or pageY, these will get converted
		 * to client coordinates.
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: {pageX: 0, pageY: 0},
		 *            to: {pageX: 100, pageY: 100}
		 *          })
		 * 
		 * ### String Coordinates
		 * 
		 * You can set the pageX and pageY as strings like:
		 * 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: "0x0",
		 *            to: "100x100"
		 *          })
		 * 
		 * ### Element Coordinates
		 * 
		 * If jQuery is present, you can pass an element as the from or to option
		 * and the coordinate will be set as the center of the element.
		 
		 *     syn.move(
		 *          document.document,
		 *          {
		 *            from: $(".recipe")[0],
		 *            to: $("#trash")[0]
		 *          })
		 * 
		 * ### Query Strings
		 * 
		 * If jQuery is present, you can pass a query string as the from or to option.
		 * 
		 * syn.move(
		 *      document.document,
		 *      {
		 *        from: ".recipe",
		 *        to: "#trash"
		 *      })
		 *    
		 * ### No From
		 * 
		 * If you don't provide a from, the element argument passed to syn is used.
		 * 
		 *     syn.move(
		 *          'myrecipe',
		 *          { to: "#trash" })
		 * 
		 * ### Relative
		 * 
		 * You can move the drag relative to the center of the from element.
		 * 
		 *     syn.move("myrecipe", "+20 +30");
		 *
		 * @param {HTMLElement} from the element to move
		 * @param {Object} options options to configure the drag
		 * @param {Function} callback a callback that happens after the drag motion has completed
		 */
	_move: function (from, options, callback) {
		//need to convert if elements
		var win = syn.helpers.getWindow(from),
			fro = convertOption(options.from || from, win, from),
			to = convertOption(options.to || options, win, from);

		if (options.adjust !== false) {
			adjust(fro, to, win);
		}
		startMove(fro, to, options.duration || 500, from, callback);

	},
	/**
	 * @function syn.drag drag()
	 * @parent mouse
	 * @signature `syn.drag(from, options, callback)`
	 * Creates a mousedown and drags from one point to another.
	 * Check out [syn.prototype.move move] for API details.
	 *
	 * @param {HTMLElement} from
	 * @param {Object} options
	 * @param {Object} callback
	 */
	_drag: function (from, options, callback) {
		//need to convert if elements
		var win = syn.helpers.getWindow(from),
			fro = convertOption(options.from || from, win, from),
			to = convertOption(options.to || options, win, from);

		if (options.adjust !== false) {
			adjust(fro, to, win);
		}
		startDrag(fro, to, options.duration || 500, from, callback);

	}
});

