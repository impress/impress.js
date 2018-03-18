
/**
 * Module dependencies.
 */

var extend = require('extend');
var encode = require('ent/encode');
var CustomEvent = require('custom-event');
var voidElements = require('void-elements');

/**
 * Module exports.
 */

exports = module.exports = serialize;
exports.serializeElement = serializeElement;
exports.serializeAttribute = serializeAttribute;
exports.serializeText = serializeText;
exports.serializeComment = serializeComment;
exports.serializeDocument = serializeDocument;
exports.serializeDoctype = serializeDoctype;
exports.serializeDocumentFragment = serializeDocumentFragment;
exports.serializeNodeList = serializeNodeList;

/**
 * Serializes any DOM node. Returns a string.
 *
 * @param {Node} node - DOM Node to serialize
 * @param {String} [context] - optional arbitrary "context" string to use (useful for event listeners)
 * @param {Function} [fn] - optional callback function to use in the "serialize" event for this call
 * @param {EventTarget} [eventTarget] - optional EventTarget instance to emit the "serialize" event on (defaults to `node`)
 * return {String}
 * @public
 */

function serialize (node, context, fn, eventTarget) {
  if (!node) return '';
  if ('function' === typeof context) {
    fn = context;
    context = null;
  }
  if (!context) context = null;

  var rtn;
  var nodeType = node.nodeType;

  if (!nodeType && 'number' === typeof node.length) {
    // assume it's a NodeList or Array of Nodes
    rtn = exports.serializeNodeList(node, context, fn);
  } else {

    if ('function' === typeof fn) {
      // one-time "serialize" event listener
      node.addEventListener('serialize', fn, false);
    }

    // emit a custom "serialize" event on `node`, in case there
    // are event listeners for custom serialization of this node
    var e = new CustomEvent('serialize', {
      bubbles: true,
      cancelable: true,
      detail: {
        serialize: null,
        context: context
      }
    });

    e.serializeTarget = node;

    var target = eventTarget || node;
    var cancelled = !target.dispatchEvent(e);

    // `e.detail.serialize` can be set to a:
    //   String - returned directly
    //   Node   - goes through serializer logic instead of `node`
    //   Anything else - get Stringified first, and then returned directly
    var s = e.detail.serialize;
    if (s != null) {
      if ('string' === typeof s) {
        rtn = s;
      } else if ('number' === typeof s.nodeType) {
        // make it go through the serialization logic
        rtn = serialize(s, context, null, target);
      } else {
        rtn = String(s);
      }
    } else if (!cancelled) {
      // default serialization logic
      switch (nodeType) {
        case 1 /* element */:
          rtn = exports.serializeElement(node, context, eventTarget);
          break;
        case 2 /* attribute */:
          rtn = exports.serializeAttribute(node);
          break;
        case 3 /* text */:
          rtn = exports.serializeText(node);
          break;
        case 8 /* comment */:
          rtn = exports.serializeComment(node);
          break;
        case 9 /* document */:
          rtn = exports.serializeDocument(node, context, eventTarget);
          break;
        case 10 /* doctype */:
          rtn = exports.serializeDoctype(node);
          break;
        case 11 /* document fragment */:
          rtn = exports.serializeDocumentFragment(node, context, eventTarget);
          break;
      }
    }

    if ('function' === typeof fn) {
      node.removeEventListener('serialize', fn, false);
    }
  }

  return rtn || '';
}

/**
 * Serialize an Attribute node.
 */

function serializeAttribute (node, opts) {
  return node.name + '="' + encode(node.value, extend({
    named: true
  }, opts)) + '"';
}

/**
 * Serialize a DOM element.
 */

function serializeElement (node, context, eventTarget) {
  var c, i, l;
  var name = node.nodeName.toLowerCase();

  // opening tag
  var r = '<' + name;

  // attributes
  for (i = 0, c = node.attributes, l = c.length; i < l; i++) {
    r += ' ' + exports.serializeAttribute(c[i]);
  }

  r += '>';

  // child nodes
  r += exports.serializeNodeList(node.childNodes, context, null, eventTarget);

  // closing tag, only for non-void elements
  if (!voidElements[name]) {
    r += '</' + name + '>';
  }

  return r;
}

/**
 * Serialize a text node.
 */

function serializeText (node, opts) {
  return encode(node.nodeValue, extend({
    named: true,
    special: { '<': true, '>': true, '&': true }
  }, opts));
}

/**
 * Serialize a comment node.
 */

function serializeComment (node) {
  return '<!--' + node.nodeValue + '-->';
}

/**
 * Serialize a Document node.
 */

function serializeDocument (node, context, eventTarget) {
  return exports.serializeNodeList(node.childNodes, context, null, eventTarget);
}

/**
 * Serialize a DOCTYPE node.
 * See: http://stackoverflow.com/a/10162353
 */

function serializeDoctype (node) {
  var r = '<!DOCTYPE ' + node.name;

  if (node.publicId) {
    r += ' PUBLIC "' + node.publicId + '"';
  }

  if (!node.publicId && node.systemId) {
    r += ' SYSTEM';
  }

  if (node.systemId) {
    r += ' "' + node.systemId + '"';
  }

  r += '>';
  return r;
}

/**
 * Serialize a DocumentFragment instance.
 */

function serializeDocumentFragment (node, context, eventTarget) {
  return exports.serializeNodeList(node.childNodes, context, null, eventTarget);
}

/**
 * Serialize a NodeList/Array of nodes.
 */

function serializeNodeList (list, context, fn, eventTarget) {
  var r = '';
  for (var i = 0, l = list.length; i < l; i++) {
    r += serialize(list[i], context, fn, eventTarget);
  }
  return r;
}
