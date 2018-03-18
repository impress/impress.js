/*syn@0.9.0#typeable*/
var syn = require('./synthetic.js');
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