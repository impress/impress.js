if (typeof JSDOC == "undefined") JSDOC = {};

/**
	Create a new Symbol.
	@class Represents a symbol in the source code.
 */
JSDOC.Symbol = function() {
	this.init();
	if (arguments.length) this.populate.apply(this, arguments);
}

JSDOC.Symbol.count = 0;

JSDOC.Symbol.prototype.init = function() {
	this._name = "";
	this._params = [];
	this.$args = [];
	this.addOn = "";
	this.alias = "";
	this.augments = [];
	this.author = "";
	this.classDesc = "";
	this.comment = {};
	this.defaultValue = undefined;
	this.deprecated = "";
	this.desc = "";
	this.example = [];
	this.exceptions = [];
	this.fires = [];
	this.id = JSDOC.Symbol.count++;
	this.inherits = [];
	this.inheritsFrom = [];
	this.isa = "OBJECT";
	this.isConstant = false;
	this.isEvent = false;
	this.isIgnored = false;
	this.isInner = false;
	this.isNamespace = false;
	this.isPrivate = false;
	this.isStatic = false;
	this.memberOf = "";
	this.methods = [];
	this.properties = [];
	this.requires = [];
	this.returns = [];
	this.see = [];
	this.since = "";
	this.srcFile = {};
	this.type = "";
	this.version = "";
}

JSDOC.Symbol.prototype.serialize = function() {
	var keys = [];
	for (var p in this) {
		keys.push (p);
	}
	keys = keys.sort();
	
	var out = "";
	for (var i in keys) {
		if (typeof this[keys[i]] == "function") continue;
		out += keys[i]+" => "+Dumper.dump(this[keys[i]])+",\n";
	}
	return "\n{\n" + out + "}\n";
}

JSDOC.Symbol.prototype.clone = function() {
	var clone = new JSDOC.Symbol();
	clone.populate.apply(clone, this.$args); // repopulate using the original arguments
	clone.srcFile = this.srcFile; // not the current srcFile, the one when the original was made
	return clone;
}

JSDOC.Symbol.prototype.__defineSetter__("name",
	function(n) { n = n.replace(/^_global_[.#-]/, ""); n = n.replace(/\.prototype\.?/g, '#'); this._name = n; }
);
JSDOC.Symbol.prototype.__defineGetter__("name",
	function() { return this._name; }
);
JSDOC.Symbol.prototype.__defineSetter__("params", 
	function(v) {
		for (var i = 0, l = v.length; i < l; i++) {
			if (v[i].constructor != JSDOC.DocTag) { // may be a generic object parsed from signature, like {type:..., name:...}
				this._params[i] = new JSDOC.DocTag("param"+((v[i].type)?" {"+v[i].type+"}":"")+" "+v[i].name);
			}
			else {
				this._params[i] = v[i];
			}
		}
	}
);
JSDOC.Symbol.prototype.__defineGetter__("params",
	function() { return this._params; }
);

JSDOC.Symbol.prototype.getEvents = function() {
	var events = [];
	for (var i = 0, l = this.methods.length; i < l; i++) {
		if (this.methods[i].isEvent) {
			this.methods[i].name = this.methods[i].name.replace("event:", "");
			events.push(this.methods[i]);
		}
	}
	return events;
}

JSDOC.Symbol.prototype.getMethods = function() {
	var nonEvents = [];
	for (var i = 0, l = this.methods.length; i < l; i++) {
		if (!this.methods[i].isEvent) {
			nonEvents.push(this.methods[i]);
		}
	}
	return nonEvents;
}


JSDOC.Symbol.prototype.populate = function(
		/** String */ name,
		/** Object[] */ params,
		/** String */ isa,
		/** JSDOC.DocComment */ comment
) {
	this.$args = arguments;
	
	this.name = name;
	this.alias = this.name;
	
	this.params = params;
	this.isa = (isa == "VIRTUAL")? "OBJECT":isa;
	this.comment = comment || new JSDOC.DocComment("");
	this.srcFile = JSDOC.Symbol.srcFile;
	
	if (this.is("FILE") && !this.alias) this.alias = this.srcFile;

	this.setTags();
	
	if (typeof JSDOC.PluginManager != "undefined") {
		JSDOC.PluginManager.run("onSymbol", this);
	}
}

JSDOC.Symbol.prototype.setTags = function() {
	// @author
	var authors = this.comment.getTag("author");
	if (authors.length) {
		this.author = authors.map(function($){return $.desc;}).join(", ");
	}
	
	/*t:
		plan(34, "testing JSDOC.Symbol");
		
		requires("../lib/JSDOC/DocComment.js");
		requires("../frame/String.js");
		requires("../lib/JSDOC/DocTag.js");

		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@author Joe Smith*"+"/"));
		is(sym.author, "Joe Smith", "@author tag, author is found.");
	*/
	
	// @desc
	var descs = this.comment.getTag("desc");
	if (descs.length) {
		this.desc = descs.map(function($){return $.desc;}).join("\n"); // multiple descriptions are concatenated into one
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@desc This is a description.*"+"/"));
		is(sym.desc, "This is a description.", "@desc tag, description is found.");
	*/
	
	// @overview
	if (this.is("FILE")) {
		if (!this.alias) this.alias = this.srcFile;
		
		var overviews = this.comment.getTag("overview");
		if (overviews.length) {
			this.desc = [this.desc].concat(overviews.map(function($){return $.desc;})).join("\n");
		}
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@overview This is an overview.*"+"/"));
		is(sym.desc, "\nThis is an overview.", "@overview tag, description is found.");
	*/
	
	// @since
	var sinces = this.comment.getTag("since");
	if (sinces.length) {
		this.since = sinces.map(function($){return $.desc;}).join(", ");
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@since 1.01*"+"/"));
		is(sym.since, "1.01", "@since tag, description is found.");
	*/
	
	// @constant
	if (this.comment.getTag("constant").length) {
		this.isConstant = true;
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@constant*"+"/"));
		is(sym.isConstant, true, "@constant tag, isConstant set.");
	*/
	
	// @version
	var versions = this.comment.getTag("version");
	if (versions.length) {
		this.version = versions.map(function($){return $.desc;}).join(", ");
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@version 2.0x*"+"/"));
		is(sym.version, "2.0x", "@version tag, version is found.");
	*/
	
	// @deprecated
	var deprecateds = this.comment.getTag("deprecated");
	if (deprecateds.length) {
		this.deprecated = deprecateds.map(function($){return $.desc;}).join("\n");
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@deprecated Use other method.*"+"/"));
		is(sym.deprecated, "Use other method.", "@deprecated tag, desc is found.");
	*/
	
	// @example
	var examples = this.comment.getTag("example");
	if (examples.length) {
		this.example = examples.map(
			// trim trailing whitespace
			function($) {
				$.desc = $.desc.replace(/\s+$/, "");
				return $;
			}
		);
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@example This\n  is an example. \n*"+"/"));
		isnt(typeof sym.example[0], "undefined", "@example tag, creates sym.example array.");
		is(sym.example[0], "This\n  is an example.", "@example tag, desc is found.");
	*/
	
	// @see
	var sees = this.comment.getTag("see");
	if (sees.length) {
		var thisSee = this.see;
		sees.map(function($){thisSee.push($.desc);});
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FILE", new JSDOC.DocComment("/**@see The other thing.*"+"/"));
		is(sym.see, "The other thing.", "@see tag, desc is found.");
	*/
	
	// @class
	var classes = this.comment.getTag("class");
	if (classes.length) {
		this.isa = "CONSTRUCTOR";
		this.classDesc = classes[0].desc; // desc can't apply to the constructor as there is none.
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@class This describes the class.*"+"/"));
		is(sym.isa, "CONSTRUCTOR", "@class tag, makes symbol a constructor.");
		is(sym.classDesc, "This describes the class.", "@class tag, class description is found.");
	*/
	
	// @namespace
	var namespaces = this.comment.getTag("namespace");
	if (namespaces.length) {
		this.classDesc = namespaces[0].desc;
		this.isNamespace = true;
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@namespace This describes the namespace.*"+"/"));
		is(sym.classDesc, "This describes the namespace.", "@namespace tag, class description is found.");
	*/
	
	// @param
	var params = this.comment.getTag("param");
	if (params.length) {
		// user-defined params overwrite those with same name defined by the parser
		var thisParams = this.params;

		if (thisParams.length == 0) { // none exist yet, so just bung all these user-defined params straight in
			this.params = params;
		}
		else { // need to overlay these user-defined params on to existing parser-defined params
			for (var i = 0, l = params.length; i < l; i++) {
				if (thisParams[i]) {
					if (params[i].type) thisParams[i].type = params[i].type;
					thisParams[i].name = params[i].name;
					thisParams[i].desc = params[i].desc;
					thisParams[i].isOptional = params[i].isOptional;
					thisParams[i].defaultValue = params[i].defaultValue;
				}
				else thisParams[i] = params[i];
			}
		}
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [{type: "array", name: "pages"}], "FUNCTION", new JSDOC.DocComment("/**Description.*"+"/"));
		is(sym.params.length, 1, "parser defined param is found.");
		
		sym = new JSDOC.Symbol("foo", [], "FUNCTION", new JSDOC.DocComment("/**Description.\n@param {array} pages*"+"/"));
		is(sym.params.length, 1, "user defined param is found.");
		is(sym.params[0].type, "array", "user defined param type is found.");
		is(sym.params[0].name, "pages", "user defined param name is found.");
		
		sym = new JSDOC.Symbol("foo", [{type: "array", name: "pages"}], "FUNCTION", new JSDOC.DocComment("/**Description.\n@param {string} uid*"+"/"));
		is(sym.params.length, 1, "user defined param overwrites parser defined param.");
		is(sym.params[0].type, "string", "user defined param type overwrites parser defined param type.");
		is(sym.params[0].name, "uid", "user defined param name overwrites parser defined param name.");
	
		sym = new JSDOC.Symbol("foo", [{type: "array", name: "pages"}, {type: "number", name: "count"}], "FUNCTION", new JSDOC.DocComment("/**Description.\n@param {string} uid*"+"/"));
		is(sym.params.length, 2, "user defined params  overlay parser defined params.");
		is(sym.params[1].type, "number", "user defined param type overlays parser defined param type.");
		is(sym.params[1].name, "count", "user defined param name overlays parser defined param name.");

		sym = new JSDOC.Symbol("foo", [], "FUNCTION", new JSDOC.DocComment("/**Description.\n@param {array} pages The pages description.*"+"/"));
		is(sym.params.length, 1, "user defined param with description is found.");
		is(sym.params[0].desc, "The pages description.", "user defined param description is found.");
	*/
	
	// @constructor
	if (this.comment.getTag("constructor").length) {
		this.isa = "CONSTRUCTOR";
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@constructor*"+"/"));
		is(sym.isa, "CONSTRUCTOR", "@constructor tag, makes symbol a constructor.");
	*/
	
	// @static
	if (this.comment.getTag("static").length) {
		this.isStatic = true;
		if (this.isa == "CONSTRUCTOR") {
			this.isNamespace = true;
		}
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@static\n@constructor*"+"/"));
		is(sym.isStatic, true, "@static tag, makes isStatic true.");
		is(sym.isNamespace, true, "@static and @constructor tag, makes isNamespace true.");
	*/
	
	// @inner
	if (this.comment.getTag("inner").length) {
		this.isInner = true;
		this.isStatic = false;
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@inner*"+"/"));
		is(sym.isStatic, false, "@inner tag, makes isStatic false.");
		is(sym.isInner, true, "@inner makes isInner true.");
	*/
	
	// @name
	var names = this.comment.getTag("name");
	if (names.length) {
		this.name = names[0].desc;
	}
	
	/*t:
		// todo
	*/
	
	// @field
	if (this.comment.getTag("field").length) {
		this.isa = "OBJECT";
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "FUNCTION", new JSDOC.DocComment("/**@field*"+"/"));
		is(sym.isa, "OBJECT", "@field tag, makes symbol an object.");
	*/
	
	// @function
	if (this.comment.getTag("function").length) {
		this.isa = "FUNCTION";
		if (/event:/.test(this.alias)) this.isEvent = true;
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@function*"+"/"));
		is(sym.isa, "FUNCTION", "@function tag, makes symbol a function.");
	*/
	
	// @event
	var events = this.comment.getTag("event");
	if (events.length) {
		this.isa = "FUNCTION";
		this.isEvent = true;
		if (!/event:/.test(this.alias))
			this.alias = this.alias.replace(/^(.*[.#-])([^.#-]+)$/, "$1event:$2");
	}
	
	/*t:
		var sym = new JSDOC.Symbol("foo", [], "OBJECT", new JSDOC.DocComment("/**@event*"+"/"));
		is(sym.isa, "FUNCTION", "@event tag, makes symbol a function.");
		is(sym.isEvent, true, "@event makes isEvent true.");
	*/
	
	// @fires
	var fires = this.comment.getTag("fires");
	if (fires.length) {
		for (var i = 0; i < fires.length; i++) {
			this.fires.push(fires[i].desc);
		}
	}
	
	/*t:
		// todo
	*/
	
	// @property
	var properties = this.comment.getTag("property");
	if (properties.length) {
		thisProperties = this.properties;
		for (var i = 0; i < properties.length; i++) {
			var property = new JSDOC.Symbol(this.alias+"#"+properties[i].name, [], "OBJECT", new JSDOC.DocComment("/**"+properties[i].desc+"*/"));
			// TODO: shouldn't the following happen in the addProperty method of Symbol?
			if (properties[i].type) property.type = properties[i].type;
			if (properties[i].defaultValue) property.defaultValue = properties[i].defaultValue;
			this.addProperty(property);
			if (!JSDOC.Parser.symbols.getSymbolByName(property.name))
				JSDOC.Parser.addSymbol(property);
		}
	}
	
	/*t:
		// todo
	*/

	// @return
	var returns = this.comment.getTag("return");
	if (returns.length) { // there can be many return tags in a single doclet
		this.returns = returns;
		this.type = returns.map(function($){return $.type}).join(", ");
	}
	
	/*t:
		// todo
	*/
	
	// @exception
	this.exceptions = this.comment.getTag("throws");
	
	/*t:
		// todo
	*/
	
	// @requires
	var requires = this.comment.getTag("requires");
	if (requires.length) {
		this.requires = requires.map(function($){return $.desc});
	}
	
	/*t:
		// todo
	*/
	
	// @type
	var types = this.comment.getTag("type");
	if (types.length) {
		this.type = types[0].desc; //multiple type tags are ignored
	}
	
	/*t:
		// todo
	*/
	
	// @private
	if (this.comment.getTag("private").length || this.isInner) {
		this.isPrivate = true;
	}
	
	// @ignore
	if (this.comment.getTag("ignore").length) {
		this.isIgnored = true;
	}
	
	/*t:
		// todo
	*/
	
	// @inherits ... as ...
	var inherits = this.comment.getTag("inherits");
	if (inherits.length) {
		for (var i = 0; i < inherits.length; i++) {
			if (/^\s*([a-z$0-9_.#:-]+)(?:\s+as\s+([a-z$0-9_.#:-]+))?/i.test(inherits[i].desc)) {
				var inAlias = RegExp.$1;
				var inAs = RegExp.$2 || inAlias;

				if (inAlias) inAlias = inAlias.replace(/\.prototype\.?/g, "#");
				
				if (inAs) {
					inAs = inAs.replace(/\.prototype\.?/g, "#");
					inAs = inAs.replace(/^this\.?/, "#");
				}

				if (inAs.indexOf(inAlias) != 0) { //not a full namepath
					var joiner = ".";
					if (this.alias.charAt(this.alias.length-1) == "#" || inAs.charAt(0) == "#") {
						joiner = "";
					}
					inAs = this.alias + joiner + inAs;
				}
			}
			this.inherits.push({alias: inAlias, as: inAs});
		}
	}
	
	/*t:
		// todo
	*/
	
	// @augments
	this.augments = this.comment.getTag("augments");
	
	// @default
	var defaults = this.comment.getTag("default");
	if (defaults.length) {
		if (this.is("OBJECT")) {
			this.defaultValue = defaults[0].desc;
		}
	}
	
	/*t:
		// todo
	*/
	
	// @memberOf
	var memberOfs = this.comment.getTag("memberOf");
	if (memberOfs.length) {
		this.memberOf = memberOfs[0].desc;
		this.memberOf = this.memberOf.replace(/\.prototype\.?/g, "#");
	}

	/*t:
		// todo
	*/
	
	// @public
	if (this.comment.getTag("public").length) {
		this.isPrivate = false;
	}
	
	/*t:
		// todo
	*/
		
	if (JSDOC.PluginManager) {
		JSDOC.PluginManager.run("onSetTags", this);
	}
}

JSDOC.Symbol.prototype.is = function(what) {
	return this.isa === what;
}

JSDOC.Symbol.prototype.isBuiltin = function() {
	return JSDOC.Lang.isBuiltin(this.alias);
}

JSDOC.Symbol.prototype.setType = function(/**String*/comment, /**Boolean*/overwrite) {
	if (!overwrite && this.type) return;
	var typeComment = JSDOC.DocComment.unwrapComment(comment);
	this.type = typeComment;
}

JSDOC.Symbol.prototype.inherit = function(symbol) {
	if (!this.hasMember(symbol.name) && !symbol.isInner) {
		if (symbol.is("FUNCTION"))
			this.methods.push(symbol);
		else if (symbol.is("OBJECT"))
			this.properties.push(symbol);
	}
}

JSDOC.Symbol.prototype.hasMember = function(name) {
	return (this.hasMethod(name) || this.hasProperty(name));
}

JSDOC.Symbol.prototype.addMember = function(symbol) {
	if (symbol.is("FUNCTION")) { this.addMethod(symbol); }
	else if (symbol.is("OBJECT")) { this.addProperty(symbol); }
}

JSDOC.Symbol.prototype.hasMethod = function(name) {
	var thisMethods = this.methods;
	for (var i = 0, l = thisMethods.length; i < l; i++) {
		if (thisMethods[i].name == name) return true;
		if (thisMethods[i].alias == name) return true;
	}
	return false;
}

JSDOC.Symbol.prototype.addMethod = function(symbol) {
	var methodAlias = symbol.alias;
	var thisMethods = this.methods;
	for (var i = 0, l = thisMethods.length; i < l; i++) {
		if (thisMethods[i].alias == methodAlias) {
			thisMethods[i] = symbol; // overwriting previous method
			return;
		}
	}
	thisMethods.push(symbol); // new method with this alias
}

JSDOC.Symbol.prototype.hasProperty = function(name) {
	var thisProperties = this.properties;
	for (var i = 0, l = thisProperties.length; i < l; i++) {
		if (thisProperties[i].name == name) return true;
		if (thisProperties[i].alias == name) return true;
	}
	return false;
}

JSDOC.Symbol.prototype.addProperty = function(symbol) {
	var propertyAlias = symbol.alias;
	var thisProperties = this.properties;
	for (var i = 0, l = thisProperties.length; i < l; i++) {
		if (thisProperties[i].alias == propertyAlias) {
			thisProperties[i] = symbol; // overwriting previous property
			return;
		}
	}

	thisProperties.push(symbol); // new property with this alias
}

JSDOC.Symbol.srcFile = ""; //running reference to the current file being parsed
