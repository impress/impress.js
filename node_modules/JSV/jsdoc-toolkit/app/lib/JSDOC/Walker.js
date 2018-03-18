if (typeof JSDOC == "undefined") JSDOC = {};

/** @constructor */
JSDOC.Walker = function(/**JSDOC.TokenStream*/ts) {
	this.init();
	if (typeof ts != "undefined") {
		this.walk(ts);
	}
}

JSDOC.Walker.prototype.init = function() {
	this.ts = null;

	var globalSymbol = new JSDOC.Symbol("_global_", [], "GLOBAL", new JSDOC.DocComment(""));
	globalSymbol.isNamespace = true;
	globalSymbol.srcFile = "";
	globalSymbol.isPrivate = false;
	JSDOC.Parser.addSymbol(globalSymbol);
	this.lastDoc = null;
	this.token = null;
	
	/**
		The chain of symbols under which we are currently nested.
		@type Array
	*/
	this.namescope = [globalSymbol];
	this.namescope.last = function(n){ if (!n) n = 0; return this[this.length-(1+n)] || "" };
}

JSDOC.Walker.prototype.walk = function(/**JSDOC.TokenStream*/ts) {
	this.ts = ts;
	while (this.token = this.ts.look()) {
		if (this.token.popNamescope) {
			
			var symbol = this.namescope.pop();
			if (symbol.is("FUNCTION")) {
				if (this.ts.look(1).is("LEFT_PAREN") && symbol.comment.getTag("function").length == 0) {
					symbol.isa = "OBJECT";
				}
			}
		}
		this.step();
		if (!this.ts.next()) break;
	}
}

JSDOC.Walker.prototype.step = function() {
	if (this.token.is("JSDOC")) { // it's a doc comment
	
		var doc = new JSDOC.DocComment(this.token.data);
		
				
		if (doc.getTag("exports").length > 0) {
			var exports = doc.getTag("exports")[0];

			exports.desc.match(/(\S+) as (\S+)/i);
			var n1 = RegExp.$1;
			var n2 = RegExp.$2;
			
			if (!n1 && n2) throw "@exports tag requires a value like: 'name as ns.name'";
			
			JSDOC.Parser.rename = (JSDOC.Parser.rename || {});	
			JSDOC.Parser.rename[n1] = n2
		}
		
		if (doc.getTag("lends").length > 0) {
			var lends = doc.getTag("lends")[0];

			var name = lends.desc
			if (!name) throw "@lends tag requires a value.";
			
			var symbol = new JSDOC.Symbol(name, [], "OBJECT", doc);
			
			this.namescope.push(symbol);
			
			var matching = this.ts.getMatchingToken("LEFT_CURLY");
			if (matching) matching.popNamescope = name;
			else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			
			this.lastDoc = null;
			return true;
		}
		else if (doc.getTag("name").length > 0 && doc.getTag("overview").length == 0) { // it's a virtual symbol
			var virtualName = doc.getTag("name")[0].desc;
			if (!virtualName) throw "@name tag requires a value.";
			
			if (doc.getTag("memberOf").length > 0) {
				virtualName = (doc.getTag("memberOf")[0] + "." + virtualName)
					.replace(/([#.])\./, "$1");
				doc.deleteTag("memberOf");
			}

			var symbol = new JSDOC.Symbol(virtualName, [], "VIRTUAL", doc);
			
			JSDOC.Parser.addSymbol(symbol);
			
			this.lastDoc = null;
			return true;
		}
		else if (doc.meta) { // it's a meta doclet
			if (doc.meta == "@+") JSDOC.DocComment.shared = doc.src;
			else if (doc.meta == "@-") JSDOC.DocComment.shared = "";
			else if (doc.meta == "nocode+") JSDOC.Parser.conf.ignoreCode = true;
			else if (doc.meta == "nocode-") JSDOC.Parser.conf.ignoreCode = JSDOC.opt.n;
			else throw "Unrecognized meta comment: "+doc.meta;
			
			this.lastDoc = null;
			return true;
		}
		else if (doc.getTag("overview").length > 0) { // it's a file overview
			symbol = new JSDOC.Symbol("", [], "FILE", doc);
			
			JSDOC.Parser.addSymbol(symbol);
			
			this.lastDoc = null;
			return true;
		}
		else {
			this.lastDoc = doc;
			return false;
		}
	}
	else if (!JSDOC.Parser.conf.ignoreCode) { // it's code
		if (this.token.is("NAME")) { // it's the name of something
			var symbol;
			var name = this.token.data;
			var doc = null; if (this.lastDoc) doc = this.lastDoc;
			var params = [];
		
			// it's inside an anonymous object
			if (this.ts.look(1).is("COLON") && this.ts.look(-1).is("LEFT_CURLY") && !(this.ts.look(-2).is("JSDOC") || this.namescope.last().comment.getTag("lends").length || this.ts.look(-2).is("ASSIGN") || this.ts.look(-2).is("COLON"))) {
				name = "$anonymous";
				name = this.namescope.last().alias+"-"+name
					
				params = [];
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);

				JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken(null, "RIGHT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// function foo() {}
			else if (this.ts.look(-1).is("FUNCTION") && this.ts.look(1).is("LEFT_PAREN")) {
				var isInner;
				
				if (this.lastDoc) doc = this.lastDoc;
				
				if (doc && doc.getTag("memberOf").length > 0) {
					name = (doc.getTag("memberOf")[0]+"."+name).replace("#.", "#");
					doc.deleteTag("memberOf");
				}
				else {
					name = this.namescope.last().alias+"-"+name;
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
				}
				
				if (!this.namescope.last().is("GLOBAL")) isInner = true;
				
				params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));

				symbol = new JSDOC.Symbol(name, params, "FUNCTION", doc);
				if (isInner) symbol.isInner = true;

				if (this.ts.look(1).is("JSDOC")) {
					var inlineReturn = ""+this.ts.look(1).data;
					inlineReturn = inlineReturn.replace(/(^\/\*\* *| *\*\/$)/g, "");
					symbol.type = inlineReturn;
				}
				
				JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// foo = function() {}
			else if (this.ts.look(1).is("ASSIGN") && this.ts.look(2).is("FUNCTION")) {
				var constructs;
				var isConstructor = false;
				if (doc && (constructs = doc.getTag("constructs")) && constructs.length) {
					if (constructs[0].desc) {
						name = constructs[0].desc;
						isConstructor = true;
					}
				}
					
				var isInner;
				if (this.ts.look(-1).is("VAR") || this.isInner) {
					if (doc && doc.getTag("memberOf").length > 0) {
						name = (doc.getTag("memberOf")[0]+"."+name).replace("#.", "#");
						doc.deleteTag("memberOf");
					}
					else {
						name = this.namescope.last().alias+"-"+name;
						if (!this.namescope.last().is("GLOBAL")) isInner = true;
					}
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
				}
				else if (name.indexOf("this.") == 0) {
					name = this.resolveThis(name);
				}

				if (this.lastDoc) doc = this.lastDoc;
				params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));
				
				symbol = new JSDOC.Symbol(name, params, "FUNCTION", doc);

				if (isInner) symbol.isInner = true;
				if (isConstructor) symbol.isa = "CONSTRUCTOR";
				
				if (this.ts.look(1).is("JSDOC")) {
					var inlineReturn = ""+this.ts.look(1).data;
					inlineReturn = inlineReturn.replace(/(^\/\*\* *| *\*\/$)/g, "");
					symbol.type = inlineReturn;
				}

				JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// foo = new function() {} or foo = (function() {}
			else if (this.ts.look(1).is("ASSIGN") && (this.ts.look(2).is("NEW") || this.ts.look(2).is("LEFT_PAREN")) && this.ts.look(3).is("FUNCTION")) {
				var isInner;
				if (this.ts.look(-1).is("VAR") || this.isInner) {
					name = this.namescope.last().alias+"-"+name
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
				}
				else if (name.indexOf("this.") == 0) {
					name = this.resolveThis(name);
				}

				this.ts.next(3); // advance past the "new" or "("
				
				if (this.lastDoc) doc = this.lastDoc;
				params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
				if (isInner) symbol.isInner = true;
				
				if (this.ts.look(1).is("JSDOC")) {
					var inlineReturn = ""+this.ts.look(1).data;
					inlineReturn = inlineReturn.replace(/(^\/\*\* *| *\*\/$)/g, "");
					symbol.type = inlineReturn;
				}
				
				JSDOC.Parser.addSymbol(symbol);
				
				symbol.scopeType = "INSTANCE";
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// foo: function() {}
			else if (this.ts.look(1).is("COLON") && this.ts.look(2).is("FUNCTION")) {
				name = (this.namescope.last().alias+"."+name).replace("#.", "#");
				
				if (this.lastDoc) doc = this.lastDoc;
				params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));
				
				if (doc && doc.getTag("constructs").length) {
					name = name.replace(/\.prototype(\.|$)/, "#");
					
					if (name.indexOf("#") > -1) name = name.match(/(^[^#]+)/)[0];
					else name = this.namescope.last().alias;

					symbol = new JSDOC.Symbol(name, params, "CONSTRUCTOR", doc);
				}
				else {
					symbol = new JSDOC.Symbol(name, params, "FUNCTION", doc);
				}
				
				if (this.ts.look(1).is("JSDOC")) {
					var inlineReturn = ""+this.ts.look(1).data;
					inlineReturn = inlineReturn.replace(/(^\/\*\* *| *\*\/$)/g, "");
					symbol.type = inlineReturn;
				}
				
				JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// foo = {}
			else if (this.ts.look(1).is("ASSIGN") && this.ts.look(2).is("LEFT_CURLY")) {
				var isInner;
				if (this.ts.look(-1).is("VAR") || this.isInner) {
					name = this.namescope.last().alias+"-"+name
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
				}
				else if (name.indexOf("this.") == 0) {
					name = this.resolveThis(name);
				}
				
				if (this.lastDoc) doc = this.lastDoc;
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
				if (isInner) symbol.isInner = true;
				
			
				if (doc) JSDOC.Parser.addSymbol(symbol);

				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// var foo;
			else if (this.ts.look(1).is("SEMICOLON")) {
				var isInner;

				if (this.ts.look(-1).is("VAR") || this.isInner) {
					name = this.namescope.last().alias+"-"+name
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
					
					if (this.lastDoc) doc = this.lastDoc;
				
					symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
					if (isInner) symbol.isInner = true;
					
				
					if (doc) JSDOC.Parser.addSymbol(symbol);
				}
			}
			// foo = x
			else if (this.ts.look(1).is("ASSIGN")) {				
				var isInner;
				if (this.ts.look(-1).is("VAR") || this.isInner) {
					name = this.namescope.last().alias+"-"+name
					if (!this.namescope.last().is("GLOBAL")) isInner = true;
				}
				else if (name.indexOf("this.") == 0) {
					name = this.resolveThis(name);
				}
				
				if (this.lastDoc) doc = this.lastDoc;
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
				if (isInner) symbol.isInner = true;
				
			
				if (doc) JSDOC.Parser.addSymbol(symbol);
			}
			// foo: {}
			else if (this.ts.look(1).is("COLON") && this.ts.look(2).is("LEFT_CURLY")) {
				name = (this.namescope.last().alias+"."+name).replace("#.", "#");
				
				if (this.lastDoc) doc = this.lastDoc;
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
				
			
				if (doc) JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
			// foo: x
			else if (this.ts.look(1).is("COLON")) {
				name = (this.namescope.last().alias+"."+name).replace("#.", "#");;
				
				if (this.lastDoc) doc = this.lastDoc;
				
				symbol = new JSDOC.Symbol(name, params, "OBJECT", doc);
				
			
				if (doc) JSDOC.Parser.addSymbol(symbol);
			}
			// foo(...)
			else if (this.ts.look(1).is("LEFT_PAREN")) {
				if (typeof JSDOC.PluginManager != "undefined") {
					var functionCall = {name: name};
				
					var cursor = this.ts.cursor;
					params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));
					this.ts.cursor = cursor;
					
					for (var i = 0; i < params.length; i++)
						functionCall["arg" + (i + 1)] = params[i].name;
				
					JSDOC.PluginManager.run("onFunctionCall", functionCall);
					if (functionCall.doc) {
						this.ts.insertAhead(new JSDOC.Token(functionCall.doc, "COMM", "JSDOC"));
					}
				}
			}
			this.lastDoc = null;
		}
		else if (this.token.is("FUNCTION")) { // it's an anonymous function
			if (
				(!this.ts.look(-1).is("COLON") || !this.ts.look(-1).is("ASSIGN"))
				&& !this.ts.look(1).is("NAME")
			) {
				if (this.lastDoc) doc = this.lastDoc;
				
				name = "$anonymous";
				name = this.namescope.last().alias+"-"+name
				
				params = JSDOC.Walker.onParamList(this.ts.balance("LEFT_PAREN"));
				
				symbol = new JSDOC.Symbol(name, params, "FUNCTION", doc);
				
				JSDOC.Parser.addSymbol(symbol);
				
				this.namescope.push(symbol);
				
				var matching = this.ts.getMatchingToken("LEFT_CURLY");
				if (matching) matching.popNamescope = name;
				else LOG.warn("Mismatched } character. Can't parse code in file " + symbol.srcFile + ".");
			}
		}
	}
	return true;
}

/**
	Resolves what "this." means when it appears in a name.
	@param name The name that starts with "this.".
	@returns The name with "this." resolved.
 */
JSDOC.Walker.prototype.resolveThis = function(name) {
	name.match(/^this\.(.+)$/)
	var nameFragment = RegExp.$1;
	if (!nameFragment) return name;
	
	var symbol = this.namescope.last();
	var scopeType = symbol.scopeType || symbol.isa;

	// if we are in a constructor function, `this` means the instance
	if (scopeType == "CONSTRUCTOR") {
		name = symbol.alias+"#"+nameFragment;
	}
	
	// if we are in an anonymous constructor function, `this` means the instance
	else if (scopeType == "INSTANCE") {
		name = symbol.alias+"."+nameFragment;
	}
	
	// if we are in a function, `this` means the container (possibly the global)
	else if (scopeType == "FUNCTION") {
		// in a method of a prototype, so `this` means the constructor
		if (symbol.alias.match(/(^.*)[#.-][^#.-]+/)) {
			var parentName = RegExp.$1;
			var parent = JSDOC.Parser.symbols.getSymbol(parentName);

			if (!parent) {
				if (JSDOC.Lang.isBuiltin(parentName)) parent = JSDOC.Parser.addBuiltin(parentName);
				else {
					if (symbol.alias.indexOf("$anonymous") < 0) // these will be ignored eventually
						LOG.warn("Trying to document "+symbol.alias+" without first documenting "+parentName+".");
				}
			}
			if (parent) name = parentName+(parent.is("CONSTRUCTOR")?"#":".")+nameFragment;
		}
		else {
			parent = this.namescope.last(1);
			name = parent.alias+(parent.is("CONSTRUCTOR")?"#":".")+nameFragment;
		}
	}
	// otherwise it means the global
	else {
		name = nameFragment;
	}
	
	return name;
}

JSDOC.Walker.onParamList = function(/**Array*/paramTokens) {
	if (!paramTokens) {
		LOG.warn("Malformed parameter list. Can't parse code.");
		return [];
	}
	var params = [];
	for (var i = 0, l = paramTokens.length; i < l; i++) {
		if (paramTokens[i].is("JSDOC")) {
			var paramType = paramTokens[i].data.replace(/(^\/\*\* *| *\*\/$)/g, "");
			
			if (paramTokens[i+1] && paramTokens[i+1].is("NAME")) {
				i++;
				params.push({type: paramType, name: paramTokens[i].data});
			}
		}
		else if (paramTokens[i].is("NAME")) {
			params.push({name: paramTokens[i].data});
		}
	}
	return params;
}
