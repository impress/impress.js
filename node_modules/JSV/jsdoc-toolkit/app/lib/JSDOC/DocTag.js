if (typeof JSDOC == "undefined") JSDOC = {};

/**
	@constructor
 */
JSDOC.DocTag = function(src) {
	this.init();
	if (typeof src != "undefined") {
		this.parse(src);
	}
}

/**
	Create and initialize the properties of this.
 */
JSDOC.DocTag.prototype.init = function() {
	this.title        = "";
	this.type         = "";
	this.name         = "";
	this.isOptional   = false;
	this.defaultValue = "";
	this.desc         = "";
	
	return this;
}

/**
	Populate the properties of this from the given tag src.
	@param {string} src
 */
JSDOC.DocTag.prototype.parse = function(src) {
	if (typeof src != "string") throw "src must be a string not "+(typeof src);

	try {
		src = this.nibbleTitle(src);
		if (JSDOC.PluginManager) {
			JSDOC.PluginManager.run("onDocTagSynonym", this);
		}
		
		src = this.nibbleType(src);
		
		// only some tags are allowed to have names.
		if (this.title == "param" || this.title == "property" || this.title == "config") { // @config is deprecated
			src = this.nibbleName(src);
		}
	}
	catch(e) {
		if (LOG) LOG.warn(e);
		else throw e;
	}
	this.desc = src; // whatever is left
	
	// example tags need to have whitespace preserved
	if (this.title != "example") this.desc = this.desc.trim();
	
	if (JSDOC.PluginManager) {
		JSDOC.PluginManager.run("onDocTag", this);
	}
}

/**
	Automatically called when this is stringified.
 */
JSDOC.DocTag.prototype.toString = function() {
	return this.desc;
}

/*t:
	plan(1, "testing JSDOC.DocTag#toString");
	
	var tag = new JSDOC.DocTag("param {object} date A valid date.");
	is(""+tag, "A valid date.", "stringifying a tag returns the desc.");
 */

/**
	Find and shift off the title of a tag.
	@param {string} src
	@return src
 */
JSDOC.DocTag.prototype.nibbleTitle = function(src) {
	if (typeof src != "string") throw "src must be a string not "+(typeof src);
	
	var parts = src.match(/^\s*(\S+)(?:\s([\s\S]*))?$/);

	if (parts && parts[1]) this.title = parts[1];
	if (parts && parts[2]) src = parts[2];
	else src = "";
	
	return src;
}

/*t:
	plan(8, "testing JSDOC.DocTag#nibbleTitle");
	
	var tag = new JSDOC.DocTag();
	
	tag.init().nibbleTitle("aTitleGoesHere");
	is(tag.title, "aTitleGoesHere", "a title can be found in a single-word string.");
	
	var src = tag.init().nibbleTitle("aTitleGoesHere and the rest");
	is(tag.title, "aTitleGoesHere", "a title can be found in a multi-word string.");
	is(src, "and the rest", "the rest is returned when the title is nibbled off.");
	
	src = tag.init().nibbleTitle("");
	is(tag.title, "", "given an empty string the title is empty.");
	is(src, "", "the rest is empty when the tag is empty.");

	var src = tag.init().nibbleTitle(" aTitleGoesHere\n  a description");
	is(tag.title, "aTitleGoesHere", "leading and trailing spaces are not part of the title.");
	is(src, "  a description", "leading spaces (less one) are part of the description.");

	tag.init().nibbleTitle("a.Title::Goes_Here foo");
	is(tag.title, "a.Title::Goes_Here", "titles with punctuation are allowed.");
 */

/**
	Find and shift off the type of a tag.
	@requires frame/String.js
	@param {string} src
	@return src
 */
JSDOC.DocTag.prototype.nibbleType = function(src) {
	if (typeof src != "string") throw "src must be a string not "+(typeof src);
	
	if (src.match(/^\s*\{/)) {
		var typeRange = src.balance("{", "}");
		if (typeRange[1] == -1) {
			throw "Malformed comment tag ignored. Tag type requires an opening { and a closing }: "+src;
		}
		this.type = src.substring(typeRange[0]+1, typeRange[1]).trim();
		this.type = this.type.replace(/\s*,\s*/g, "|"); // multiples can be separated by , or |
		src = src.substring(typeRange[1]+1);
	}
	
	return src;
}

/*t:
	plan(5, "testing JSDOC.DocTag.parser.nibbleType");
	requires("../frame/String.js");
	
	var tag = new JSDOC.DocTag();
	
	tag.init().nibbleType("{String[]} aliases");
	is(tag.type, "String[]", "type can have non-alpha characters.");
	
	tag.init().nibbleType("{ aTypeGoesHere  } etc etc");
	is(tag.type, "aTypeGoesHere", "type is trimmed.");
	
	tag.init().nibbleType("{ oneType, twoType ,\n threeType  } etc etc");
	is(tag.type, "oneType|twoType|threeType", "multiple types can be separated by commas.");
	
	var error;
	try { tag.init().nibbleType("{widget foo"); }
	catch(e) { error = e; }
	is(typeof error, "string", "malformed tag type throws error.");
	isnt(error.indexOf("Malformed"), -1, "error message tells tag is malformed.");
 */

/**
	Find and shift off the name of a tag.
	@requires frame/String.js
	@param {string} src
	@return src
 */
JSDOC.DocTag.prototype.nibbleName = function(src) {
	if (typeof src != "string") throw "src must be a string not "+(typeof src);
	
	src = src.trim();
	
	// is optional?
	if (src.charAt(0) == "[") {
		var nameRange = src.balance("[", "]");
		if (nameRange[1] == -1) {
			throw "Malformed comment tag ignored. Tag optional name requires an opening [ and a closing ]: "+src;
		}
		this.name = src.substring(nameRange[0]+1, nameRange[1]).trim();
		this.isOptional = true;
		
		src = src.substring(nameRange[1]+1);
		
		// has default value?
		var nameAndValue = this.name.split("=");
		if (nameAndValue.length) {
			this.name = nameAndValue.shift().trim();
			this.defaultValue = nameAndValue.join("=");
		}
	}
	else {
		var parts = src.match(/^(\S+)(?:\s([\s\S]*))?$/);
		if (parts) {
			if (parts[1]) this.name = parts[1];
			if (parts[2]) src = parts[2].trim();
			else src = "";
		}
	}	

	return src;
}

/*t:
	requires("../frame/String.js");
	plan(9, "testing JSDOC.DocTag.parser.nibbleName");
	
	var tag = new JSDOC.DocTag();
	
	tag.init().nibbleName("[foo] This is a description.");
	is(tag.isOptional, true, "isOptional syntax is detected.");
	is(tag.name, "foo", "optional param name is found.");
 	
	tag.init().nibbleName("[foo] This is a description.");
	is(tag.isOptional, true, "isOptional syntax is detected when no type.");
	is(tag.name, "foo", "optional param name is found when no type.");
	
	tag.init().nibbleName("[foo=7] This is a description.");
 	is(tag.name, "foo", "optional param name is found when default value.");
 	is(tag.defaultValue, 7, "optional param default value is found when default value.");
 	
 	//tag.init().nibbleName("[foo= a value] This is a description.");
 	//is(tag.defaultValue, " a value", "optional param default value is found when default value has spaces (issue #112).");
 	
 	tag.init().nibbleName("[foo=[]] This is a description.");
 	is(tag.defaultValue, "[]", "optional param default value is found when default value is [] (issue #95).");
 	
 	tag.init().nibbleName("[foo=a=b] This is a description.");
 	is(tag.name, "foo", "optional param name is found when default value is a=b.");
 	is(tag.defaultValue, "a=b", "optional param default value is found when default value is a=b.")
 */

/*t:
	plan(32, "Testing JSDOC.DocTag.parser.");
	requires("../frame/String.js");
	
 	var tag = new JSDOC.DocTag();
 	
 	is(typeof tag, "object", "JSDOC.DocTag.parser with an empty string returns an object.");
 	is(typeof tag.title, "string", "returned object has a string property 'title'.");
 	is(typeof tag.type, "string", "returned object has a string property 'type'.");
 	is(typeof tag.name, "string", "returned object has a string property 'name'.");
 	is(typeof tag.defaultValue, "string", "returned object has a string property 'defaultValue'.");
 	is(typeof tag.isOptional, "boolean", "returned object has a boolean property 'isOptional'.");
 	is(typeof tag.desc, "string", "returned object has a string property 'desc'.");
  
  	tag = new JSDOC.DocTag("param {widget} foo");
  	is(tag.title, "param", "param title is found.");
  	is(tag.name, "foo", "param name is found when desc is missing.");
 	is(tag.desc, "", "param desc is empty when missing.");
 	
 	tag = new JSDOC.DocTag("param {object} date A valid date.");
 	is(tag.name, "date", "param name is found with a type.");
 	is(tag.type, "object", "param type is found.");
 	is(tag.desc, "A valid date.", "param desc is found with a type.");
 	
  	tag = new JSDOC.DocTag("param aName a description goes\n    here.");
	is(tag.name, "aName", "param name is found without a type.");
 	is(tag.desc, "a description goes\n    here.", "param desc is found without a type.");
 	
 	tag = new JSDOC.DocTag("param {widget}");
 	is(tag.name, "", "param name is empty when it is not given.");
	
	tag = new JSDOC.DocTag("param {widget} [foo] This is a description.");
	is(tag.name, "foo", "optional param name is found.");
	
	tag = new JSDOC.DocTag("return {aType} This is a description.");
	is(tag.type, "aType", "when return tag has no name, type is found.");
	is(tag.desc, "This is a description.", "when return tag has no name, desc is found.");
	
	tag = new JSDOC.DocTag("author Joe Coder <jcoder@example.com>");
	is(tag.title, "author", "author tag has a title.");
	is(tag.type, "", "the author tag has no type.");
	is(tag.name, "", "the author tag has no name.");
	is(tag.desc, "Joe Coder <jcoder@example.com>", "author tag has desc.");
	
	tag = new JSDOC.DocTag("private \t\n  ");
	is(tag.title, "private", "private tag has a title.");
	is(tag.type, "", "the private tag has no type.");
	is(tag.name, "", "the private tag has no name.");
	is(tag.desc, "", "private tag has no desc.");

	tag = new JSDOC.DocTag("example\n   example(code);\n   more();");
	is(tag.desc, "   example(code);\n   more();", "leading whitespace (less one) in examples code is preserved.");
	
	tag = new JSDOC.DocTag("param theName  \n");
	is(tag.name, "theName", "name only is found.");
	
	tag = new JSDOC.DocTag("type theDesc  \n");
	is(tag.desc, "theDesc", "desc only is found.");
	
	tag = new JSDOC.DocTag("type {theType} \n");
	is(tag.type, "theType", "type only is found.");
	
	tag = new JSDOC.DocTag("");
	is(tag.title, "", "title is empty when tag is empty.");
 */