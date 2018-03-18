/** @constructor */
JSDOC.SymbolSet = function() {
	this.init();
}

JSDOC.SymbolSet.prototype.init = function() {
	this._index = new Hash();
}

JSDOC.SymbolSet.prototype.keys = function() {
	return this._index.keys();
}

JSDOC.SymbolSet.prototype.hasSymbol = function(alias) {
	return this._index.hasKey(alias);
}

JSDOC.SymbolSet.prototype.addSymbol = function(symbol) {
	if (JSDOC.opt.a && this.hasSymbol(symbol.alias)) {
		LOG.warn("Overwriting symbol documentation for: " + symbol.alias + ".");
		this.deleteSymbol(symbol.alias);
	}
	this._index.set(symbol.alias, symbol);
}

JSDOC.SymbolSet.prototype.getSymbol = function(alias) {
	if (this.hasSymbol(alias)) return this._index.get(alias);
}

JSDOC.SymbolSet.prototype.getSymbolByName = function(name) {
	for (var p = this._index.first(); p; p = this._index.next()) {
		var symbol = p.value;
		if (symbol.name == name) return symbol;
	}
}

JSDOC.SymbolSet.prototype.toArray = function() {
	return this._index.values();
}

JSDOC.SymbolSet.prototype.deleteSymbol = function(alias) {
	if (!this.hasSymbol(alias)) return;
	this._index.drop(alias);
}

JSDOC.SymbolSet.prototype.renameSymbol = function(oldName, newName) {
	// todo: should check if oldname or newname already exist
	this._index.replace(oldName, newName);
	this._index.get(newName).alias = newName;
	return newName;
}

JSDOC.SymbolSet.prototype.relate = function() {
	this.resolveBorrows();
	this.resolveMemberOf();
	this.resolveAugments();
}

JSDOC.SymbolSet.prototype.resolveBorrows = function() {
	for (var p = this._index.first(); p; p = this._index.next()) {
		var symbol = p.value;
		if (symbol.is("FILE") || symbol.is("GLOBAL")) continue;
		
		var borrows = symbol.inherits;
		for (var i = 0; i < borrows.length; i++) {
		
if (/#$/.test(borrows[i].alias)) {
	LOG.warn("Attempted to borrow entire instance of "+borrows[i].alias+" but that feature is not yet implemented.");
	return;
}
			var borrowed = this.getSymbol(borrows[i].alias);
			
			if (!borrowed) {
				LOG.warn("Can't borrow undocumented "+borrows[i].alias+".");
				continue;
			}

			if (borrows[i].as == borrowed.alias) {
				var assumedName = borrowed.name.split(/([#.-])/).pop();
				borrows[i].as = symbol.name+RegExp.$1+assumedName;
				LOG.inform("Assuming borrowed as name is "+borrows[i].as+" but that feature is experimental.");
			}
			
			var borrowAsName = borrows[i].as;
			var borrowAsAlias = borrowAsName;
			if (!borrowAsName) {
				LOG.warn("Malformed @borrow, 'as' is required.");
				continue;
			}
			
			if (borrowAsName.length > symbol.alias.length && borrowAsName.indexOf(symbol.alias) == 0) {
				borrowAsName = borrowAsName.replace(borrowed.alias, "")
			}
			else {
				var joiner = "";
				if (borrowAsName.charAt(0) != "#") joiner = ".";
				borrowAsAlias = borrowed.alias + joiner + borrowAsName;
			}
			
			borrowAsName = borrowAsName.replace(/^[#.]/, "");
					
			if (this.hasSymbol(borrowAsAlias)) continue;

			var clone = borrowed.clone();
			clone.name = borrowAsName;
			clone.alias = borrowAsAlias;
			this.addSymbol(clone);
		}
	}
}

JSDOC.SymbolSet.prototype.resolveMemberOf = function() {
	for (var p = this._index.first(); p; p = this._index.next()) {
		var symbol = p.value;

		if (symbol.is("FILE") || symbol.is("GLOBAL")) continue;
		
		// the memberOf value was provided in the @memberOf tag
		else if (symbol.memberOf) {			
			// like foo.bar is a memberOf foo
			if (symbol.alias.indexOf(symbol.memberOf) == 0) {
				var memberMatch = new RegExp("^("+symbol.memberOf+")[.#-]?(.+)$");
				var aliasParts = symbol.alias.match(memberMatch);
				
				if (aliasParts) {
					symbol.memberOf = aliasParts[1];
					symbol.name = aliasParts[2];
				}
				
				var nameParts = symbol.name.match(memberMatch);

				if (nameParts) {
					symbol.name = nameParts[2];
				}
			}
			// like bar is a memberOf foo
			else {
				var joiner = symbol.memberOf.charAt(symbol.memberOf.length-1);
				if (!/[.#-]/.test(joiner)) symbol.memberOf += ".";
				this.renameSymbol(symbol.alias, symbol.memberOf + symbol.name);
			}
		}
		// the memberOf must be calculated
		else {
			var parts = symbol.alias.match(/^(.*[.#-])([^.#-]+)$/);

			if (parts) {
				symbol.memberOf = parts[1];
				symbol.name = parts[2];				
			}
		}

		// set isStatic, isInner
		if (symbol.memberOf) {
			switch (symbol.memberOf.charAt(symbol.memberOf.length-1)) {
				case '#' :
					symbol.isStatic = false;
					symbol.isInner = false;
				break;
				case '.' :
					symbol.isStatic = true;
					symbol.isInner = false;
				break;
				case '-' :
					symbol.isStatic = false;
					symbol.isInner = true;
				break;
				default: // memberOf ends in none of the above
					symbol.isStatic = true;
				break;
			}
		}
		
		// unowned methods and fields belong to the global object
		if (!symbol.is("CONSTRUCTOR") && !symbol.isNamespace && symbol.memberOf == "") {
			symbol.memberOf = "_global_";
		}

		// clean up
		if (symbol.memberOf.match(/[.#-]$/)) {
			symbol.memberOf = symbol.memberOf.substr(0, symbol.memberOf.length-1);
		}
		// add to parent's methods or properties list
		if (symbol.memberOf) {

			var container = this.getSymbol(symbol.memberOf);
			if (!container) {
				if (JSDOC.Lang.isBuiltin(symbol.memberOf)) container = JSDOC.Parser.addBuiltin(symbol.memberOf);
				else {
					LOG.warn("Trying to document "+symbol.name +" as a member of undocumented symbol "+symbol.memberOf+".");
				}
			}
			
			if (container) container.addMember(symbol);
		}
	}
}

JSDOC.SymbolSet.prototype.resolveAugments = function() {
	for (var p = this._index.first(); p; p = this._index.next()) {
		var symbol = p.value;
		
		if (symbol.alias == "_global_" || symbol.is("FILE")) continue;
		JSDOC.SymbolSet.prototype.walk.apply(this, [symbol]);
	}
}

JSDOC.SymbolSet.prototype.walk = function(symbol) {
	var augments = symbol.augments;
	for(var i = 0; i < augments.length; i++) {
		var contributer = this.getSymbol(augments[i]);
		if (!contributer && JSDOC.Lang.isBuiltin(''+augments[i])) {
			contributer = new JSDOC.Symbol("_global_."+augments[i], [], augments[i], new JSDOC.DocComment("Built in."));
			contributer.isNamespace = true;
			contributer.srcFile = "";
			contributer.isPrivate = false;
			JSDOC.Parser.addSymbol(contributer);
		}
		
		if (contributer) {			
			if (contributer.augments.length) {
				JSDOC.SymbolSet.prototype.walk.apply(this, [contributer]);
			}
			
			symbol.inheritsFrom.push(contributer.alias);
			//if (!isUnique(symbol.inheritsFrom)) {
			//	LOG.warn("Can't resolve augments: Circular reference: "+symbol.alias+" inherits from "+contributer.alias+" more than once.");
			//}
			//else {
				var cmethods = contributer.methods;
				var cproperties = contributer.properties;
				
				for (var ci = 0, cl = cmethods.length; ci < cl; ci++) {
					if (!cmethods[ci].isStatic) symbol.inherit(cmethods[ci]);
				}
				for (var ci = 0, cl = cproperties.length; ci < cl; ci++) {
					if (!cproperties[ci].isStatic) symbol.inherit(cproperties[ci]);
				}	
			//}
		}
		else LOG.warn("Can't augment contributer: "+augments[i]+", not found.");
	}
}
