// This script licensed under the MIT.
// http://orgachem.mit-license.org


/**
 * Utility methods fot Jsdoc Strict Type Parser.
 * @namespace
 * @exports lib/util
 */
var util = {};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   this.superClass_.call(this, a, b, c);
 * }
 * util.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * This method is a copy from
 * {@link http://closure-library.googlecode.com/svn/docs/index.html}
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
util.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};


/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 *
 * This method is a copy from
 * {@link http://closure-library.googlecode.com/svn/docs/index.html}
 *
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
util.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * Repeats a string n times.
 *
 * This method is clone of
 * {@link http://closure-library.googlecode.com/svn/docs/index.html}.
 *
 * @param {string} string The string to repeat.
 * @param {number} length The number of times to repeat.
 * @return {string} A string containing {@code length} repetitions of
 *     {@code string}.
 */
util.repeat = function(string, length) {
  return new Array(length + 1).join(string);
};


/**
 * Warns with a message.
 * @param {string} msg Message.
 */
util.warn = function(msg) {
  if (console.warn) {
    console.warn(msg);
  }
  else {
    console.log('Warning: ' + msg);
  }
};


// Exports the namespace.
module.exports = util;
