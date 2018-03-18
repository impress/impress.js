1.2.0 / 2015-11-10

* package: update "browserify" to v12.0.1
* package: update "zuul" to v3.7.2
* package: update "xmlbuilder" to v4.0.0
* package: update "util-deprecate" to v1.0.2
* package: update "mocha" to v2.3.3
* package: update "base64-js" to v0.0.8
* build: omit undefined values
* travis: add node 4.0 and 4.1 to test matrix

1.1.0 / 2014-08-27
==================

 * package: update "browserify" to v5.10.1
 * package: update "zuul" to v1.10.2
 * README: add "Sauce Test Status" build badge
 * travis: use new "plistjs" sauce credentials
 * travis: set up zuul saucelabs automated testing

1.0.1 / 2014-06-25
==================

  * add .zuul.yml file for browser testing
  * remove Testling stuff
  * build: fix global variable `val` leak
  * package: use --check-leaks when running mocha tests
  * README: update examples to use preferred API
  * package: add "browser" keyword

1.0.0 / 2014-05-20
==================

  * package: remove "android-browser"
  * test: add <dict> build() test
  * test: re-add the empty string build() test
  * test: remove "fixtures" and legacy "tests" dir
  * test: add some more build() tests
  * test: add a parse() CDATA test
  * test: starting on build() tests
  * test: more parse() tests
  * package: attempt to fix "android-browser" testling
  * parse: better <data> with newline handling
  * README: add Testling badge
  * test: add <data> node tests
  * test: add a <date> parse() test
  * travis: don't test node v0.6 or v0.8
  * test: some more parse() tests
  * test: add simple <string> parsing test
  * build: add support for an optional "opts" object
  * package: test mobile devices
  * test: use multiline to inline the XML
  * package: beautify
  * package: fix "mocha" harness
  * package: more testling browsers
  * build: add the "version=1.0" attribute
  * beginnings of "mocha" tests
  * build: more JSDocs
  * tests: add test that ensures that empty string conversion works
  * build: update "xmlbuilder" to v2.2.1
  * parse: ignore comment and cdata nodes
  * tests: make the "Newlines" test actually contain a newline
  * parse: lint
  * test travis
  * README: add Travis CI badge
  * add .travis.yml file
  * build: updated DTD to reflect name change
  * parse: return falsey values in an Array plist
  * build: fix encoding a typed array in the browser
  * build: add support for Typed Arrays and ArrayBuffers
  * build: more lint
  * build: slight cleanup and optimizations
  * build: use .txt() for the "date" value
  * parse: always return a Buffer for <data> nodes
  * build: don't interpret Strings as base64
  * dist: commit prebuilt plist*.js files
  * parse: fix typo in deprecate message
  * parse: fix parse() return value
  * parse: add jsdoc comments for the deprecated APIs
  * parse: add `parse()` function
  * node, parse: use `util-deprecate` module
  * re-implemented parseFile to be asynchronous
  * node: fix jsdoc comment
  * Makefile: fix "node" require stubbing
  * examples: add "browser" example
  * package: tweak "main"
  * package: remove "engines" field
  * Makefile: fix --exclude command for browserify
  * package: update "description"
  * lib: more styling
  * Makefile: add -build.js and -parse.js dist files
  * lib: separate out the parse and build logic into their own files
  * Makefile: add makefile with browserify build rules
  * package: add "browserify" as a dev dependency
  * plist: tabs to spaces (again)
  * add a .jshintrc file
  * LICENSE: update
  * node-webkit support
  * Ignore tests/ in .npmignore file
  * Remove duplicate devDependencies key
  * Remove trailing whitespace
  * adding recent contributors. Bumping npm package number (patch release)
  * Fixed node.js string handling
  * bumping version number
  * Fixed global variable plist leak
  * patch release 0.4.1
  * removed temporary debug output file
  * flipping the cases for writing data and string elements in build(). removed the 125 length check. Added validation of base64 encoding for data fields when parsing. added unit tests.
  * fixed syntax errors in README examples (issue #20)
  * added Sync versions of calls. added deprecation warnings for old method calls. updated documentation. If the resulting object from parseStringSync is an array with 1 element, return just the element. If a plist string or file doesnt have a <plist> tag as the document root element, fail noisily (issue #15)
  * incrementing package version
  * added cross platform base64 encode/decode for data elements (issue #17.) Comments and hygiene.
  * refactored the code to use a DOM parser instead of SAX. closes issues #5 and #16
  * rolling up package version
  * updated base64 detection regexp. updated README. hygiene.
  * refactored the build function. Fixes issue #14
  * refactored tests. Modified tests from issue #9. thanks @sylvinus
  * upgrade xmlbuilder package version. this is why .end() was needed in last commit; breaking change to xmlbuilder lib. :/
  * bug fix in build function, forgot to call .end() Refactored tests to use nodeunit
  * Implemented support for real, identity tests
  * Refactored base64 detection - still sloppy, fixed date building. Passing tests OK.
  * Implemented basic plist builder that turns an existing JS object into plist XML. date, real and data types still need to be implemented.
