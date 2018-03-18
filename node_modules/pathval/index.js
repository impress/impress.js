/**
 * ### .get(obj, path)
 *
 * Retrieve the value in an object given a string path.
 *
 * ```js
 * var obj = {
 *     prop1: {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *   , prop2: {
 *         arr: [ { nested: 'Universe' } ]
 *       , str: 'Hello again!'
 *     }
 * };
 * ```
 *
 * The following would be the results.
 *
 * ```js
 * var properties = require('tea-properties');
 * properties.get(obj, 'prop1.str'); // Hello
 * properties.get(obj, 'prop1.att[2]'); // b
 * properties.get(obj, 'prop2.arr[0].nested'); // Universe
 * ```
 *
 * @param {Object} object
 * @param {String} path
 * @return {Object} value or `undefined`
 */

exports.get = function(obj, path) {
  var parsed = exports.parse(path);
  return getPathValue(parsed, obj);
};

/**
 * ### .set(path, value, object)
 *
 * Define the value in an object at a given string path.
 *
 * ```js
 * var obj = {
 *     prop1: {
 *         arr: ['a', 'b', 'c']
 *       , str: 'Hello'
 *     }
 *   , prop2: {
 *         arr: [ { nested: 'Universe' } ]
 *       , str: 'Hello again!'
 *     }
 * };
 * ```
 *
 * The following would be acceptable.
 *
 * ```js
 * var properties = require('tea-properties');
 * properties.set(obj, 'prop1.str', 'Hello Universe!');
 * properties.set(obj, 'prop1.arr[2]', 'B');
 * properties.set(obj, 'prop2.arr[0].nested.value', { hello: 'universe' });
 * ```
 *
 * @param {Object} object
 * @param {String} path
 * @param {Mixed} value
 * @api public
 */

exports.set = function(obj, path, val) {
  var parsed = exports.parse(path);
  setPathValue(parsed, val, obj);
};

/*!
 * Helper function used to parse string object
 * paths. Use in conjunction with `getPathValue`.
 *
 *  var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 *
 * @param {String} path
 * @returns {Object} parsed
 */

exports.parse = function(path) {
  var str = (path || '').replace(/\[/g, '.[');
  var parts = str.match(/(\\\.|[^.]+?)+/g);

  return parts.map(function(value) {
    var re = /\[(\d+)\]$/
      , mArr = re.exec(value)
    if (mArr) return { i: parseFloat(mArr[1]) };
    else return { p: value };
  });
};

/*!
 * Companion function for `parsePath` that returns
 * the value located at the parsed address.
 *
 *  var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @returns {Object|Undefined} value
 */

function getPathValue(parsed, obj) {
  var tmp = obj;
  var res;

  for (var i = 0, l = parsed.length; i < l; i++) {
    var part = parsed[i];
    if (tmp) {
      if (defined(part.p)) tmp = tmp[part.p];
      else if (defined(part.i)) tmp = tmp[part.i];
      if (i == (l - 1)) res = tmp;
    } else {
      res = undefined;
    }
  }

  return res;
};

/*!
 * Companion function for `parsePath` that sets
 * the value located at a parsed address.
 *
 *  setPathValue(parsed, 'value', obj);
 *
 * @param {Object} parsed definition from `parsePath`
 * @param {*} value to use upon set
 * @param {Object} object to search and define on
 * @api private
 */

function setPathValue(parsed, val, obj) {
  var tmp = obj;
  var i = 0;
  var l = parsed.length;
  var part;

  for (; i < l; i++) {
    part = parsed[i];

    if (defined(tmp) && i == (l - 1)) {
      var x = defined(part.p) ? part.p : part.i;
      tmp[x] = val;
    } else if (defined(tmp)) {
      if (defined(part.p) && tmp[part.p]) {
        tmp = tmp[part.p];
      } else if (defined(part.i) && tmp[part.i]) {
        tmp = tmp[part.i];
      } else {
        var next = parsed[i + 1];
        var x = defined(part.p) ? part.p : part.i;
        var y = defined(next.p) ? {} : [];
        tmp[x] = y;
        tmp = tmp[x];
      }
    } else {
      if (i == (l - 1)) tmp = val;
      else if (defined(part.p)) tmp = {};
      else if (defined(part.i)) tmp = [];
    }
  }
};

/*!
 * Check if `val` is defined.
 *
 * @param {Mixed} val
 * @returns {Boolean} `true` if defined
 * @api private
 */

function defined(val) {
  return !(!val && 'undefined' === typeof val);
}
