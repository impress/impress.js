/*jshint browser:true */

// TODO: This is the bootstrap file for *karma*. Poorly named (since karma is
// only one option, in this repo) but keeping the same name now to avoid
// unnecessary deviation with upstream.
// If you just want to run the tests locally, you can open /qunit_test_runner.html in Firefox.

// That's annoying: karma-qunit doesn't provide the qunit-fixture element
// https://github.com/karma-runner/karma-qunit/issues/18

// This file contains so much HTML, that we will just respectfully disagree about js
/* jshint quotmark:single */
/* global document */

var fix = document.createElement( 'div' );
fix.id = 'qunit-fixture';
fix.innerHTML = [
'\n',
'    <iframe id="presentation-iframe"\n',
'            src="SET THIS IN YOUR QUNIT TESTS"\n',
'            width="595" height="485"\n',
'            frameborder="0" marginwidth="0" marginheight="0" scrolling="no"\n',
'            style="border:1px solid #CCC; max-width: 100%;">\n',
'    </iframe>'
].join( '' );
