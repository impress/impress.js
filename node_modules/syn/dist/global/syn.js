/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod){
		if(!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, "default": true };
		for(var p in mod) {
			if(!esProps[p]) return false;
		}
		return true;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			if(useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*syn@0.9.0#synthetic*/
define('syn/synthetic', function (require, exports, module) {
    var opts = window.syn ? window.syn : {};
    var extend = function (d, s) {
            var p;
            for (p in s) {
                d[p] = s[p];
            }
            return d;
        }, browser = {
            msie: !!(window.attachEvent && !window.opera) || navigator.userAgent.indexOf('Trident/') > -1,
            opera: !!window.opera,
            webkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
            safari: navigator.userAgent.indexOf('AppleWebKit/') > -1 && navigator.userAgent.indexOf('Chrome/') === -1,
            gecko: navigator.userAgent.indexOf('Gecko') > -1,
            mobilesafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/),
            rhino: navigator.userAgent.match(/Rhino/) && true
        }, createEventObject = function (type, options, element) {
            var event = element.ownerDocument.createEventObject();
            return extend(event, options);
        }, data = {}, id = 1, expando = '_synthetic' + new Date().getTime(), bind, unbind, schedule, key = /keypress|keyup|keydown/, page = /load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll/, activeElement, syn = function (type, element, options, callback) {
            return new syn.init(type, element, options, callback);
        };
    syn.config = opts;
    syn.__tryFocus = function tryFocus(element) {
        try {
            element.focus();
        } catch (e) {
        }
    };
    bind = function (el, ev, f) {
        return el.addEventListener ? el.addEventListener(ev, f, false) : el.attachEvent('on' + ev, f);
    };
    unbind = function (el, ev, f) {
        return el.addEventListener ? el.removeEventListener(ev, f, false) : el.detachEvent('on' + ev, f);
    };
    schedule = syn.config.schedule || function (fn, ms) {
        setTimeout(fn, ms);
    };
    extend(syn, {
        init: function (type, element, options, callback) {
            var args = syn.args(options, element, callback), self = this;
            this.queue = [];
            this.element = args.element;
            if (typeof this[type] === 'function') {
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
                return syn.helpers.getWindow(el).jQuery || window.jQuery;
            } else {
                return window.jQuery;
            }
        },
        args: function () {
            var res = {}, i = 0;
            for (; i < arguments.length; i++) {
                if (typeof arguments[i] === 'function') {
                    res.callback = arguments[i];
                } else if (arguments[i] && arguments[i].jquery) {
                    res.element = arguments[i][0];
                } else if (arguments[i] && arguments[i].nodeName) {
                    res.element = arguments[i];
                } else if (res.options && typeof arguments[i] === 'string') {
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
        defaults: {
            focus: function focus() {
                if (!syn.support.focusChanges) {
                    var element = this, nodeName = element.nodeName.toLowerCase();
                    syn.data(element, 'syntheticvalue', element.value);
                    if (nodeName === 'input' || nodeName === 'textarea') {
                        bind(element, 'blur', function blur() {
                            if (syn.data(element, 'syntheticvalue') !== element.value) {
                                syn.trigger(element, 'change', {});
                            }
                            unbind(element, 'blur', blur);
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
            bind(element, 'blur', function onblur() {
                if (value !== element[prop]) {
                    syn.trigger(element, 'change', {});
                }
                unbind(element, 'blur', onblur);
            });
        },
        closest: function (el, type) {
            while (el && el.nodeName.toLowerCase() !== type.toLowerCase()) {
                el = el.parentNode;
            }
            return el;
        },
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
        onParents: function (el, func) {
            var res;
            while (el && res !== false) {
                res = func(el);
                el = el.parentNode;
            }
            return el;
        },
        focusable: /^(a|area|frame|iframe|label|input|select|textarea|button|html|object)$/i,
        isFocusable: function (elem) {
            var attributeNode;
            if (elem.getAttributeNode) {
                attributeNode = elem.getAttributeNode('tabIndex');
            }
            return this.focusable.test(elem.nodeName) || attributeNode && attributeNode.specified && syn.isVisible(elem);
        },
        isVisible: function (elem) {
            return elem.offsetWidth && elem.offsetHeight || elem.clientWidth && elem.clientHeight;
        },
        tabIndex: function (elem) {
            var attributeNode = elem.getAttributeNode('tabIndex');
            return attributeNode && attributeNode.specified && (parseInt(elem.getAttribute('tabIndex')) || 0);
        },
        bind: bind,
        unbind: unbind,
        schedule: schedule,
        browser: browser,
        helpers: {
            createEventObject: createEventObject,
            createBasicStandardEvent: function (type, defaults, doc) {
                var event;
                try {
                    event = doc.createEvent('Events');
                } catch (e2) {
                    event = doc.createEvent('UIEvents');
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
                var doc = win.document.documentElement, body = win.document.body;
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
                var doc = win.document.documentElement, body = win.document.body, docWidth = doc.clientWidth, docHeight = doc.clientHeight, compat = win.document.compatMode === 'CSS1Compat';
                return {
                    height: compat && docHeight || body.clientHeight || docHeight,
                    width: compat && docWidth || body.clientWidth || docWidth
                };
            },
            addOffset: function (options, el) {
                var jq = syn.jquery(el), off;
                if (typeof options === 'object' && options.clientX === undefined && options.clientY === undefined && options.pageX === undefined && options.pageY === undefined && jq) {
                    el = jq(el);
                    off = el.offset();
                    options.pageX = off.left + el.width() / 2;
                    options.pageY = off.top + el.height() / 2;
                }
            }
        },
        key: {
            ctrlKey: null,
            altKey: null,
            shiftKey: null,
            metaKey: null
        },
        dispatch: function (event, element, type, autoPrevent) {
            if (element.dispatchEvent && event) {
                var preventDefault = event.preventDefault, prevents = autoPrevent ? -1 : 0;
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
                } catch (e) {
                }
                return element.sourceIndex <= 0 || element.fireEvent && element.fireEvent('on' + type, event);
            }
        },
        create: {
            page: {
                event: function (type, options, element) {
                    var doc = syn.helpers.getWindow(element).document || document, event;
                    if (doc.createEvent) {
                        event = doc.createEvent('Events');
                        event.initEvent(type, true, true);
                        return event;
                    } else {
                        try {
                            event = createEventObject(type, options, element);
                        } catch (e) {
                        }
                        return event;
                    }
                }
            },
            focus: {
                event: function (type, options, element) {
                    syn.onParents(element, function (el) {
                        if (syn.isFocusable(el)) {
                            if (el.nodeName.toLowerCase() !== 'html') {
                                syn.__tryFocus(el);
                                activeElement = el;
                            } else if (activeElement) {
                                var doc = syn.helpers.getWindow(element).document;
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
        trigger: function (element, type, options) {
            if (!options) {
                options = {};
            }
            var create = syn.create, setup = create[type] && create[type].setup, kind = key.test(type) ? 'key' : page.test(type) ? 'page' : 'mouse', createType = create[type] || {}, createKind = create[kind], event, ret, autoPrevent, dispatchEl = element;
            if (syn.support.ready === 2 && setup) {
                setup(type, options, element);
            }
            autoPrevent = options._autoPrevent;
            delete options._autoPrevent;
            if (createType.event) {
                ret = createType.event(type, options, element);
            } else {
                options = createKind.options ? createKind.options(type, options, element) : options;
                if (!syn.support.changeBubbles && /option/i.test(element.nodeName)) {
                    dispatchEl = element.parentNode;
                }
                event = createKind.event(type, options, dispatchEl);
                ret = syn.dispatch(event, dispatchEl, type, autoPrevent);
            }
            if (ret && syn.support.ready === 2 && syn.defaults[type]) {
                syn.defaults[type].call(element, options, autoPrevent);
            }
            return ret;
        },
        eventSupported: function (eventName) {
            var el = document.createElement('div');
            eventName = 'on' + eventName;
            var isSupported = eventName in el;
            if (!isSupported) {
                el.setAttribute(eventName, 'return;');
                isSupported = typeof el[eventName] === 'function';
            }
            el = null;
            return isSupported;
        }
    });
    extend(syn.init.prototype, {
        then: function (type, element, options, callback) {
            if (syn.autoDelay) {
                this.delay();
            }
            var args = syn.args(options, element, callback), self = this;
            this.queue.unshift(function (el, prevented) {
                if (typeof this[type] === 'function') {
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
                this.queue.pop().call(this, this.element, defaults);
            }
        },
        '_click': function (element, options, callback, force) {
            syn.helpers.addOffset(options, element);
            if (syn.support.pointerEvents) {
                syn.trigger(element, 'pointerdown', options);
            }
            if (syn.support.touchEvents) {
                syn.trigger(element, 'touchstart', options);
            }
            syn.trigger(element, 'mousedown', options);
            schedule(function () {
                if (syn.support.pointerEvents) {
                    syn.trigger(element, 'pointerup', options);
                }
                if (syn.support.touchEvents) {
                    syn.trigger(element, 'touchend', options);
                }
                syn.trigger(element, 'mouseup', options);
                if (!syn.support.mouseDownUpClicks || force) {
                    syn.trigger(element, 'click', options);
                    callback(true);
                } else {
                    syn.create.click.setup('click', options, element);
                    syn.defaults.click.call(element);
                    schedule(function () {
                        callback(true);
                    }, 1);
                }
            }, 1);
        },
        '_rightClick': function (element, options, callback) {
            syn.helpers.addOffset(options, element);
            var mouseopts = extend(extend({}, syn.mouse.browser.right.mouseup), options);
            if (syn.support.pointerEvents) {
                syn.trigger(element, 'pointerdown', mouseopts);
            }
            syn.trigger(element, 'mousedown', mouseopts);
            schedule(function () {
                if (syn.support.pointerEvents) {
                    syn.trigger(element, 'pointerup', mouseopts);
                }
                syn.trigger(element, 'mouseup', mouseopts);
                if (syn.mouse.browser.right.contextmenu) {
                    syn.trigger(element, 'contextmenu', extend(extend({}, syn.mouse.browser.right.contextmenu), options));
                }
                callback(true);
            }, 1);
        },
        '_dblclick': function (element, options, callback) {
            syn.helpers.addOffset(options, element);
            var self = this;
            this._click(element, options, function () {
                schedule(function () {
                    self._click(element, options, function () {
                        syn.trigger(element, 'dblclick', options);
                        callback(true);
                    }, true);
                }, 2);
            });
        }
    });
    var actions = [
            'click',
            'dblclick',
            'move',
            'drag',
            'key',
            'type',
            'rightClick'
        ], makeAction = function (name) {
            syn[name] = function (element, options, callback) {
                return syn('_' + name, element, options, callback);
            };
            syn.init.prototype[name] = function (element, options, callback) {
                return this.then('_' + name, element, options, callback);
            };
        }, i = 0;
    for (; i < actions.length; i++) {
        makeAction(actions[i]);
    }
    module.exports = syn;
});
/*syn@0.9.0#mouse*/
define('syn/mouse', function (require, exports, module) {
    var syn = require('syn/synthetic');
    var h = syn.helpers, getWin = h.getWindow;
    syn.mouse = {};
    h.extend(syn.defaults, {
        mousedown: function (options) {
            syn.trigger(this, 'focus', {});
        },
        click: function () {
            var element = this, href, type, createChange, radioChanged, nodeName, scope;
            try {
                href = element.href;
                type = element.type;
                createChange = syn.data(element, 'createChange');
                radioChanged = syn.data(element, 'radioChanged');
                scope = getWin(element);
                nodeName = element.nodeName.toLowerCase();
            } catch (e) {
                return;
            }
            if (!syn.support.linkHrefJS && /^\s*javascript:/.test(href)) {
                var code = href.replace(/^\s*javascript:/, '');
                if (code !== '//' && code.indexOf('void(0)') === -1) {
                    if (window.selenium) {
                        eval('with(selenium.browserbot.getCurrentWindow()){' + code + '}');
                    } else {
                        eval('with(scope){' + code + '}');
                    }
                }
            }
            if (!syn.support.clickSubmits && ((nodeName === 'input' || nodeName === 'button') && type === 'submit')) {
                var form = syn.closest(element, 'form');
                if (form) {
                    syn.trigger(form, 'submit', {});
                }
            }
            if (nodeName === 'a' && element.href && !/^\s*javascript:/.test(href)) {
                scope.location.href = href;
            }
            if (nodeName === 'input' && type === 'checkbox') {
                if (!syn.support.clickChanges) {
                    syn.trigger(element, 'change', {});
                }
            }
            if (nodeName === 'input' && type === 'radio') {
                if (radioChanged && !syn.support.radioClickChanges) {
                    syn.trigger(element, 'change', {});
                }
            }
            if (nodeName === 'option' && createChange) {
                syn.trigger(element.parentNode, 'change', {});
                syn.data(element, 'createChange', false);
            }
        }
    });
    h.extend(syn.create, {
        mouse: {
            options: function (type, options, element) {
                var doc = document.documentElement, body = document.body, center = [
                        options.pageX || 0,
                        options.pageY || 0
                    ], left = syn.mouse.browser && syn.mouse.browser.left[type], right = syn.mouse.browser && syn.mouse.browser.right[type];
                return h.extend({
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    detail: 1,
                    screenX: 1,
                    screenY: 1,
                    clientX: options.clientX || center[0] - (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
                    clientY: options.clientY || center[1] - (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0),
                    ctrlKey: !!syn.key.ctrlKey,
                    altKey: !!syn.key.altKey,
                    shiftKey: !!syn.key.shiftKey,
                    metaKey: !!syn.key.metaKey,
                    button: left && left.button !== null ? left.button : right && right.button || (type === 'contextmenu' ? 2 : 0),
                    relatedTarget: document.documentElement
                }, options);
            },
            event: function (type, defaults, element) {
                var doc = getWin(element).document || document, event;
                if (doc.createEvent) {
                    try {
                        event = doc.createEvent('MouseEvents');
                        event.initMouseEvent(type, defaults.bubbles, defaults.cancelable, defaults.view, defaults.detail, defaults.screenX, defaults.screenY, defaults.clientX, defaults.clientY, defaults.ctrlKey, defaults.altKey, defaults.shiftKey, defaults.metaKey, defaults.button, defaults.relatedTarget);
                    } catch (e) {
                        event = h.createBasicStandardEvent(type, defaults, doc);
                    }
                    event.synthetic = true;
                    return event;
                } else {
                    try {
                        event = h.createEventObject(type, defaults, element);
                    } catch (e) {
                    }
                    return event;
                }
            }
        },
        click: {
            setup: function (type, options, element) {
                var nodeName = element.nodeName.toLowerCase();
                if (!syn.support.clickChecks && !syn.support.changeChecks && nodeName === 'input') {
                    type = element.type.toLowerCase();
                    if (type === 'checkbox') {
                        element.checked = !element.checked;
                    }
                    if (type === 'radio') {
                        if (!element.checked) {
                            try {
                                syn.data(element, 'radioChanged', true);
                            } catch (e) {
                            }
                            element.checked = true;
                        }
                    }
                }
                if (nodeName === 'a' && element.href && !/^\s*javascript:/.test(element.href)) {
                    syn.data(element, 'href', element.href);
                }
                if (/option/i.test(element.nodeName)) {
                    var child = element.parentNode.firstChild, i = -1;
                    while (child) {
                        if (child.nodeType === 1) {
                            i++;
                            if (child === element) {
                                break;
                            }
                        }
                        child = child.nextSibling;
                    }
                    if (i !== element.parentNode.selectedIndex) {
                        element.parentNode.selectedIndex = i;
                        syn.data(element, 'createChange', true);
                    }
                }
            }
        },
        mousedown: {
            setup: function (type, options, element) {
                var nn = element.nodeName.toLowerCase();
                if (syn.browser.safari && (nn === 'select' || nn === 'option')) {
                    options._autoPrevent = true;
                }
            }
        }
    });
});
/*syn@0.9.0#mouse.support*/
define('syn/mouse.support', function (require, exports, module) {
    var syn = require('syn/synthetic');
    require('syn/mouse');
    (function checkSupport() {
        if (!document.body) {
            return syn.schedule(checkSupport, 1);
        }
        window.__synthTest = function () {
            syn.support.linkHrefJS = true;
        };
        var div = document.createElement('div'), checkbox, submit, form, select;
        div.innerHTML = '<form id=\'outer\'>' + '<input name=\'checkbox\' type=\'checkbox\'/>' + '<input name=\'radio\' type=\'radio\' />' + '<input type=\'submit\' name=\'submitter\'/>' + '<input type=\'input\' name=\'inputter\'/>' + '<input name=\'one\'>' + '<input name=\'two\'/>' + '<a href=\'javascript:__synthTest()\' id=\'synlink\'></a>' + '<select><option></option></select>' + '</form>';
        document.documentElement.appendChild(div);
        form = div.firstChild;
        checkbox = form.childNodes[0];
        submit = form.childNodes[2];
        select = form.getElementsByTagName('select')[0];
        syn.trigger(form.childNodes[6], 'click', {});
        checkbox.checked = false;
        checkbox.onchange = function () {
            syn.support.clickChanges = true;
        };
        syn.trigger(checkbox, 'click', {});
        syn.support.clickChecks = checkbox.checked;
        checkbox.checked = false;
        syn.trigger(checkbox, 'change', {});
        syn.support.changeChecks = checkbox.checked;
        form.onsubmit = function (ev) {
            if (ev.preventDefault) {
                ev.preventDefault();
            }
            syn.support.clickSubmits = true;
            return false;
        };
        syn.trigger(submit, 'click', {});
        form.childNodes[1].onchange = function () {
            syn.support.radioClickChanges = true;
        };
        syn.trigger(form.childNodes[1], 'click', {});
        syn.bind(div, 'click', function onclick() {
            syn.support.optionClickBubbles = true;
            syn.unbind(div, 'click', onclick);
        });
        syn.trigger(select.firstChild, 'click', {});
        syn.support.changeBubbles = syn.eventSupported('change');
        div.onclick = function () {
            syn.support.mouseDownUpClicks = true;
        };
        syn.trigger(div, 'mousedown', {});
        syn.trigger(div, 'mouseup', {});
        document.documentElement.removeChild(div);
        syn.support.pointerEvents = syn.eventSupported('pointerdown');
        syn.support.touchEvents = syn.eventSupported('touchstart');
        syn.support.ready++;
    }());
});
/*syn@0.9.0#browsers*/
define('syn/browsers', function (require, exports, module) {
    var syn = require('syn/synthetic');
    require('syn/mouse');
    syn.key.browsers = {
        webkit: {
            'prevent': {
                'keyup': [],
                'keydown': [
                    'char',
                    'keypress'
                ],
                'keypress': ['char']
            },
            'character': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    'char',
                    'char'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'specialChars': {
                'keydown': [
                    0,
                    'char'
                ],
                'keyup': [
                    0,
                    'char'
                ]
            },
            'navigation': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'special': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'tab': {
                'keydown': [
                    0,
                    'char'
                ],
                'keyup': [
                    0,
                    'char'
                ]
            },
            'pause-break': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'caps': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'escape': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'num-lock': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'scroll-lock': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'print': {
                'keyup': [
                    0,
                    'key'
                ]
            },
            'function': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            '\r': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    'char',
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            }
        },
        gecko: {
            'prevent': {
                'keyup': [],
                'keydown': ['char'],
                'keypress': ['char']
            },
            'character': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    'char',
                    0
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'specialChars': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'navigation': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'special': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            '\t': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'pause-break': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'caps': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'escape': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'num-lock': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'scroll-lock': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            'print': {
                'keyup': [
                    0,
                    'key'
                ]
            },
            'function': {
                'keydown': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            },
            '\r': {
                'keydown': [
                    0,
                    'key'
                ],
                'keypress': [
                    0,
                    'key'
                ],
                'keyup': [
                    0,
                    'key'
                ]
            }
        },
        msie: {
            'prevent': {
                'keyup': [],
                'keydown': [
                    'char',
                    'keypress'
                ],
                'keypress': ['char']
            },
            'character': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'specialChars': {
                'keydown': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'char'
                ]
            },
            'navigation': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'special': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'tab': {
                'keydown': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'char'
                ]
            },
            'pause-break': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'caps': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'escape': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'num-lock': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'scroll-lock': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'print': {
                'keyup': [
                    null,
                    'key'
                ]
            },
            'function': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            '\r': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            }
        },
        opera: {
            'prevent': {
                'keyup': [],
                'keydown': [],
                'keypress': ['char']
            },
            'character': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'specialChars': {
                'keydown': [
                    null,
                    'char'
                ],
                'keypress': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'char'
                ]
            },
            'navigation': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ]
            },
            'special': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'tab': {
                'keydown': [
                    null,
                    'char'
                ],
                'keypress': [
                    null,
                    'char'
                ],
                'keyup': [
                    null,
                    'char'
                ]
            },
            'pause-break': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'caps': {
                'keydown': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'escape': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ]
            },
            'num-lock': {
                'keyup': [
                    null,
                    'key'
                ],
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ]
            },
            'scroll-lock': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            'print': {},
            'function': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            },
            '\r': {
                'keydown': [
                    null,
                    'key'
                ],
                'keypress': [
                    null,
                    'key'
                ],
                'keyup': [
                    null,
                    'key'
                ]
            }
        }
    };
    syn.mouse.browsers = {
        webkit: {
            'right': {
                'mousedown': {
                    'button': 2,
                    'which': 3
                },
                'mouseup': {
                    'button': 2,
                    'which': 3
                },
                'contextmenu': {
                    'button': 2,
                    'which': 3
                }
            },
            'left': {
                'mousedown': {
                    'button': 0,
                    'which': 1
                },
                'mouseup': {
                    'button': 0,
                    'which': 1
                },
                'click': {
                    'button': 0,
                    'which': 1
                }
            }
        },
        opera: {
            'right': {
                'mousedown': {
                    'button': 2,
                    'which': 3
                },
                'mouseup': {
                    'button': 2,
                    'which': 3
                }
            },
            'left': {
                'mousedown': {
                    'button': 0,
                    'which': 1
                },
                'mouseup': {
                    'button': 0,
                    'which': 1
                },
                'click': {
                    'button': 0,
                    'which': 1
                }
            }
        },
        msie: {
            'right': {
                'mousedown': { 'button': 2 },
                'mouseup': { 'button': 2 },
                'contextmenu': { 'button': 0 }
            },
            'left': {
                'mousedown': { 'button': 1 },
                'mouseup': { 'button': 1 },
                'click': { 'button': 0 }
            }
        },
        chrome: {
            'right': {
                'mousedown': {
                    'button': 2,
                    'which': 3
                },
                'mouseup': {
                    'button': 2,
                    'which': 3
                },
                'contextmenu': {
                    'button': 2,
                    'which': 3
                }
            },
            'left': {
                'mousedown': {
                    'button': 0,
                    'which': 1
                },
                'mouseup': {
                    'button': 0,
                    'which': 1
                },
                'click': {
                    'button': 0,
                    'which': 1
                }
            }
        },
        gecko: {
            'left': {
                'mousedown': {
                    'button': 0,
                    'which': 1
                },
                'mouseup': {
                    'button': 0,
                    'which': 1
                },
                'click': {
                    'button': 0,
                    'which': 1
                }
            },
            'right': {
                'mousedown': {
                    'button': 2,
                    'which': 3
                },
                'mouseup': {
                    'button': 2,
                    'which': 3
                },
                'contextmenu': {
                    'button': 2,
                    'which': 3
                }
            }
        }
    };
    syn.key.browser = function () {
        if (syn.key.browsers[window.navigator.userAgent]) {
            return syn.key.browsers[window.navigator.userAgent];
        }
        for (var browser in syn.browser) {
            if (syn.browser[browser] && syn.key.browsers[browser]) {
                return syn.key.browsers[browser];
            }
        }
        return syn.key.browsers.gecko;
    }();
    syn.mouse.browser = function () {
        if (syn.mouse.browsers[window.navigator.userAgent]) {
            return syn.mouse.browsers[window.navigator.userAgent];
        }
        for (var browser in syn.browser) {
            if (syn.browser[browser] && syn.mouse.browsers[browser]) {
                return syn.mouse.browsers[browser];
            }
        }
        return syn.mouse.browsers.gecko;
    }();
});
/*syn@0.9.0#typeable*/
define('syn/typeable', function (require, exports, module) {
    var syn = require('syn/synthetic');
    var typeables = [];
    var __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) {
                return i;
            }
        }
        return -1;
    };
    syn.typeable = function (fn) {
        if (__indexOf.call(typeables, fn) === -1) {
            typeables.push(fn);
        }
    };
    syn.typeable.test = function (el) {
        for (var i = 0, len = typeables.length; i < len; i++) {
            if (typeables[i](el)) {
                return true;
            }
        }
        return false;
    };
    var type = syn.typeable;
    var typeableExp = /input|textarea/i;
    type(function (el) {
        return typeableExp.test(el.nodeName);
    });
    type(function (el) {
        return __indexOf.call([
            '',
            'true'
        ], el.getAttribute('contenteditable')) !== -1;
    });
});
/*syn@0.9.0#key*/
define('syn/key', function (require, exports, module) {
    var syn = require('syn/synthetic');
    require('syn/typeable');
    require('syn/browsers');
    var h = syn.helpers, formElExp = /input|textarea/i, supportsSelection = function (el) {
            var result;
            try {
                result = el.selectionStart !== undefined && el.selectionStart !== null;
            } catch (e) {
                result = false;
            }
            return result;
        }, getSelection = function (el) {
            var real, r, start;
            if (supportsSelection(el)) {
                if (document.activeElement && document.activeElement !== el && el.selectionStart === el.selectionEnd && el.selectionStart === 0) {
                    return {
                        start: el.value.length,
                        end: el.value.length
                    };
                }
                return {
                    start: el.selectionStart,
                    end: el.selectionEnd
                };
            } else {
                try {
                    if (el.nodeName.toLowerCase() === 'input') {
                        real = h.getWindow(el).document.selection.createRange();
                        r = el.createTextRange();
                        r.setEndPoint('EndToStart', real);
                        start = r.text.length;
                        return {
                            start: start,
                            end: start + real.text.length
                        };
                    } else {
                        real = h.getWindow(el).document.selection.createRange();
                        r = real.duplicate();
                        var r2 = real.duplicate(), r3 = real.duplicate();
                        r2.collapse();
                        r3.collapse(false);
                        r2.moveStart('character', -1);
                        r3.moveStart('character', -1);
                        r.moveToElementText(el);
                        r.setEndPoint('EndToEnd', real);
                        start = r.text.length - real.text.length;
                        var end = r.text.length;
                        if (start !== 0 && r2.text === '') {
                            start += 2;
                        }
                        if (end !== 0 && r3.text === '') {
                            end += 2;
                        }
                        return {
                            start: start,
                            end: end
                        };
                    }
                } catch (e) {
                    var prop = formElExp.test(el.nodeName) ? 'value' : 'textContent';
                    return {
                        start: el[prop].length,
                        end: el[prop].length
                    };
                }
            }
        }, getFocusable = function (el) {
            var document = h.getWindow(el).document, res = [];
            var els = document.getElementsByTagName('*'), len = els.length;
            for (var i = 0; i < len; i++) {
                if (syn.isFocusable(els[i]) && els[i] !== document.documentElement) {
                    res.push(els[i]);
                }
            }
            return res;
        }, textProperty = function () {
            var el = document.createElement('span');
            return el.textContent != null ? 'textContent' : 'innerText';
        }(), getText = function (el) {
            if (formElExp.test(el.nodeName)) {
                return el.value;
            }
            return el[textProperty];
        }, setText = function (el, value) {
            if (formElExp.test(el.nodeName)) {
                el.value = value;
            } else {
                el[textProperty] = value;
            }
        };
    h.extend(syn, {
        keycodes: {
            '\b': 8,
            '\t': 9,
            '\r': 13,
            'shift': 16,
            'ctrl': 17,
            'alt': 18,
            'meta': 91,
            'pause-break': 19,
            'caps': 20,
            'escape': 27,
            'num-lock': 144,
            'scroll-lock': 145,
            'print': 44,
            'page-up': 33,
            'page-down': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'insert': 45,
            'delete': 46,
            ' ': 32,
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            'a': 65,
            'b': 66,
            'c': 67,
            'd': 68,
            'e': 69,
            'f': 70,
            'g': 71,
            'h': 72,
            'i': 73,
            'j': 74,
            'k': 75,
            'l': 76,
            'm': 77,
            'n': 78,
            'o': 79,
            'p': 80,
            'q': 81,
            'r': 82,
            's': 83,
            't': 84,
            'u': 85,
            'v': 86,
            'w': 87,
            'x': 88,
            'y': 89,
            'z': 90,
            'num0': 96,
            'num1': 97,
            'num2': 98,
            'num3': 99,
            'num4': 100,
            'num5': 101,
            'num6': 102,
            'num7': 103,
            'num8': 104,
            'num9': 105,
            '*': 106,
            '+': 107,
            'subtract': 109,
            'decimal': 110,
            'divide': 111,
            ';': 186,
            '=': 187,
            ',': 188,
            'dash': 189,
            '-': 189,
            'period': 190,
            '.': 190,
            'forward-slash': 191,
            '/': 191,
            '`': 192,
            '[': 219,
            '\\': 220,
            ']': 221,
            '\'': 222,
            'left window key': 91,
            'right window key': 92,
            'select key': 93,
            'f1': 112,
            'f2': 113,
            'f3': 114,
            'f4': 115,
            'f5': 116,
            'f6': 117,
            'f7': 118,
            'f8': 119,
            'f9': 120,
            'f10': 121,
            'f11': 122,
            'f12': 123
        },
        selectText: function (el, start, end) {
            if (supportsSelection(el)) {
                if (!end) {
                    syn.__tryFocus(el);
                    el.setSelectionRange(start, start);
                } else {
                    el.selectionStart = start;
                    el.selectionEnd = end;
                }
            } else if (el.createTextRange) {
                var r = el.createTextRange();
                r.moveStart('character', start);
                end = end || start;
                r.moveEnd('character', end - el.value.length);
                r.select();
            }
        },
        getText: function (el) {
            if (syn.typeable.test(el)) {
                var sel = getSelection(el);
                return el.value.substring(sel.start, sel.end);
            }
            var win = syn.helpers.getWindow(el);
            if (win.getSelection) {
                return win.getSelection().toString();
            } else if (win.document.getSelection) {
                return win.document.getSelection().toString();
            } else {
                return win.document.selection.createRange().text;
            }
        },
        getSelection: getSelection
    });
    h.extend(syn.key, {
        data: function (key) {
            if (syn.key.browser[key]) {
                return syn.key.browser[key];
            }
            for (var kind in syn.key.kinds) {
                if (h.inArray(key, syn.key.kinds[kind]) > -1) {
                    return syn.key.browser[kind];
                }
            }
            return syn.key.browser.character;
        },
        isSpecial: function (keyCode) {
            var specials = syn.key.kinds.special;
            for (var i = 0; i < specials.length; i++) {
                if (syn.keycodes[specials[i]] === keyCode) {
                    return specials[i];
                }
            }
        },
        options: function (key, event) {
            var keyData = syn.key.data(key);
            if (!keyData[event]) {
                return null;
            }
            var charCode = keyData[event][0], keyCode = keyData[event][1], result = {};
            if (keyCode === 'key') {
                result.keyCode = syn.keycodes[key];
            } else if (keyCode === 'char') {
                result.keyCode = key.charCodeAt(0);
            } else {
                result.keyCode = keyCode;
            }
            if (charCode === 'char') {
                result.charCode = key.charCodeAt(0);
            } else if (charCode !== null) {
                result.charCode = charCode;
            }
            if (result.keyCode) {
                result.which = result.keyCode;
            } else {
                result.which = result.charCode;
            }
            return result;
        },
        kinds: {
            special: [
                'shift',
                'ctrl',
                'alt',
                'meta',
                'caps'
            ],
            specialChars: ['\b'],
            navigation: [
                'page-up',
                'page-down',
                'end',
                'home',
                'left',
                'up',
                'right',
                'down',
                'insert',
                'delete'
            ],
            'function': [
                'f1',
                'f2',
                'f3',
                'f4',
                'f5',
                'f6',
                'f7',
                'f8',
                'f9',
                'f10',
                'f11',
                'f12'
            ]
        },
        getDefault: function (key) {
            if (syn.key.defaults[key]) {
                return syn.key.defaults[key];
            }
            for (var kind in syn.key.kinds) {
                if (h.inArray(key, syn.key.kinds[kind]) > -1 && syn.key.defaults[kind]) {
                    return syn.key.defaults[kind];
                }
            }
            return syn.key.defaults.character;
        },
        defaults: {
            'character': function (options, scope, key, force, sel) {
                if (/num\d+/.test(key)) {
                    key = key.match(/\d+/)[0];
                }
                if (force || !syn.support.keyCharacters && syn.typeable.test(this)) {
                    var current = getText(this), before = current.substr(0, sel.start), after = current.substr(sel.end), character = key;
                    setText(this, before + character + after);
                    var charLength = character === '\n' && syn.support.textareaCarriage ? 2 : character.length;
                    syn.selectText(this, before.length + charLength);
                }
            },
            'c': function (options, scope, key, force, sel) {
                if (syn.key.ctrlKey) {
                    syn.key.clipboard = syn.getText(this);
                } else {
                    syn.key.defaults.character.apply(this, arguments);
                }
            },
            'v': function (options, scope, key, force, sel) {
                if (syn.key.ctrlKey) {
                    syn.key.defaults.character.call(this, options, scope, syn.key.clipboard, true, sel);
                } else {
                    syn.key.defaults.character.apply(this, arguments);
                }
            },
            'a': function (options, scope, key, force, sel) {
                if (syn.key.ctrlKey) {
                    syn.selectText(this, 0, getText(this).length);
                } else {
                    syn.key.defaults.character.apply(this, arguments);
                }
            },
            'home': function () {
                syn.onParents(this, function (el) {
                    if (el.scrollHeight !== el.clientHeight) {
                        el.scrollTop = 0;
                        return false;
                    }
                });
            },
            'end': function () {
                syn.onParents(this, function (el) {
                    if (el.scrollHeight !== el.clientHeight) {
                        el.scrollTop = el.scrollHeight;
                        return false;
                    }
                });
            },
            'page-down': function () {
                syn.onParents(this, function (el) {
                    if (el.scrollHeight !== el.clientHeight) {
                        var ch = el.clientHeight;
                        el.scrollTop += ch;
                        return false;
                    }
                });
            },
            'page-up': function () {
                syn.onParents(this, function (el) {
                    if (el.scrollHeight !== el.clientHeight) {
                        var ch = el.clientHeight;
                        el.scrollTop -= ch;
                        return false;
                    }
                });
            },
            '\b': function (options, scope, key, force, sel) {
                if (!syn.support.backspaceWorks && syn.typeable.test(this)) {
                    var current = getText(this), before = current.substr(0, sel.start), after = current.substr(sel.end);
                    if (sel.start === sel.end && sel.start > 0) {
                        setText(this, before.substring(0, before.length - 1) + after);
                        syn.selectText(this, sel.start - 1);
                    } else {
                        setText(this, before + after);
                        syn.selectText(this, sel.start);
                    }
                }
            },
            'delete': function (options, scope, key, force, sel) {
                if (!syn.support.backspaceWorks && syn.typeable.test(this)) {
                    var current = getText(this), before = current.substr(0, sel.start), after = current.substr(sel.end);
                    if (sel.start === sel.end && sel.start <= getText(this).length - 1) {
                        setText(this, before + after.substring(1));
                    } else {
                        setText(this, before + after);
                    }
                    syn.selectText(this, sel.start);
                }
            },
            '\r': function (options, scope, key, force, sel) {
                var nodeName = this.nodeName.toLowerCase();
                if (nodeName === 'input') {
                    syn.trigger(this, 'change', {});
                }
                if (!syn.support.keypressSubmits && nodeName === 'input') {
                    var form = syn.closest(this, 'form');
                    if (form) {
                        syn.trigger(form, 'submit', {});
                    }
                }
                if (!syn.support.keyCharacters && nodeName === 'textarea') {
                    syn.key.defaults.character.call(this, options, scope, '\n', undefined, sel);
                }
                if (!syn.support.keypressOnAnchorClicks && nodeName === 'a') {
                    syn.trigger(this, 'click', {});
                }
            },
            '\t': function (options, scope) {
                var focusEls = getFocusable(this), current = null, i = 0, el, firstNotIndexed, orders = [];
                for (; i < focusEls.length; i++) {
                    orders.push([
                        focusEls[i],
                        i
                    ]);
                }
                var sort = function (order1, order2) {
                    var el1 = order1[0], el2 = order2[0], tab1 = syn.tabIndex(el1) || 0, tab2 = syn.tabIndex(el2) || 0;
                    if (tab1 === tab2) {
                        return order1[1] - order2[1];
                    } else {
                        if (tab1 === 0) {
                            return 1;
                        } else if (tab2 === 0) {
                            return -1;
                        } else {
                            return tab1 - tab2;
                        }
                    }
                };
                orders.sort(sort);
                for (i = 0; i < orders.length; i++) {
                    el = orders[i][0];
                    if (this === el) {
                        if (!syn.key.shiftKey) {
                            current = orders[i + 1][0];
                            if (!current) {
                                current = orders[0][0];
                            }
                        } else {
                            current = orders[i - 1][0];
                            if (!current) {
                                current = orders[focusEls.length - 1][0];
                            }
                        }
                    }
                }
                if (!current) {
                    current = firstNotIndexed;
                } else {
                    syn.__tryFocus(current);
                }
                return current;
            },
            'left': function (options, scope, key, force, sel) {
                if (syn.typeable.test(this)) {
                    if (syn.key.shiftKey) {
                        syn.selectText(this, sel.start === 0 ? 0 : sel.start - 1, sel.end);
                    } else {
                        syn.selectText(this, sel.start === 0 ? 0 : sel.start - 1);
                    }
                }
            },
            'right': function (options, scope, key, force, sel) {
                if (syn.typeable.test(this)) {
                    if (syn.key.shiftKey) {
                        syn.selectText(this, sel.start, sel.end + 1 > getText(this).length ? getText(this).length : sel.end + 1);
                    } else {
                        syn.selectText(this, sel.end + 1 > getText(this).length ? getText(this).length : sel.end + 1);
                    }
                }
            },
            'up': function () {
                if (/select/i.test(this.nodeName)) {
                    this.selectedIndex = this.selectedIndex ? this.selectedIndex - 1 : 0;
                }
            },
            'down': function () {
                if (/select/i.test(this.nodeName)) {
                    syn.changeOnBlur(this, 'selectedIndex', this.selectedIndex);
                    this.selectedIndex = this.selectedIndex + 1;
                }
            },
            'shift': function () {
                return null;
            },
            'ctrl': function () {
                return null;
            },
            'alt': function () {
                return null;
            },
            'meta': function () {
                return null;
            }
        }
    });
    h.extend(syn.create, {
        keydown: {
            setup: function (type, options, element) {
                if (h.inArray(options, syn.key.kinds.special) !== -1) {
                    syn.key[options + 'Key'] = element;
                }
            }
        },
        keypress: {
            setup: function (type, options, element) {
                if (syn.support.keyCharacters && !syn.support.keysOnNotFocused) {
                    syn.__tryFocus(element);
                }
            }
        },
        keyup: {
            setup: function (type, options, element) {
                if (h.inArray(options, syn.key.kinds.special) !== -1) {
                    syn.key[options + 'Key'] = null;
                }
            }
        },
        key: {
            options: function (type, options, element) {
                options = typeof options !== 'object' ? { character: options } : options;
                options = h.extend({}, options);
                if (options.character) {
                    h.extend(options, syn.key.options(options.character, type));
                    delete options.character;
                }
                options = h.extend({
                    ctrlKey: !!syn.key.ctrlKey,
                    altKey: !!syn.key.altKey,
                    shiftKey: !!syn.key.shiftKey,
                    metaKey: !!syn.key.metaKey
                }, options);
                return options;
            },
            event: function (type, options, element) {
                var doc = h.getWindow(element).document || document, event;
                if (doc.createEvent) {
                    try {
                        event = doc.createEvent('KeyEvents');
                        event.initKeyEvent(type, true, true, window, options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, options.charCode);
                    } catch (e) {
                        event = h.createBasicStandardEvent(type, options, doc);
                    }
                    event.synthetic = true;
                    return event;
                } else {
                    try {
                        event = h.createEventObject.apply(this, arguments);
                        h.extend(event, options);
                    } catch (e) {
                    }
                    return event;
                }
            }
        }
    });
    var convert = {
        'enter': '\r',
        'backspace': '\b',
        'tab': '\t',
        'space': ' '
    };
    h.extend(syn.init.prototype, {
        _key: function (element, options, callback) {
            if (/-up$/.test(options) && h.inArray(options.replace('-up', ''), syn.key.kinds.special) !== -1) {
                syn.trigger(element, 'keyup', options.replace('-up', ''));
                return callback(true, element);
            }
            var activeElement = h.getWindow(element).document.activeElement, caret = syn.typeable.test(element) && getSelection(element), key = convert[options] || options, runDefaults = syn.trigger(element, 'keydown', key), getDefault = syn.key.getDefault, prevent = syn.key.browser.prevent, defaultResult, keypressOptions = syn.key.options(key, 'keypress');
            if (runDefaults) {
                if (!keypressOptions) {
                    defaultResult = getDefault(key).call(element, keypressOptions, h.getWindow(element), key, undefined, caret);
                } else {
                    if (activeElement !== h.getWindow(element).document.activeElement) {
                        element = h.getWindow(element).document.activeElement;
                    }
                    runDefaults = syn.trigger(element, 'keypress', keypressOptions);
                    if (runDefaults) {
                        defaultResult = getDefault(key).call(element, keypressOptions, h.getWindow(element), key, undefined, caret);
                    }
                }
            } else {
                if (keypressOptions && h.inArray('keypress', prevent.keydown) === -1) {
                    if (activeElement !== h.getWindow(element).document.activeElement) {
                        element = h.getWindow(element).document.activeElement;
                    }
                    syn.trigger(element, 'keypress', keypressOptions);
                }
            }
            if (defaultResult && defaultResult.nodeName) {
                element = defaultResult;
            }
            if (defaultResult !== null) {
                syn.schedule(function () {
                    if (syn.support.oninput) {
                        syn.trigger(element, 'input', syn.key.options(key, 'input'));
                    }
                    syn.trigger(element, 'keyup', syn.key.options(key, 'keyup'));
                    callback(runDefaults, element);
                }, 1);
            } else {
                callback(runDefaults, element);
            }
            return element;
        },
        _type: function (element, options, callback) {
            var parts = (options + '').match(/(\[[^\]]+\])|([^\[])/g), self = this, runNextPart = function (runDefaults, el) {
                    var part = parts.shift();
                    if (!part) {
                        callback(runDefaults, el);
                        return;
                    }
                    el = el || element;
                    if (part.length > 1) {
                        part = part.substr(1, part.length - 2);
                    }
                    self._key(el, part, runNextPart);
                };
            runNextPart();
        }
    });
});
/*syn@0.9.0#key.support*/
define('syn/key.support', function (require, exports, module) {
    var syn = require('syn/synthetic');
    require('syn/key');
    if (!syn.config.support) {
        (function checkForSupport() {
            if (!document.body) {
                return syn.schedule(checkForSupport, 1);
            }
            var div = document.createElement('div'), checkbox, submit, form, anchor, textarea, inputter, one, doc;
            doc = document.documentElement;
            div.innerHTML = '<form id=\'outer\'>' + '<input name=\'checkbox\' type=\'checkbox\'/>' + '<input name=\'radio\' type=\'radio\' />' + '<input type=\'submit\' name=\'submitter\'/>' + '<input type=\'input\' name=\'inputter\'/>' + '<input name=\'one\'>' + '<input name=\'two\'/>' + '<a href=\'#abc\'></a>' + '<textarea>1\n2</textarea>' + '</form>';
            doc.insertBefore(div, doc.firstElementChild || doc.children[0]);
            form = div.firstChild;
            checkbox = form.childNodes[0];
            submit = form.childNodes[2];
            anchor = form.getElementsByTagName('a')[0];
            textarea = form.getElementsByTagName('textarea')[0];
            inputter = form.childNodes[3];
            one = form.childNodes[4];
            form.onsubmit = function (ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                syn.support.keypressSubmits = true;
                ev.returnValue = false;
                return false;
            };
            syn.__tryFocus(inputter);
            syn.trigger(inputter, 'keypress', '\r');
            syn.trigger(inputter, 'keypress', 'a');
            syn.support.keyCharacters = inputter.value === 'a';
            inputter.value = 'a';
            syn.trigger(inputter, 'keypress', '\b');
            syn.support.backspaceWorks = inputter.value === '';
            inputter.onchange = function () {
                syn.support.focusChanges = true;
            };
            syn.__tryFocus(inputter);
            syn.trigger(inputter, 'keypress', 'a');
            syn.__tryFocus(form.childNodes[5]);
            syn.trigger(inputter, 'keypress', 'b');
            syn.support.keysOnNotFocused = inputter.value === 'ab';
            syn.bind(anchor, 'click', function (ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                }
                syn.support.keypressOnAnchorClicks = true;
                ev.returnValue = false;
                return false;
            });
            syn.trigger(anchor, 'keypress', '\r');
            syn.support.textareaCarriage = textarea.value.length === 4;
            syn.support.oninput = 'oninput' in one;
            doc.removeChild(div);
            syn.support.ready++;
        }());
    } else {
        syn.helpers.extend(syn.support, syn.config.support);
    }
});
/*syn@0.9.0#drag*/
define('syn/drag', function (require, exports, module) {
    var syn = require('syn/synthetic');
    (function dragSupport() {
        if (!document.body) {
            syn.schedule(dragSupport, 1);
            return;
        }
        var div = document.createElement('div');
        document.body.appendChild(div);
        syn.helpers.extend(div.style, {
            width: '100px',
            height: '10000px',
            backgroundColor: 'blue',
            position: 'absolute',
            top: '10px',
            left: '0px',
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
    }());
    var elementFromPoint = function (point, element) {
            var clientX = point.clientX, clientY = point.clientY, win = syn.helpers.getWindow(element), el;
            if (syn.support.elementFromPage) {
                var off = syn.helpers.scrollOffset(win);
                clientX = clientX + off.left;
                clientY = clientY + off.top;
            }
            el = win.document.elementFromPoint ? win.document.elementFromPoint(clientX, clientY) : element;
            if (el === win.document.documentElement && (point.clientY < 0 || point.clientX < 0)) {
                return element;
            } else {
                return el;
            }
        }, createEventAtPoint = function (event, point, element) {
            var el = elementFromPoint(point, element);
            syn.trigger(el || element, event, point);
            return el;
        }, mouseMove = function (point, element, last) {
            var el = elementFromPoint(point, element);
            if (last !== el && el && last) {
                var options = syn.helpers.extend({}, point);
                options.relatedTarget = el;
                if (syn.support.pointerEvents) {
                    syn.trigger(last, 'pointerout', options);
                }
                syn.trigger(last, 'mouseout', options);
                options.relatedTarget = last;
                if (syn.support.pointerEvents) {
                    syn.trigger(el, 'pointerover', options);
                }
                syn.trigger(el, 'mouseover', options);
            }
            if (syn.support.pointerEvents) {
                syn.trigger(el || element, 'pointermove', point);
            }
            if (syn.support.touchEvents) {
                syn.trigger(el || element, 'touchmove', point);
            }
            syn.trigger(el || element, 'mousemove', point);
            return el;
        }, startMove = function (start, end, duration, element, callback) {
            var startTime = new Date(), distX = end.clientX - start.clientX, distY = end.clientY - start.clientY, win = syn.helpers.getWindow(element), current = elementFromPoint(start, element), cursor = win.document.createElement('div'), calls = 0, move;
            move = function onmove() {
                var now = new Date(), scrollOffset = syn.helpers.scrollOffset(win), fraction = (calls === 0 ? 0 : now - startTime) / duration, options = {
                        clientX: distX * fraction + start.clientX,
                        clientY: distY * fraction + start.clientY
                    };
                calls++;
                if (fraction < 1) {
                    syn.helpers.extend(cursor.style, {
                        left: options.clientX + scrollOffset.left + 2 + 'px',
                        top: options.clientY + scrollOffset.top + 2 + 'px'
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
                height: '5px',
                width: '5px',
                backgroundColor: 'red',
                position: 'absolute',
                zIndex: 19999,
                fontSize: '1px'
            });
            win.document.body.appendChild(cursor);
            move();
        }, startDrag = function (start, end, duration, element, callback) {
            if (syn.support.pointerEvents) {
                createEventAtPoint('pointerdown', start, element);
            }
            if (syn.support.touchEvents) {
                createEventAtPoint('touchstart', start, element);
            }
            createEventAtPoint('mousedown', start, element);
            startMove(start, end, duration, element, function () {
                if (syn.support.pointerEvents) {
                    createEventAtPoint('pointerup', end, element);
                }
                if (syn.support.touchEvents) {
                    createEventAtPoint('touchend', end, element);
                }
                createEventAtPoint('mouseup', end, element);
                callback();
            });
        }, center = function (el) {
            var j = syn.jquery()(el), o = j.offset();
            return {
                pageX: o.left + j.outerWidth() / 2,
                pageY: o.top + j.outerHeight() / 2
            };
        }, convertOption = function (option, win, from) {
            var page = /(\d+)[x ](\d+)/, client = /(\d+)X(\d+)/, relative = /([+-]\d+)[xX ]([+-]\d+)/, parts;
            if (typeof option === 'string' && relative.test(option) && from) {
                var cent = center(from);
                parts = option.match(relative);
                option = {
                    pageX: cent.pageX + parseInt(parts[1]),
                    pageY: cent.pageY + parseInt(parts[2])
                };
            }
            if (typeof option === 'string' && page.test(option)) {
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
        }, adjust = function (from, to, win) {
            if (from.clientY < 0) {
                var off = syn.helpers.scrollOffset(win);
                var top = off.top + from.clientY - 100, diff = top - off.top;
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
    syn.helpers.extend(syn.init.prototype, {
        _move: function (from, options, callback) {
            var win = syn.helpers.getWindow(from), fro = convertOption(options.from || from, win, from), to = convertOption(options.to || options, win, from);
            if (options.adjust !== false) {
                adjust(fro, to, win);
            }
            startMove(fro, to, options.duration || 500, from, callback);
        },
        _drag: function (from, options, callback) {
            var win = syn.helpers.getWindow(from), fro = convertOption(options.from || from, win, from), to = convertOption(options.to || options, win, from);
            if (options.adjust !== false) {
                adjust(fro, to, win);
            }
            startDrag(fro, to, options.duration || 500, from, callback);
        }
    });
});
/*syn@0.9.0#syn*/
define('syn', function (require, exports, module) {
    var syn = require('syn/synthetic');
    require('syn/mouse.support');
    require('syn/browsers');
    require('syn/key.support');
    require('syn/drag');
    window.syn = syn;
    module.exports = syn;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();