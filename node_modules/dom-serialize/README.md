dom-serialize
=============
### Serializes any DOM node into a String

[![Sauce Test Status](https://saucelabs.com/browser-matrix/dom-serialize.svg)](https://saucelabs.com/u/dom-serialize)

[![Build Status](https://travis-ci.org/webmodules/dom-serialize.svg?branch=master)](https://travis-ci.org/webmodules/dom-serialize)

It's like `outerHTML`, but it works with:

 * DOM elements
 * Text nodes
 * Attributes
 * Comment nodes
 * Documents
 * DocumentFragments
 * Doctypes
 * NodeLists / Arrays

For custom serialization logic, a "serialize" event is dispatched on
every `Node` which event listeners can override the default behavior on by
setting the `event.detail.serialize` property to a String or other Node.

The "serialize" event bubbles, so it could be a good idea to utilize
event delegation on a known root node that will be serialized.
Check the `event.serializeTarget` property to check which `Node` is
currently being serialized.


Installation
------------

``` bash
$ npm install dom-serialize
```


Example
-------

``` js
var serialize = require('dom-serialize');
var node;

// works with Text nodes
node = document.createTextNode('foo & <bar>');
console.log(serialize(node));


// works with DOM elements
node = document.createElement('body');
node.appendChild(document.createElement('strong'));
node.firstChild.appendChild(document.createTextNode('hello'));
console.log(serialize(node));


// custom "serialize" event
node.firstChild.addEventListener('serialize', function (event) {
  event.detail.serialize = 'pwn';
}, false);
console.log(serialize(node));


// you can also just pass a function in for a one-time serializer
console.log(serialize(node, function (event) {
  if (event.serializeTarget === node.firstChild) {
    // for the first child, output an ellipsis to summarize "content"
    event.detail.serialze = '…';
  } else if (event.serializeTarget !== node) {
    // any other child
    event.preventDefault();
  }
}));
```

```
foo &amp; &lt;bar&gt;
<body><strong>hello</strong></body>
<body>pwn</body>
<body>…</body>
```
