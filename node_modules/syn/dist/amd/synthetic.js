/*syn@0.9.0#synthetic*/
define(function (require, exports, module) {
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