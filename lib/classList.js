(function () {

if (typeof Element === "undefined" || Element.prototype.hasOwnProperty("classList")) return;

var indexOf = [].indexOf,
    slice = [].slice,
    push = [].push,
    splice = [].splice,
    join = [].join;

function DOMTokenList(el) {  
  this._element = el;
  if (el.className != this.classCache) {
    this._classCache = el.className;
    
    var classes = this._classCache.split(' '),
        i;
    for (i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  }
};

function setToClassName(el, classes) {
  el.className = classes.join(' ');
}

DOMTokenList.prototype = {
  add: function(token) {
    push.call(this, token);
    setToClassName(this._element, slice.call(this, 0));
  },
  contains: function(token) {
    return indexOf.call(this, token) !== -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    var i = indexOf.call(this, token);
    splice.call(this, i, 1);
    setToClassName(this._element, slice.call(this, 0));
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (indexOf.call(this, token) === -1) {
      this.add(token);
    } else {
      this.remove(token);
    }
  }
};

window.DOMTokenList = DOMTokenList;

Element.prototype.__defineGetter__('classList', function () {
  return new DOMTokenList(this);
});

})();
