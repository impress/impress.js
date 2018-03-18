void-elements
==============

### Array of "void elements" defined by the HTML specification

Exports an Array of "void element" node names as defined by the HTML spec.

The list is programatically generated from the [latest W3C HTML draft](http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements).

[![Build Status](https://img.shields.io/travis/jadejs/void-elements/master.svg?style=flat)](https://travis-ci.org/jadejs/void-elements)
[![Developing Dependency Status](https://img.shields.io/david/dev/jadejs/void-elements.svg?style=flat)](https://david-dm.org/jadejs/void-elements#info=devDependencies)
[![NPM version](https://img.shields.io/npm/v/void-elements.svg?style=flat)](https://www.npmjs.org/package/void-elements)

Usage
-----

```js
var voidElements = require('void-elements');

assert(voidElements.indexOf('span') === -1, '<span> is not a void element');
assert(voidElements.indexOf('img') !== -1, '<img> is a void element');
```

License
-------

MIT
