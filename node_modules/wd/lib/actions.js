var _ = require('lodash'),
    __slice = Array.prototype.slice,
    _ = require('lodash'),
    Webdriver = require('./webdriver'),
    Element = require('./element');

/**
 * new wd.TouchAction()
 * TouchAction constructor 
 *
 * @actions 
 */
var TouchAction = function (driver) {
  this.driver = driver;
  this.gestures = [];
};

TouchAction.prototype.addGesture = function(action, opts) {
  opts = opts || {};
  var el = opts.element || opts.el;
  if(el && !(el instanceof Element)) {
    throw new Error('Invalid element or el field passed');
  }

  // preparing opts
  var finalOpts = {};
  _(opts).each(function(value, name) {
    if(_.isNumber(value)) {
      finalOpts[name] = value;
    } else if(value instanceof Element) {
      finalOpts[name] = value.value;
    } else if(value) {
      finalOpts[name] = value;
    }
  }).value();
  if(finalOpts.el) {
    finalOpts.element = finalOpts.el;
    delete finalOpts.el;
  }

  // adding action
  this.gestures.push({
    action: action,
    options: finalOpts
  });
};

TouchAction.prototype.toJSON = function() {
  return this.gestures;
};

/**
 * touchAction.longPress({el, x, y})
 * pass el or (x,y) or both
 *
 * @actions 
 */
TouchAction.prototype.longPress = function (opts) {
  this.addGesture('longPress', opts);
  return this;
};

/**
 * touchAction.moveTo({el, x, y})
 * pass el or (x,y) or both
 *
 * @actions 
 */
TouchAction.prototype.moveTo = function (opts) {
  this.addGesture('moveTo', opts);
  return this;
};

/**
 * touchAction.press({el, x, y})
 * pass el or (x,y) or both
 *
 * @actions 
 */
TouchAction.prototype.press = function (opts) {
  this.addGesture('press', opts);
  return this;
};

/**
 * touchAction.release()
 *
 * @actions 
 */
TouchAction.prototype.release = function () {
  this.addGesture('release', {});
  return this;
};

/**
 * touchAction.tap({el, x, y, count})
 * pass el or (x,y) or both
 * count is optional
 *
 * @actions 
 */
TouchAction.prototype.tap = function (opts) {
  this.addGesture('tap', opts);
  return this;
};

/**
 * touchAction.wait({ms})
 * touchAction.wait(ms)
 * ms is optional
 *
 * @actions 
 */
TouchAction.prototype.wait = function (opts) {
  if(_.isNumber(opts)) { opts = {ms: opts}; }
  this.addGesture('wait', opts);
  return this;
};

/**
 * cancel the action
 *
 * @actions 
 */
TouchAction.prototype.cancel = function () {
  this.gestures = [];
};

/**
 * perform the action
 *
 * @actions 
 */
TouchAction.prototype.perform = function(cb) {
  if(typeof cb === 'function') {
    this.driver.performTouchAction(this, cb);
  } else {
    return this.driver.performTouchAction(this);
  }
};

/**
 * new wd.MultiAction()
 * MultiAction constructor 
 *
 * @actions 
 */
var MultiAction = function (browserOrElement) {
  if(browserOrElement instanceof Element) {
    this.element = browserOrElement;
    this.browser = this.element.browser;
  } else if (browserOrElement instanceof Webdriver) {
    this.browser = browserOrElement;
  }
  this.actions = [];
};

MultiAction.prototype.toJSON = function() {
  var output = {};
  if(this.element) { output.elementId = this.element.value; }
  output.actions = _(this.actions).map(function(action) {
    return action.toJSON();
  }).value();
  return output;
};

/**
 * multiAction.add(touchAction)
 *
 * @actions 
 */
MultiAction.prototype.add = function () {
  var actions = __slice.call(arguments, 0);
  this.actions = this.actions.concat(actions);
  return this;
};

/**
 * multiAction.cancel()
 *
 * @actions 
 */
MultiAction.prototype.cancel = function() {
  this.actions = [];
};

/**
 * multiAction.perform()
 *
 * @actions 
 */
MultiAction.prototype.perform = function(cb) {
  if(typeof cb === 'function') {
    if(this.element){
      this.element.performMultiAction(this, cb);
    } else {
      this.browser.performMultiAction(this, cb);
    }  
  } else {
    if(this.element){
      return this.element.performMultiAction(this);
    } else {
      return this.browser.performMultiAction(this);
    }    
  }
};

module.exports = {
  TouchAction: TouchAction,
  MultiAction: MultiAction
};
