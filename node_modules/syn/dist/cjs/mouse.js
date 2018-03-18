/*syn@0.9.0#mouse*/
var syn = require('./synthetic.js');
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