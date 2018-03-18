
//allow for configuration of syn
var opts = window.syn ? window.syn : {};

var extend = function (d, s) {
	var p;
	for (p in s) {
		d[p] = s[p];
	}
	return d;
},
	// only uses browser detection for key events
	browser = {
		//msie: !! (window.attachEvent && !window.opera),
		msie: (!!(window.attachEvent && !window.opera) || (navigator.userAgent.indexOf('Trident/') > -1)),
		opera: !! window.opera,
		webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
		safari: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Chrome/') === -1,
		gecko: navigator.userAgent.indexOf('Gecko') > -1,
		mobilesafari: !! navigator.userAgent.match(/Apple.*Mobile.*Safari/),
		rhino: navigator.userAgent.match(/Rhino/) && true
	},
	createEventObject = function (type, options, element) {
		var event = element.ownerDocument.createEventObject();
		return extend(event, options);
	},
	data = {},
	id = 1,
	expando = "_synthetic" + new Date()
		.getTime(),
	bind, unbind, schedule, key = /keypress|keyup|keydown/,
	page = /load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll/,
	//this is maintained so we can click on html and blur the active element
	activeElement,

	/**
	 * @class syn
	 * @download funcunit/dist/syn.js
	 * @test funcunit/synthetic/qunit.html
	 * syn is used to simulate user actions.  It creates synthetic events and
	 * performs their default behaviors.
	 * 
	 * <h2>Basic Use</h2>
	 * The following clicks an input element with <code>id='description'</code>
	 * and then types <code>'Hello World'</code>.
	 * 
	 @codestart
	 syn.click('description', {})
	 .type("Hello World")
	 @codeend
	 * <h2>User Actions and Events</h2>
	 * <p>syn is typically used to simulate user actions as opposed to triggering events. Typing characters
	 * is an example of a user action.  The keypress that represents an <code>'a'</code>
	 * character being typed is an example of an event. 
	 * </p>
	 * <p>
	 *   While triggering events is supported, it's much more useful to simulate actual user behavior.  The 
	 *   following actions are supported by syn:
	 * </p>
	 * <ul>
	 *   <li><code>[syn.prototype.click click]</code> - a mousedown, focus, mouseup, and click.</li>
	 *   <li><code>[syn.prototype.dblclick dblclick]</code> - two <code>click!</code> events followed by a <code>dblclick</code>.</li>
	 *   <li><code>[syn.prototype.key key]</code> - types a single character (keydown, keypress, keyup).</li>
	 *   <li><code>[syn.prototype.type type]</code> - types multiple characters into an element.</li>
	 *   <li><code>[syn.prototype.move move]</code> - moves the mouse from one position to another (triggering mouseover / mouseouts).</li>
	 *   <li><code>[syn.prototype.drag drag]</code> - a mousedown, followed by mousemoves, and a mouseup.</li>
	 * </ul>
	 * All actions run asynchronously.  
	 * Click on the links above for more 
	 * information on how to use the specific action.
	 * <h2>Asynchronous Callbacks</h2>
	 * Actions don't complete immediately. This is almost 
	 * entirely because <code>focus()</code> 
	 * doesn't run immediately in IE.
	 * If you provide a callback function to syn, it will 
	 * be called after the action is completed.
	 * <br/>The following checks that "Hello World" was entered correctly: 
	 @codestart
	 syn.click('description', {})
	 .type("Hello World", function(){
	 
	 ok("Hello World" == document.getElementById('description').value)  
	 })
	 @codeend
	 <h2>Asynchronous Chaining</h2>
	 <p>You might have noticed the [syn.prototype.then then] method.  It provides chaining
	 so you can do a sequence of events with a single (final) callback.
	 </p><p>
	 If an element isn't provided to then, it uses the previous syn's element.
	 </p>
	 The following does a lot of stuff before checking the result:
	 @codestart
	 syn.type('title', 'ice water')
	 .type('description', 'ice and water')
	 .click('create', {})
	 .drag('newRecipe', {to: 'favorites'},
	 function(){
	 ok($('#newRecipe').parents('#favorites').length);
	 })
	 @codeend
	 
	 <h2>jQuery Helper</h2>
	 If jQuery is present, syn adds a triggersyn helper you can use like:
	 @codestart
	 $("#description").triggersyn("type","Hello World");
	 @codeend
	 * <h2>Key Event Recording</h2>
	 * <p>Every browser has very different rules for dispatching key events.  
	 * As there is no way to feature detect how a browser handles key events,
	 * synthetic uses a description of how the browser behaves generated
	 * by a recording application.  </p>
	 * <p>
	 * If you want to support a browser not currently supported, you can
	 * record that browser's key event description and add it to
	 * <code>syn.key.browsers</code> by it's navigator agent.
	 * </p>
	 @codestart
	 syn.key.browsers["Envjs\ Resig/20070309 PilotFish/1.2.0.10\1.6"] = {
	 'prevent':
	 {"keyup":[],"keydown":["char","keypress"],"keypress":["char"]},
	 'character':
	 { ... }
	 }
	 @codeend
	 * <h2>Limitations</h2>
	 * syn fully supports IE 6+, FF 3+, Chrome, Safari, Opera 10+.
	 * With FF 1+, drag / move events are only partially supported. They will
	 * not trigger mouseover / mouseout events.<br/>
	 * Safari crashes when a mousedown is triggered on a select.  syn will not 
	 * create this event.
	 * <h2>Contributing to syn</h2>
	 * Have we missed something? We happily accept patches.  The following are 
	 * important objects and properties of syn:
	 * <ul>
	 * <li><code>syn.create</code> - contains methods to setup, convert options, and create an event of a specific type.</li>
	 *  <li><code>syn.defaults</code> - default behavior by event type (except for keys).</li>
	 *  <li><code>syn.key.defaults</code> - default behavior by key.</li>
	 *  <li><code>syn.keycodes</code> - supported keys you can type.</li>
	 * </ul>
	 * <h2>Roll Your Own Functional Test Framework</h2>
	 * <p>syn is really the foundation of JavaScriptMVC's functional testing framework - [FuncUnit].
	 *   But, we've purposely made syn work without any dependencies in the hopes that other frameworks or 
	 *   testing solutions can use it as well.
	 * </p>
	 * @constructor
	 * @signature `syn(type, element, options, callback)`
	 * Creates a synthetic event on the element.
	 * @param {Object} type
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 * @return {syn} returns the syn object.
	 */
	syn = function (type, element, options, callback) {
		return (new syn.init(type, element, options, callback));
	};

syn.config = opts;

// helper for supporting IE8 and below:
// focus will throw in some circumnstances, like element being invisible
syn.__tryFocus = function tryFocus(element) {
	try {
		element.focus();
	} catch (e) {}
};

bind = function (el, ev, f) {
	return el.addEventListener ? el.addEventListener(ev, f, false) : el.attachEvent("on" + ev, f);
};
unbind = function (el, ev, f) {
	return el.addEventListener ? el.removeEventListener(ev, f, false) : el.detachEvent("on" + ev, f);
};

schedule = syn.config.schedule || function (fn, ms) {
	setTimeout(fn, ms);
};
/**
 * @Static
 */
extend(syn, {
	/**
	 * Creates a new synthetic event instance
	 * @hide
	 * @param {String} type
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 */
	init: function (type, element, options, callback) {
		var args = syn.args(options, element, callback),
			self = this;
		this.queue = [];
		this.element = args.element;

		//run event
		if (typeof this[type] === "function") {
			this[type](args.element, args.options, function (defaults, el) {
				if (args.callback) {
					args.callback.apply(self, arguments);
				}
				self.done.apply(self, arguments);
			});
		} else {
			this.result = syn.trigger(args.element, type, args.options);
			if (args.callback) {
				args.callback.call(this, args.element, this.result);
			}
		}
	},
	jquery: function (el, fast) {
		if (window.FuncUnit && window.FuncUnit.jQuery) {
			return window.FuncUnit.jQuery;
		}
		if (el) {
			return syn.helpers.getWindow(el)
				.jQuery || window.jQuery;
		} else {
			return window.jQuery;
		}
	},
	/**
	 * Returns an object with the args for a syn.
	 * @hide
	 * @return {Object}
	 */
	args: function () {
		var res = {},
			i = 0;
		for (; i < arguments.length; i++) {
			if (typeof arguments[i] === 'function') {
				res.callback = arguments[i];
			} else if (arguments[i] && arguments[i].jquery) {
				res.element = arguments[i][0];
			} else if (arguments[i] && arguments[i].nodeName) {
				res.element = arguments[i];
			} else if (res.options && typeof arguments[i] === 'string') { //we can get by id
				res.element = document.getElementById(arguments[i]);
			} else if (arguments[i]) {
				res.options = arguments[i];
			}
		}
		return res;
	},
	click: function (element, options, callback) {
		syn('click!', element, options, callback);
	},
	/**
	 * @hide
	 * @attribute defaults
	 * Default actions for events.  Each default function is called with this as its
	 * element.  It should return true if a timeout
	 * should happen after it.  If it returns an element, a timeout will happen
	 * and the next event will happen on that element.
	 */
	defaults: {
		focus: function focus() {
			if (!syn.support.focusChanges) {
				var element = this,
					nodeName = element.nodeName.toLowerCase();
				syn.data(element, "syntheticvalue", element.value);

				//TODO, this should be textarea too
				//and this might be for only text style inputs ... hmmmmm ....
				if (nodeName === "input" || nodeName === "textarea") {
					bind(element, "blur", function blur() {
						if (syn.data(element, "syntheticvalue") !== element.value) {

							syn.trigger(element, "change", {});
						}
						unbind(element, "blur", blur);
					});

				}
			}
		},
		submit: function () {
			syn.onParents(this, function (el) {
				if (el.nodeName.toLowerCase() === 'form') {
					el.submit();
					return false;
				}
			});
		}
	},
	changeOnBlur: function (element, prop, value) {

		bind(element, "blur", function onblur() {
			if (value !== element[prop]) {
				syn.trigger(element, "change", {});
			}
			unbind(element, "blur", onblur);
		});

	},
	/**
	 * Returns the closest element of a particular type.
	 * @hide
	 * @param {Object} el
	 * @param {Object} type
	 */
	closest: function (el, type) {
		while (el && el.nodeName.toLowerCase() !== type.toLowerCase()) {
			el = el.parentNode;
		}
		return el;
	},
	/**
	 * adds jQuery like data (adds an expando) and data exists FOREVER :)
	 * @hide
	 * @param {Object} el
	 * @param {Object} key
	 * @param {Object} value
	 */
	data: function (el, key, value) {
		var d;
		if (!el[expando]) {
			el[expando] = id++;
		}
		if (!data[el[expando]]) {
			data[el[expando]] = {};
		}
		d = data[el[expando]];
		if (value) {
			data[el[expando]][key] = value;
		} else {
			return data[el[expando]][key];
		}
	},
	/**
	 * Calls a function on the element and all parents of the element until the function returns
	 * false.
	 * @hide
	 * @param {Object} el
	 * @param {Object} func
	 */
	onParents: function (el, func) {
		var res;
		while (el && res !== false) {
			res = func(el);
			el = el.parentNode;
		}
		return el;
	},
	//regex to match focusable elements
	focusable: /^(a|area|frame|iframe|label|input|select|textarea|button|html|object)$/i,
	/**
	 * Returns if an element is focusable
	 * @hide
	 * @param {Object} elem
	 */
	isFocusable: function (elem) {
		var attributeNode;

		// IE8 Standards doesn't like this on some elements
		if (elem.getAttributeNode) {
			attributeNode = elem.getAttributeNode("tabIndex");
		}

		return this.focusable.test(elem.nodeName) ||
			(attributeNode && attributeNode.specified) &&
			syn.isVisible(elem);
	},
	/**
	 * Returns if an element is visible or not
	 * @hide
	 * @param {Object} elem
	 */
	isVisible: function (elem) {
		return (elem.offsetWidth && elem.offsetHeight) || (elem.clientWidth && elem.clientHeight);
	},
	/**
	 * Gets the tabIndex as a number or null
	 * @hide
	 * @param {Object} elem
	 */
	tabIndex: function (elem) {
		var attributeNode = elem.getAttributeNode("tabIndex");
		return attributeNode && attributeNode.specified && (parseInt(elem.getAttribute('tabIndex')) || 0);
	},
	bind: bind,
	unbind: unbind,
	/**
	 * @function syn.schedule schedule()
	 * @param {Function} fn Function to be ran
	 * @param {Number} ms Milliseconds to way before calling fn
	 * @signature `syn.schedule(fn, ms)`
	 * @parent config
	 *
	 * Schedules a function to be ran later.
	 * Must be registered prior to syn loading, otherwise `setTimeout` will be
	 * used as the scheduler.
	 * @codestart
	 * syn = {
	 *   schedule: function(fn, ms) {
	 *     Platform.run.later(fn, ms);
	 *   }
	 * };
	 * @codeend
	 */
	schedule: schedule,
	browser: browser,
	//some generic helpers
	helpers: {
		createEventObject: createEventObject,
		createBasicStandardEvent: function (type, defaults, doc) {
			var event;
			try {
				event = doc.createEvent("Events");
			} catch (e2) {
				event = doc.createEvent("UIEvents");
			} finally {
				event.initEvent(type, true, true);
				extend(event, defaults);
			}
			return event;
		},
		inArray: function (item, array) {
			var i = 0;
			for (; i < array.length; i++) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		},
		getWindow: function (element) {
			if (element.ownerDocument) {
				return element.ownerDocument.defaultView || element.ownerDocument.parentWindow;
			}
		},
		extend: extend,
		scrollOffset: function (win, set) {
			var doc = win.document.documentElement,
				body = win.document.body;
			if (set) {
				window.scrollTo(set.left, set.top);

			} else {
				return {
					left: (doc && doc.scrollLeft || body && body.scrollLeft || 0) + (doc.clientLeft || 0),
					top: (doc && doc.scrollTop || body && body.scrollTop || 0) + (doc.clientTop || 0)
				};
			}

		},
		scrollDimensions: function (win) {
			var doc = win.document.documentElement,
				body = win.document.body,
				docWidth = doc.clientWidth,
				docHeight = doc.clientHeight,
				compat = win.document.compatMode === "CSS1Compat";

			return {
				height: compat && docHeight ||
					body.clientHeight || docHeight,
				width: compat && docWidth ||
					body.clientWidth || docWidth
			};
		},
		addOffset: function (options, el) {
			var jq = syn.jquery(el),
				off;
			if (typeof options === 'object' && options.clientX === undefined && options.clientY === undefined && options.pageX === undefined && options.pageY === undefined && jq) {
				el = jq(el);
				off = el.offset();
				options.pageX = off.left + el.width() / 2;
				options.pageY = off.top + el.height() / 2;
			}
		}
	},
	// place for key data
	key: {
		ctrlKey: null,
		altKey: null,
		shiftKey: null,
		metaKey: null
	},
	//triggers an event on an element, returns true if default events should be run
	/**
	 * Dispatches an event and returns true if default events should be run.
	 * @hide
	 * @param {Object} event
	 * @param {Object} element
	 * @param {Object} type
	 * @param {Object} autoPrevent
	 */
	dispatch: function (event, element, type, autoPrevent) {

		// dispatchEvent doesn't always work in IE (mostly in a popup)
		if (element.dispatchEvent && event) {
			var preventDefault = event.preventDefault,
				prevents = autoPrevent ? -1 : 0;

			//automatically prevents the default behavior for this event
			//this is to protect agianst nasty browser freezing bug in safari
			if (autoPrevent) {
				bind(element, type, function ontype(ev) {
					ev.preventDefault();
					unbind(this, type, ontype);
				});
			}

			event.preventDefault = function () {
				prevents++;
				if (++prevents > 0) {
					preventDefault.apply(this, []);
				}
			};
			element.dispatchEvent(event);
			return prevents <= 0;
		} else {
			try {
				window.event = event;
			} catch (e) {}
			//source element makes sure element is still in the document
			return element.sourceIndex <= 0 || (element.fireEvent && element.fireEvent('on' + type, event));
		}
	},
	/**
	 * @attribute
	 * @hide
	 * An object of eventType -> function that create that event.
	 */
	create: {
		//-------- PAGE EVENTS ---------------------
		page: {
			event: function (type, options, element) {
				var doc = syn.helpers.getWindow(element)
					.document || document,
					event;
				if (doc.createEvent) {
					event = doc.createEvent("Events");

					event.initEvent(type, true, true);
					return event;
				} else {
					try {
						event = createEventObject(type, options, element);
					} catch (e) {}
					return event;
				}
			}
		},
		// unique events
		focus: {
			event: function (type, options, element) {
				syn.onParents(element, function (el) {
					if (syn.isFocusable(el)) {
						if (el.nodeName.toLowerCase() !== 'html') {
							syn.__tryFocus(el);
							activeElement = el;
						} else if (activeElement) {
							// TODO: The HTML element isn't focasable in IE, but it is
							// in FF.  We should detect this and do a true focus instead
							// of just a blur
							var doc = syn.helpers.getWindow(element)
								.document;
							if (doc !== window.document) {
								return false;
							} else if (doc.activeElement) {
								doc.activeElement.blur();
								activeElement = null;
							} else {
								activeElement.blur();
								activeElement = null;
							}

						}
						return false;
					}
				});
				return true;
			}
		}
	},
	/**
	 * @attribute support
	 * @hide
	 *
	 * Feature detected properties of a browser's event system.
	 * Support has the following properties:
	 *
	 *   - `backspaceWorks` - typing a backspace removes a character
	 *   - `clickChanges` - clicking on an option element creates a change event.
	 *   - `clickSubmits` - clicking on a form button submits the form.
	 *   - `focusChanges` - focus/blur creates a change event.
	 *   - `keypressOnAnchorClicks` - Keying enter on an anchor triggers a click.
	 *   - `keypressSubmits` - enter key submits
	 *   - `keyCharacters` - typing a character shows up
	 *   - `keysOnNotFocused` - enters keys when not focused.
	 *   - `linkHrefJS` - An achor's href JavaScript is run.
	 *   - `mouseDownUpClicks` - A mousedown followed by mouseup creates a click event.
	 *   - `mouseupSubmits` - a mouseup on a form button submits the form.
	 *	 - `pointerEvents` - does this browser natively support pointer events (for newer browsers).
	 *   - `radioClickChanges` - clicking a radio button changes the radio.
	 *   - `tabKeyTabs` - A tab key changes tabs.
	 *   - `textareaCarriage` - a new line in a textarea creates a carriage return.
	 *	 - `touchEvents` - does this browser natively support touch events (for older mobile browsers, mostly).
	 *
	 *
	 */
	support: {
		clickChanges: false,
		clickSubmits: false,
		keypressSubmits: false,
		mouseupSubmits: false,
		radioClickChanges: false,
		focusChanges: false,
		linkHrefJS: false,
		keyCharacters: false,
		backspaceWorks: false,
		mouseDownUpClicks: false,
		tabKeyTabs: false,
		keypressOnAnchorClicks: false,
		optionClickBubbles: false,
		pointerEvents: false,
		touchEvents: false,		
		ready: 0
	},
	/**
	 * @function syn.trigger trigger()
	 * @parent actions
	 * @signature `syn.trigger(element, type, options)`
	 * Creates a synthetic event and dispatches it on the element.
	 * This will run any default actions for the element.
	 * Typically you want to use syn, but if you want the return value, use this.
	 * @param {HTMLElement} element
	 * @param {String} type
	 * @param {Object} options
	 * @return {Boolean} true if default events were run, false if otherwise.
	 */
	trigger: function (element, type, options) {
		if (!options) {
			options = {};
		}

		var create = syn.create,
			setup = create[type] && create[type].setup,
			kind = key.test(type) ? 'key' : (page.test(type) ? "page" : "mouse"),
			createType = create[type] || {},
			createKind = create[kind],
			event, ret, autoPrevent, dispatchEl = element;

		//any setup code?
		if (syn.support.ready === 2 && setup) {
			setup(type, options, element);
		}

		autoPrevent = options._autoPrevent;
		//get kind
		delete options._autoPrevent;

		if (createType.event) {
			ret = createType.event(type, options, element);
		} else {
			//convert options
			options = createKind.options ? createKind.options(type, options, element) : options;

			if (!syn.support.changeBubbles && /option/i.test(element.nodeName)) {
				dispatchEl = element.parentNode; //jQuery expects clicks on select
			}

			//create the event
			event = createKind.event(type, options, dispatchEl);

			//send the event
			ret = syn.dispatch(event, dispatchEl, type, autoPrevent);
		}

		if (ret && syn.support.ready === 2 && syn.defaults[type]) {
			syn.defaults[type].call(element, options, autoPrevent);
		}
		return ret;
	},
	eventSupported: function (eventName) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		var isSupported = (eventName in el);
		if (!isSupported) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	}

});
/**
 * @Prototype
 */
extend(syn.init.prototype, {
	/**
	 * @function syn.then then()
	 * @parent chained
	 * <p>
	 * Then is used to chain a sequence of actions to be run one after the other.
	 * This is useful when many asynchronous actions need to be performed before some
	 * final check needs to be made.
	 * </p>
	 * <p>The following clicks and types into the <code>id='age'</code> element and then checks that only numeric characters can be entered.</p>
	 * <h3>Example</h3>
	 * @codestart
	 * syn('click', 'age', {})
	 *   .then('type','I am 12',function(){
	 *   equals($('#age').val(),"12")
	 * })
	 * @codeend
	 * If the element argument is undefined, then the last element is used.
	 *
	 * @param {String} type The type of event or action to create: "_click", "_dblclick", "_drag", "_type".
	 * @param {String|HTMLElement} [element] A element's id or an element.  If undefined, defaults to the previous element.
	 * @param {Object} options Optiosn to pass to the event.
	 
	 * @param {Function} [callback] A function to callback after the action has run, but before any future chained actions are run.
	 */
	then: function (type, element, options, callback) {
		if (syn.autoDelay) {
			this.delay();
		}
		var args = syn.args(options, element, callback),
			self = this;

		//if stack is empty run right away
		//otherwise ... unshift it
		this.queue.unshift(function (el, prevented) {

			if (typeof this[type] === "function") {
				this.element = args.element || el;
				this[type](this.element, args.options, function (defaults, el) {
					if (args.callback) {
						args.callback.apply(self, arguments);
					}
					self.done.apply(self, arguments);
				});
			} else {
				this.result = syn.trigger(args.element, type, args.options);
				if (args.callback) {
					args.callback.call(this, args.element, this.result);
				}
				return this;
			}
		});
		return this;
	},
	/**
	 * @function syn.delay delay()
	 * @parent chained
	 * Delays the next command a set timeout.
	 * @param {Number} [timeout]
	 * @param {Function} [callback]
	 */
	delay: function (timeout, callback) {
		if (typeof timeout === 'function') {
			callback = timeout;
			timeout = null;
		}
		timeout = timeout || 600;
		var self = this;
		this.queue.unshift(function () {
			schedule(function () {
				if (callback) {
					callback.apply(self, []);
				}
				self.done.apply(self, arguments);
			}, timeout);
		});
		return this;
	},
	done: function (defaults, el) {
		if (el) {
			this.element = el;
		}
		if (this.queue.length) {
			this.queue.pop()
				.call(this, this.element, defaults);
		}

	},
	/**
	 * @function syn.click click()
	 * @parent mouse
	 * @signature `syn.click(element, options, callback, force)`
	 * Clicks an element by triggering a mousedown,
	 * mouseup,
	 * and a click event.
	 * <h3>Example</h3>
	 * @codestart
	 * syn.click('create', {}, function(){
	 *   //check something
	 * })
	 * @codeend
	 * You can also provide the coordinates of the click.
	 * If jQuery is present, it will set clientX and clientY
	 * for you.  Here's how to set it yourself:
	 * @codestart
	 * syn.click(
	 *     'create',
	 *     {clientX: 20, clientY: 100},
	 *     function(){
	 *       //check something
	 *     })
	 * @codeend
	 * You can also provide pageX and pageY and syn will convert it for you.
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Function} callback
	 */
	"_click": function (element, options, callback, force) {
		syn.helpers.addOffset(options, element);
		if(syn.support.pointerEvents){
			syn.trigger(element, 'pointerdown', options);
		}
		if(syn.support.touchEvents){
			syn.trigger(element, 'touchstart', options);				
		}
		
		syn.trigger(element, "mousedown", options);

		//timeout is b/c IE is stupid and won't call focus handlers
		schedule(function () {
			if(syn.support.pointerEvents){
				syn.trigger(element, 'pointerup', options);
			}
			if(syn.support.touchEvents){
				syn.trigger(element, 'touchend', options);				
			}	
			
			syn.trigger(element, "mouseup", options);
			if (!syn.support.mouseDownUpClicks || force) {
				syn.trigger(element, "click", options);
				callback(true);
			} else {
				//we still have to run the default (presumably)
				syn.create.click.setup('click', options, element);
				syn.defaults.click.call(element);
				//must give time for callback
				schedule(function () {
					callback(true);
				}, 1);
			}

		}, 1);
	},
	/**
	 * @function syn.rightClick rightClick()
	 * @parent mouse
	 * @signature `syn.rightClick(element, options, callback)`
	 * Right clicks in browsers that support it (everyone but opera).
	 * @param {Object} element
	 * @param {Object} options
	 * @param {Object} callback
	 */
	"_rightClick": function (element, options, callback) {
		syn.helpers.addOffset(options, element);
		var mouseopts = extend(extend({}, syn.mouse.browser.right.mouseup), options);
		if(syn.support.pointerEvents){
			syn.trigger(element, 'pointerdown', mouseopts);
		}
			
		syn.trigger(element, "mousedown", mouseopts);

		//timeout is b/c IE is stupid and won't call focus handlers
		schedule(function () {
			if(syn.support.pointerEvents){
				syn.trigger(element, 'pointerup', mouseopts);
			}
			syn.trigger(element, "mouseup", mouseopts);
			if (syn.mouse.browser.right.contextmenu) {
				syn.trigger(element, "contextmenu", extend(extend({}, syn.mouse.browser.right.contextmenu), options));
			}
			callback(true);
		}, 1);
	},
	/**
	 * @function syn.dblclick dblclick()
	 * @parent mouse
	 * @signature `syn.dblclick(element, options, callback)`
	 * Dblclicks an element.  This runs two [syn.click click] events followed by
	 * a dblclick on the element.
	 * <h3>Example</h3>
	 * @codestart
	 * syn.dblclick('open', {});
	 * @codeend
	 * @param {Object} options
	 * @param {HTMLElement} element
	 * @param {Function} callback
	 */
	"_dblclick": function (element, options, callback) {
		syn.helpers.addOffset(options, element);
		var self = this;
		this._click(element, options, function () {
			schedule(function () {
				self._click(element, options, function () {
					syn.trigger(element, "dblclick", options);
					callback(true);
				}, true);
			}, 2);

		});
	}
});

var actions = ["click", "dblclick", "move", "drag", "key", "type", 'rightClick'],
	makeAction = function (name) {
		syn[name] = function (element, options, callback) {
			return syn("_" + name, element, options, callback);
		};
		syn.init.prototype[name] = function (element, options, callback) {
			return this.then("_" + name, element, options, callback);
		};
	},
	i = 0;

for (; i < actions.length; i++) {
	makeAction(actions[i]);
}

module.exports = syn;
