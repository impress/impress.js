var TestDoc = {
	fails: 0,
	plans: 0,
	passes: 0,
	results: []
};

TestDoc.record = function(result) {
	TestDoc.results.push(result);
	if (typeof result.verdict == "boolean") {
		if (result.verdict === false) TestDoc.fails++;
		if (result.verdict === true) TestDoc.passes++;
	}
}

TestDoc.prove = function(filePath) {
	if (typeof document != "undefined" && typeof document.write != "undefined") {
		if (TestDoc.console) print = function(s) { TestDoc.console.appendChild(document.createTextNode(s+"\n")); }
		else print = function(s) { document.write(s+"<br />"); }
	}
	TestDoc.run(TestDoc.readFile(filePath));
}

TestDoc.run = function(src) {
	try { eval(src); } catch(e) { print("# ERROR! "+e); }
	
	var chunks = src.split(/\/\*t:/);
	
	var run = function(chunk) {
		// local shortcuts
		var is = TestDoc.assertEquals;
		var isnt = TestDoc.assertNotEquals;
		var plan = TestDoc.plan;
		var requires = TestDoc.requires;
		
		try { eval(chunk); } catch(e) { print("# ERROR! "+e); }
	}
	for (var start = -1, end = 0; (start = src.indexOf("/*t:", end)) > end; start = end) {
		run(
			src.substring(
				start+4,
				(end = src.indexOf("*/", start))
			)
		);
	}
}

TestDoc.Result = function(verdict, message) {
	this.verdict = verdict;
	this.message = message;
}

TestDoc.Result.prototype.toString = function() {
	if (typeof this.verdict == "boolean") {
		return (this.verdict? "ok" : "not ok") + " " + (++TestDoc.report.counter) + " - " + this.message;
	}
	
	return "# " + this.message;
}

TestDoc.requires = function(file) {
	if (!TestDoc.requires.loaded[file]) {
		load(file);
		TestDoc.requires.loaded[file] = true;
	}
}
TestDoc.requires.loaded = {};

TestDoc.report = function() {
	TestDoc.report.counter = 0;
	print("1.."+TestDoc.plans);
	for (var i = 0; i < TestDoc.results.length; i++) {
		print(TestDoc.results[i]);
	}
	print("----------------------------------------");
	if (TestDoc.fails == 0 && TestDoc.passes == TestDoc.plans) {
		print("All tests successful.");
	}
	else {
		print("Failed " + TestDoc.fails + "/" + TestDoc.plans + " tests, "+((TestDoc.plans == 0)? 0 : Math.round(TestDoc.passes/(TestDoc.passes+TestDoc.fails)*10000)/100)+"% okay. Planned to run "+TestDoc.plans+", did run "+(TestDoc.passes+TestDoc.fails)+".")
	}
}

TestDoc.plan = function(n, message) {
	TestDoc.plans += n;
	TestDoc.record(new TestDoc.Result(null, message+" ("+n+" tests)"));
}

TestDoc.assertEquals = function(a, b, message) {
	var result = (a == b);
	if (!result) message += "\n#\n# " + a + " does not equal " + b + "\n#";
	TestDoc.record(new TestDoc.Result(result, message));
}

TestDoc.assertNotEquals = function(a, b, message) {
	var result = (a != b);
	if (!result) message += "\n#\n# " + a + " equals " + b + "\n#";
	TestDoc.record(new TestDoc.Result(result, message));
}

TestDoc.readFile = (function(){
	// rhino
	if (typeof readFile == "function") {
		return function(url) {
			var text = readFile(url);
			return text || "";
		}
	}

	// a web browser
	else {
		return function(url) {
			var httpRequest;
		
			if (window.XMLHttpRequest) { // Mozilla, Safari, etc
				httpRequest = new XMLHttpRequest();
			} 
			else if (window.ActiveXObject) { // IE
				try {
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				} 
				catch (e) {
				   try {
						httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					} 
					catch (e) {
					}
				}
			}
		
			if (!httpRequest) { throw "Cannot create HTTP Request."; }
			
			httpRequest.open('GET', url, false);
			httpRequest.send('');
			if (httpRequest.readyState == 4) {
				if (httpRequest.status >= 400) {
					throw "The HTTP Request returned an error code: "+httpRequest.status;
				}
			}
			
			return httpRequest.responseText || "";
		}
	}
})();
