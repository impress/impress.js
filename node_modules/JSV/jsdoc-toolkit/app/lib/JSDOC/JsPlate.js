/**
	@constructor
*/
JSDOC.JsPlate = function(templateFile) {
	if (templateFile) this.template = IO.readFile(templateFile);
	
	this.templateFile = templateFile;
	this.code = "";
	this.parse();
}

JSDOC.JsPlate.prototype.parse = function() {
	this.template = this.template.replace(/\{#[\s\S]+?#\}/gi, "");
	this.code = "var output=\u001e"+this.template;

	this.code = this.code.replace(
		/<for +each="(.+?)" +in="(.+?)" *>/gi, 
		function (match, eachName, inName) {
			return "\u001e;\rvar $"+eachName+"_keys = keys("+inName+");\rfor(var $"+eachName+"_i = 0; $"+eachName+"_i < $"+eachName+"_keys.length; $"+eachName+"_i++) {\rvar $"+eachName+"_last = ($"+eachName+"_i == $"+eachName+"_keys.length-1);\rvar $"+eachName+"_key = $"+eachName+"_keys[$"+eachName+"_i];\rvar "+eachName+" = "+inName+"[$"+eachName+"_key];\routput+=\u001e";
		}
	);	
	this.code = this.code.replace(/<if test="(.+?)">/g, "\u001e;\rif ($1) { output+=\u001e");
	this.code = this.code.replace(/<elseif test="(.+?)"\s*\/>/g, "\u001e;}\relse if ($1) { output+=\u001e");
	this.code = this.code.replace(/<else\s*\/>/g, "\u001e;}\relse { output+=\u001e");
	this.code = this.code.replace(/<\/(if|for)>/g, "\u001e;\r};\routput+=\u001e");
	this.code = this.code.replace(
		/\{\+\s*([\s\S]+?)\s*\+\}/gi,
		function (match, code) {
			code = code.replace(/"/g, "\u001e"); // prevent qoute-escaping of inline code
			code = code.replace(/(\r?\n)/g, " ");
			return "\u001e+ ("+code+") +\u001e";
		}
	);
	this.code = this.code.replace(
		/\{!\s*([\s\S]+?)\s*!\}/gi,
		function (match, code) {
			code = code.replace(/"/g, "\u001e"); // prevent qoute-escaping of inline code
			code = code.replace(/(\n)/g, " ");
			return "\u001e; "+code+";\routput+=\u001e";
		}
	);
	this.code = this.code+"\u001e;";

	this.code = this.code.replace(/(\r?\n)/g, "\\n");
	this.code = this.code.replace(/"/g, "\\\"");
	this.code = this.code.replace(/\u001e/g, "\"");
}

JSDOC.JsPlate.prototype.toCode = function() {
	return this.code;
}

JSDOC.JsPlate.keys = function(obj) {
	var keys = [];
	if (obj.constructor.toString().indexOf("Array") > -1) {
		for (var i = 0; i < obj.length; i++) {
			keys.push(i);
		}
	}
	else {
		for (var i in obj) {
			keys.push(i);
		}
	}
	return keys;
};

JSDOC.JsPlate.values = function(obj) {
	var values = [];
	if (obj.constructor.toString().indexOf("Array") > -1) {
		for (var i = 0; i < obj.length; i++) {
			values.push(obj[i]);
		}
	}
	else {
		for (var i in obj) {
			values.push(obj[i]);
		}
	}
	return values;
};

JSDOC.JsPlate.prototype.process = function(data, compact) {
	var keys = JSDOC.JsPlate.keys;
	var values = JSDOC.JsPlate.values;
	
	try {
		eval(this.code);
	}
	catch (e) {
		print(">> There was an error evaluating the compiled code from template: "+this.templateFile);
		print("   The error was on line "+e.lineNumber+" "+e.name+": "+e.message);
		var lines = this.code.split("\r");
		if (e.lineNumber-2 >= 0) print("line "+(e.lineNumber-1)+": "+lines[e.lineNumber-2]);
		print("line "+e.lineNumber+": "+lines[e.lineNumber-1]);
		print("");
	}
	
	if (compact) { // patch by mcbain.asm
 		// Remove lines that contain only space-characters, usually left by lines in the template
 		// which originally only contained JSPlate tags or code. This makes it easier to write
 		// non-tricky templates which still put out nice code (not bloated with extra lines).
 		// Lines purposely left blank (just a line ending) are left alone.
 		output = output.replace(/\s+?(\r?)\n/g, "$1\n");
 	}
 	
	/*debug*///print(this.code);
	return output;
}