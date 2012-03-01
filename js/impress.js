/**
 * impress.js
 *
 * impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Copyright 2011-2012 Bartek Szopka (@bartaz)
 *
 * ------------------------------------------------
 *  author:  Bartek Szopka
 *  version: 0.3
 *  url:     http://bartaz.github.com/impress.js/
 *  source:  http://github.com/bartaz/impress.js/
 */

var impress = new (function() {
  var self = this;

  // Change these before calling start() to alter the presentation configuration
  self.presenting = false;    // Presentation has not yet started. Only a single presentation is allowed at a time.
  self.root = null;           // Set this to some HTMLElement to set the root element to somehing besides #impress
  self.documentProperties = { // These properties are applied to the document element
    height: "100%"
  };
  self.bodyProperties = {     // These properties are applied to the body element when the presentation starts
    height: "100%",
    overflow: "hidden"
  }
  self.metaContent = {        // These are converted to a string and applied as the meta viewport tag's content
    'width': '1024',
    'minimum-scale': '0.75',
    'maximum-scale': '0.75',
    'user-scalable': 'no'
  }
  self.rootProperties = {     // These are applied only to the root
    top: "50%",
    left: "50%",
    perspective: "1000px"
  };
  self.canvasProperties = {   // These are applied to both the root and the canvas injected into it
    position: "absolute",
    transformOrigin: "top left",
    transition: "all 0s ease-in-out",
    transformStyle: "preserve-3d"
  };
  self.steps = null;          // Once the presentation has started, this will contain the processed slide data
  self.active_index = null;

  // Pans to the slide specified by index_or_id, which is either a css ID or an index into self.steps
  self.goto = function(index_or_id) {
    var index = index_or_id;
    if (typeof index_or_id === "string") { // TODO(jeady): CHECK THIS
      var el = self.steps.filter(function(e){return e.node.id == index_or_id;});
      if (el && el.length > 0)
        index = self.steps.indexOf(el[0]);
    }

    if (typeof index !== "number" || index < 0 || index >= self.steps.length || self.active_index == index)
      return false;

    // Sometimes it's possible to trigger focus on first link with some keyboard action.
    // Browser in such a case tries to scroll the page to make this element visible
    // (even that body overflow is set to hidden) and it breaks our careful positioning.
    //
    // So, as a lousy (and lazy) workaround we will make the page scroll back to the top
    // whenever slide is selected
    //
    // If you are reading this and know any better way to handle it, I'll be glad to hear about it!
    window.scrollTo(0, 0);

    var step = self.steps[index];
    var active = (null != self.active_index ? self.steps[self.active_index] : null);

    if (null != active)
      active.node.classList.remove("active");
    step.node.classList.add("active");

    self.root.className = "step-" + step.node.id;

    // `#/step-id` is used instead of `#step-id` to prevent default browser
    // scrolling to element in hash
    //
    // and it has to be set after animation finishes, because in chrome it
    // causes transtion being laggy
    window.clearTimeout(self.hashTimeout);
    self.hashTimeout = window.setTimeout(function() {
      window.location.hash = "#/" + step.node.id;
    },
    1000);

    // check if the transition is zooming in or not
    var zoomin = (1 / step.scale) >= (null != active ? 1 / parseFloat(active.scale) : 1);

    // if presentation starts (nothing is active yet)
    // don't animate (set duration to 0)
    var duration = (null != self.active_index) ? "1s": "0";

    css(self.root, {
      // to keep the perspective look similar for different scales
      // we need to 'scale' the perspective, too
      perspective: step.scale * 1000 + "px",
      transform: scale(1 / step.scale),
      transitionDuration: duration,
      transitionDelay: (zoomin ? "500ms": "0ms")
    });

    css(self.canvas, {
      transform: rotate(step.rotate, true) + translate(step.translate, true),
      transitionDuration: duration,
      transitionDelay: (zoomin ? "0ms": "500ms")
    });

    self.active_index = index;

    return step.node;
  };

  // Immediately pan to the previous slide
  self.prev = function() {
    return self.goto((self.active_index + self.steps.length - 1) % self.steps.length);
  };

  // Immediately pan to the next slide
  self.next = function() {
    return self.goto((self.active_index + 1) % self.steps.length);
  };

  // Takes a property that is still only implemented using vendor-specific styles and applies the correct
  // vendor-specific style for the current browser, e.g.
  //
  // setBrowserSpecificProperty("perspective")
  //   -> "WebkitPerspective"
  function setBrowserSpecificProperty(prop) {
    var style = document.body.style; // No reason for this particular tag, just want the style
    var prefixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml'];
    var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
    var props = prefixes.map(function(prefix){return prefix + ucProp;}).concat(prop);

    for (var i in props) {
      if (style[props[i]] !== undefined) {
        return props[i];
      }
    }
  } 

  // Used to ease iterating over NodeLists
  Object.prototype.arrayify = function() {
    return [].slice.call(this);
  };

  // Used to convert self.metaContent into a valid meta content string
  Object.prototype.stringify = function() {
    var fields = [];
    for (var key in this) {
      if (this.hasOwnProperty(key))
        fields.push(key + '=' + this[key]);
    }
    return fields.join(',');
  };

  var css = function(el, props) {
    var key, pkey;
    for (key in props) {
      if (props.hasOwnProperty(key)) {
        pkey = setBrowserSpecificProperty(key);
        if (pkey != null) {
          el.style[pkey] = props[key];
        }
      }
    }
    return el;
  }

  var $ = function(selector, context) {
    context = context || document;
    return context.querySelector(selector);
  };

  var translate = function(t, revert) {
    var negate = revert ? -1 : 1;
    return " translate3d(" + negate * t.x + "px," + negate * t.y + "px," + negate * t.z + "px) ";
  };

  var rotate = function(r, revert) {
    var negate = revert ? -1 : 1;
    var rX = " rotateX(" + negate * r.x + "deg) ",
    rY = " rotateY(" + negate * r.y + "deg) ",
    rZ = " rotateZ(" + negate * r.z + "deg) ";

    return revert ? rZ + rY + rX: rX + rY + rZ;
  };

  var scale = function(s) {
    return " scale(" + s + ") ";
  };

  var getElementFromUrl = function() {
    // get id from url # by removing `#` or `#/` from the beginning,
    // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
    return window.location.hash.replace(/^#\/?/, "");
  };

  // Check for browser support
  var ua = navigator.userAgent.toLowerCase();
  var impressSupported = (setBrowserSpecificProperty("perspective") != null) &&
                         (document.body.classList) &&
                         (document.body.dataset) &&
                         (ua.search(/(iphone)|(ipod)|(android)/) == - 1);

  // Call this to begin the impress presentation
  self.start = function() {

    // Only allow a single presentation at a time
    if (self.presenting)
      return;
    self.presenting = true;

    // If the user has overridden the root, use their root instead of #impress
    if (null == self.root)
      self.root = document.getElementById('impress');

    // If impress is not supported, set the error style and exit
    if (!impressSupported) {
      self.root.className = "impress-not-supported";
      return;
    } else {
      self.root.className = "";
    }

    // Set the viewport for iPad
    var meta = $("meta[name='viewport']") || document.createElement("meta");
    meta.content = self.metaContent.stringify();
    if (meta.parentNode != document.head) {
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }

    // Inject the canvas element to draw on between the root and its children
    self.canvas = document.createElement("div");
    self.canvas.className = "canvas";
    self.root.childNodes.arrayify().forEach(function(el) {
      self.canvas.appendChild(el);
    });
    self.root.appendChild(self.canvas);

    // set initial values and defaults
    css(document.documentElement, self.documentProperties);
    css(document.body, self.bodyProperties);
    css(self.root, self.canvasProperties);
    css(self.root, self.rootProperties);
    css(self.canvas, self.canvasProperties);

    self.steps = [];

    self.root.querySelectorAll(".step").arrayify().forEach(function(el, idx) {
      var data = el.dataset,
      step = {
        node: el,
        translate: {
          x: parseInt(data.x, 10) || 0,
          y: parseInt(data.y, 10) || 0,
          z: parseInt(data.z, 10) || 0
        },
        rotate: {
          x: data.rotateX || 0,
          y: data.rotateY || 0,
          z: data.rotateZ || data.rotate || 0
        },
        scale: parseFloat(data.scale) || 1,
        el: el
      };

      if (!el.id) {
        el.id = "step-" + (idx + 1);
      }

      self.steps.push(step);

      css(el, {
        position: "absolute",
        transform: "translate(-50%,-50%)" + translate(step.translate) + rotate(step.rotate) + scale(step.scale),
        transformStyle: "preserve-3d"
      });
    });

    // making given step active
    self.hashTimeout = null;



    window.addEventListener("hashchange", function() {
      self.goto(getElementFromUrl());
    },
    false);

    window.addEventListener("orientationchange", function() {
      window.scrollTo(0, 0);
    },
    false);

    // START 
    // by selecting step defined in url or first step of the presentation
    self.goto(getElementFromUrl() || 0);

    document.addEventListener("keydown", function(event) {
      switch (event.keyCode) {
      case 33: // pg up
       case 37: // left
      case 38: // up
        self.prev();
        event.preventDefault();
        break;
      case 9:  // tab
      case 32: // space
      case 34: // pg down
      case 39: // right
      case 40: // down
        self.next();
        event.preventDefault();
        break;
      }
    }, false);

    // delegated handler for clicking on the links to presentation steps
    document.addEventListener("click", function(event) {
      // event delegation with "bubbling"
      // check if event target (or any of its parents is a link)
      var target = event.target;
      while ((target.tagName != "A") && (target != document.body)) {
        target = target.parentNode;
      }

      if (target.tagName == "A") {
        var href = target.getAttribute("href");

        // if it's a link to presentation step, target this step
        if (href && href[0] == '#') {
          target = href.slice(1);
        }
      } else {
        target = target.id;
      }

      if (self.goto(target)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    false);

    // delegated handler for clicking on step elements
    document.addEventListener("click", function(event) {
      var target = event.target;
      // find closest step element
      while (!target.classList.contains("step") && (target != document.body)) {
        target = target.parentNode;
      }

      if (self.goto(target.id)) {
        event.preventDefault();
      }
    },
    false);

    // touch handler to detect taps on the left and right side of the screen
    document.addEventListener("touchstart", function(event) {
      if (event.touches.length === 1) {
        var x = event.touches[0].clientX,
        width = window.innerWidth * 0.3,
        result = null;

        if (x < width) {
          result = self.prev();
        } else if (x > window.innerWidth - width) {
          result = self.next();
        }

        if (result) {
          event.preventDefault();
        }
      }
    },
    false);
  }
})();
