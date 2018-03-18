/**
 * @fileOverview
 * @name JsTestrun
 * @author Michael Mathews micmath@gmail.com
 * @url $HeadURL: https://jsdoc-toolkit.googlecode.com/svn/tags/jsdoc_toolkit-2.4.0/jsdoc-toolkit/app/frame/Testrun.js $
 * @revision $Id: Testrun.js 418 2008-01-15 21:40:33Z micmath $
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */
 
/**
	Yet another unit testing tool for JavaScript.
	@author Michael Mathews <a href="mailto:micmath@gmail.com">micmath@gmail.com</a>
	@param {object} testCases Properties are testcase names, values are functions to execute as tests.
*/
function testrun(testCases) {
	var ran = 0;
	for (t in testCases) {
		var result = testCases[t]();
		ran++;
	}
	
	return testrun.reportOut+"-------------------------------\n"+((testrun.fails>0)? ":( Failed "+testrun.fails+"/" : ":) Passed all ")+testrun.count+" test"+((testrun.count == 1)? "":"s")+".\n";
}


testrun.count = 0;
testrun.current = null;
testrun.passes = 0;
testrun.fails = 0;
testrun.reportOut = "";

/** @private */
testrun.report = function(text) {
	testrun.reportOut += text+"\n";
}

/**
	Check if test evaluates to true.
	@param {string} test To be evaluated.
	@param {string} message Optional. To be displayed in the report.
	@return {boolean} True if the string test evaluates to true.
*/
ok = function(test, message) {
	testrun.count++;
	
	var result;
	try {
		result = eval(test);
		
		if (result) {
			testrun.passes++;
			testrun.report("    OK "+testrun.count+" - "+((message != null)? message : ""));
		}
		else {
			testrun.fails++;
			testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));

	}
}

/**
	Check if test is same as expected.
	@param {string} test To be evaluated.
	@param {string} expected
	@param {string} message Optional. To be displayed in the report. 
	@return {boolean} True if (test == expected). Note that the comparison is not a strict equality check.
*/
is = function(test, expected, message) {
	testrun.count++;
	
	var result;
	try {
		result = eval(test);
		
		if (result == expected) {
			testrun.passes++
			testrun.report("    OK "+testrun.count+" - "+((message != null)? message : ""));
		}
		else {
			testrun.fails++
			testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));
			testrun.report("expected: "+expected);
			testrun.report("     got: "+result);
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));
		testrun.report("expected: "+expected);
		testrun.report("     got: "+result);}
}

/**
	Check if test matches pattern.
	@param {string} test To be evaluated.
	@param {string} pattern Used to create a RegExp.
	@param {string} message Optional. To be displayed in the report.
	@return {boolean} True if test matches pattern.
*/
like = function(test, pattern, message) {
	testrun.count++;

	var result;
	try {
		result = eval(test);
		var rgx = new RegExp(pattern);
		
		if (rgx.test(result)) {
			testrun.passes++
			testrun.report("    OK "+testrun.count+" - "+((message != null)? message : ""));
		}
		else {
			testrun.fails++
			testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));
			testrun.report("       this: "+result);
			testrun.report("is not like: "+pattern);
		}
	}
	catch(e) {
		testrun.fails++
		testrun.report("NOT OK "+testrun.count+" - "+((message != null)? message : ""));
	}
}