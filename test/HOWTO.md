Testing HowTo
=============

Install and run tests
---------------------

    npm install
    npm run test
    npm run lint

QUnit is used for unit tests. Above npm command will run them under karma. You can also run the
same tests as plain qunit in Firefox (but not Chrome, due to use of iframe):

    firefox qunit_test_runner.html

For linting both jshint and jscs are used. As is customary, they are configured via
[.jshintrc](.jshintrc) and [.jscsrc](.jscsrc).


Anatomy of a unit test
----------------------

Impress.js likes to use the entire browser window, sets classes on the body element, and so on. For
this reason, we use an iframe to run each test. QUnit tests are supposed to run inside a
`<div id="qunit-fixture">` element. So in our case, the contents of that div is an iframe.

Each test consists of 2 files: A html file that contains a normal impress.js presentation, and
a js file that contains your QUnit tests. For example, see
[test/core_tests_presentation.html](test/core_tests_presentation.html) and
[test/core_tests.js](test/core_tests.js). Note that the QUnit tests run in the parent window.

[test/helpers.js](test/helpers.js) contains helper functions to create the iframe and load the
html file that contains the impress.js presentation to be tested.

An example test would therefore look like:

    QUnit.test( "Example tests", function( assert ) {
      loadIframe( "test/core_tests_presentation.html", assert, function() {
        initPresentation( assert, function() {
          var iframe = document.getElementById( "presentation-iframe" );
          var iframeDoc = iframe.contentDocument;
          var iframeWin = iframe.contentWindow;
          var step1 = iframeDoc.querySelector( "div#step-1" );

          assert.equal( step1.dataset.x, "0", "data-x attribute set to zero" );
          assert.equal( step1.dataset.y, "0", "data-y attribute set to zero" );


Where to save unit tests?
-------------------------

Tests related to a plugin are saved in the plugin folder. See for example
[src/plugins/navigation/navigation_tests.js](src/plugins/navigation/navigation_tests.js).

Tests for impress.js core, or other tests not related to one specific plugin, go under
[test/](test/).

Adding your js file to the right places
---------------------------------------

There are 3 files where you need to add your new test so that it gets run. (Yeah, see
[#658](https://github.com/impress/impress.js/issues/658) for more on that topic...)

1. qunit_test_runner.html
2. karma.conf.js
3. karma.conf-sauce.js

