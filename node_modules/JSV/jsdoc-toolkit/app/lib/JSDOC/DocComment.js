if (typeof JSDOC == "undefined") JSDOC = {};

/**
	Create a new DocComment. This takes a raw documentation comment,
	and wraps it in useful accessors.
	@class Represents a documentation comment object.
 */ 
JSDOC.DocComment = function(/**String*/comment) {
	this.init();
	if (typeof comment != "undefined") {
		this.parse(comment);
	}
}

JSDOC.DocComment.prototype.init = function() {
	this.isUserComment = true;
	this.src           = "";
	this.meta          = "";
	this.tagTexts      = [];
	this.tags          = [];
}

/**
	@requires JSDOC.DocTag
 */
JSDOC.DocComment.prototype.parse = function(/**String*/comment) {
	if (comment == "") {
		comment = "/** @desc */";
		this.isUserComment = false;
	}
	
	this.src = JSDOC.DocComment.unwrapComment(comment);
	
	this.meta = "";
	if (this.src.indexOf("#") == 0) {
		this.src.match(/#(.+[+-])([\s\S]*)$/);
		if (RegExp.$1) this.meta = RegExp.$1;
		if (RegExp.$2) this.src = RegExp.$2;
	}
	
	if (typeof JSDOC.PluginManager != "undefined") {
		JSDOC.PluginManager.run("onDocCommentSrc", this);
	}
	
	this.fixDesc();

	this.src = JSDOC.DocComment.shared+"\n"+this.src;
	
	this.tagTexts = 
		this.src
		.split(/(^|[\r\n])\s*@/)
		.filter(function($){return $.match(/\S/)});
	
	/**
		The tags found in the comment.
		@type JSDOC.DocTag[]
	 */
	this.tags = this.tagTexts.map(function($){return new JSDOC.DocTag($)});
	
	if (typeof JSDOC.PluginManager != "undefined") {
		JSDOC.PluginManager.run("onDocCommentTags", this);
	}
}

/*t:
	plan(5, "testing JSDOC.DocComment");
	requires("../frame/String.js");
	requires("../lib/JSDOC/DocTag.js");
	
	var com = new JSDOC.DocComment("/**@foo some\n* comment here*"+"/");
	is(com.tagTexts[0], "foo some\ncomment here", "first tag text is found.");
	is(com.tags[0].title, "foo", "the title is found in a comment with one tag.");
	
	var com = new JSDOC.DocComment("/** @foo first\n* @bar second*"+"/");
	is(com.getTag("bar").length, 1, "getTag() returns one tag by that title.");
	
	JSDOC.DocComment.shared = "@author John Smith";
	var com = new JSDOC.DocComment("/**@foo some\n* comment here*"+"/");
	is(com.tags[0].title, "author", "shared comment is added.");
	is(com.tags[1].title, "foo", "shared comment is added to existing tag.");
*/

/**
	If no @desc tag is provided, this function will add it.
 */
JSDOC.DocComment.prototype.fixDesc = function() {
	if (this.meta && this.meta != "@+") return;
	if (/^\s*[^@\s]/.test(this.src)) {				
		this.src = "@desc "+this.src;
	}
}

/*t:
	plan(5, "testing JSDOC.DocComment#fixDesc");
	
	var com = new JSDOC.DocComment();
	
	com.src = "this is a desc\n@author foo";
	com.fixDesc();
	is(com.src, "@desc this is a desc\n@author foo", "if no @desc tag is provided one is added.");

	com.src = "x";
	com.fixDesc();
	is(com.src, "@desc x", "if no @desc tag is provided one is added to a single character.");

	com.src = "\nx";
	com.fixDesc();
	is(com.src, "@desc \nx", "if no @desc tag is provided one is added to return and character.");
	
	com.src = " ";
	com.fixDesc();
	is(com.src, " ", "if no @desc tag is provided one is not added to just whitespace.");

	com.src = "";
	com.fixDesc();
	is(com.src, "", "if no @desc tag is provided one is not added to empty.");
*/

/**
	Remove slash-star comment wrapper from a raw comment string.
	@type String
 */
JSDOC.DocComment.unwrapComment = function(/**String*/comment) {
	if (!comment) return "";
	var unwrapped = comment.replace(/(^\/\*\*|\*\/$)/g, "").replace(/^\s*\* ?/gm, "");
	return unwrapped;
}

/*t:
	plan(5, "testing JSDOC.DocComment.unwrapComment");
	
	var com = "/**x*"+"/";
	var unwrapped = JSDOC.DocComment.unwrapComment(com);
	is(unwrapped, "x", "a single character jsdoc is found.");
	
	com = "/***x*"+"/";
	unwrapped = JSDOC.DocComment.unwrapComment(com);
	is(unwrapped, "x", "three stars are allowed in the opener.");
	
	com = "/****x*"+"/";
	unwrapped = JSDOC.DocComment.unwrapComment(com);
	is(unwrapped, "*x", "fourth star in the opener is kept.");
	
	com = "/**x\n * y\n*"+"/";
	unwrapped = JSDOC.DocComment.unwrapComment(com);
	is(unwrapped, "x\ny\n", "leading stars and spaces are trimmed.");
	
	com = "/**x\n *   y\n*"+"/";
	unwrapped = JSDOC.DocComment.unwrapComment(com);
	is(unwrapped, "x\n  y\n", "only first space after leading stars are trimmed.");
*/

/**
	Provides a printable version of the comment.
	@type String
 */
JSDOC.DocComment.prototype.toString = function() {
	return this.src;
}

/*t:
	plan(1, "testing JSDOC.DocComment#fixDesc");
	var com = new JSDOC.DocComment();
	com.src = "foo";
	is(""+com, "foo", "stringifying a comment returns the unwrapped src.");
*/

/**
	Given the title of a tag, returns all tags that have that title.
	@type JSDOC.DocTag[]
 */
JSDOC.DocComment.prototype.getTag = function(/**String*/tagTitle) {
	return this.tags.filter(function($){return $.title == tagTitle});
}

JSDOC.DocComment.prototype.deleteTag = function(/**String*/tagTitle) {
	this.tags = this.tags.filter(function($){return $.title != tagTitle})
}

/*t:
	plan(1, "testing JSDOC.DocComment#getTag");
	requires("../frame/String.js");
	requires("../lib/JSDOC/DocTag.js");
	
	var com = new JSDOC.DocComment("/**@foo some\n* @bar\n* @bar*"+"/");
	is(com.getTag("bar").length, 2, "getTag returns expected number of tags.");
*/

/**
	Used to store the currently shared tag text.
*/
JSDOC.DocComment.shared = "";

/*t:
	plan(2, "testing JSDOC.DocComment.shared");
	requires("../frame/String.js");
	requires("../lib/JSDOC/DocTag.js");
	
	JSDOC.DocComment.shared = "@author Michael";
	
	var com = new JSDOC.DocComment("/**@foo\n* @foo*"+"/");
	is(com.getTag("author").length, 1, "getTag returns shared tag.");
	is(com.getTag("foo").length, 2, "getTag returns unshared tags too.");
*/