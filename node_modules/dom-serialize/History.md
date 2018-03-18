
2.2.1 / 2015-11-05
==================

  * bump extend and void-elements (@shinnn, #1)

2.2.0 / 2015-02-13
==================

  * add support for passing `encode()` options in to `serializeAttribute()` and `serializeTextNode()`

2.1.0 / 2015-02-10
==================

  * if `e.detail.serialize` is set and the event is cancelled, still use the `e.detail.serialize` value
  * attempting to get 100% test code coverage
  * package: allow any "zuul" v1
  * test: add HTML5 Doctype test, for 100% test code coverage!
  * test: remove `console.log()` call

2.0.1 / 2015-02-03
==================

  * index: support Nodes with children for `e.detail.serialize`

2.0.0 / 2015-02-03
==================

  * README: update for `serializeTarget`
  * index: emit the "serialize" event on the node that we know is in the DOM

1.2.1 / 2015-02-03
==================

  * fix one-time callback functions on NodeLists / Arrays
  * README: fix weird spacing
  * README: add "inspect" example to readme

1.2.0 / 2015-02-02
==================

  * add support for one-time "serialize" callback functions
  * add support for a "context" argument
  * index: make `serializeDoctype()` more readable
  * README: fix typo in example output
  * README: better description

1.1.0 / 2015-01-16
==================

  * add support for Comment, Document, Doctype, DocumentFragment and NodeList types to be serialized
  * add .travis.yml file
  * add Makefile for zuul tests
  * add README.md file
  * index: run `e.detail.serialize` through all the serialize() logic
  * index: use += operator for String concatentation (faster)
  * index: use `require('ent/encode')` syntax
  * package: update "ent" to v2.2.0
  * package: rename to "dom-serialize"
  * test: add Array serialize test

1.0.0 / 2015-01-15
==================

  * index: add support for Nodes to be set on `e.data.serialize`
  * index: remove redundant `break` statements
  * test: add `e.detail.serialize` Node and Number tests
  * test: add "serialize" event tests
  * test: add initial test cases
  * package: add "string" as a keyword
  * package: add "zuul" as a dev dependency
  * package: use ~ for dep versions
  * initial commit
