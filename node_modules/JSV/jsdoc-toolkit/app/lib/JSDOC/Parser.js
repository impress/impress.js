if (typeof JSDOC == "undefined") JSDOC = {};

/**
	@namespace
	@requires JSDOC.Walker
	@requires JSDOC.Symbol
	@requires JSDOC.DocComment
*/
JSDOC.Parser = {
	conf: {
		ignoreCode:               JSDOC.opt.n,
		ignoreAnonymous:           true, // factory: true
		treatUnderscoredAsPrivate: true, // factory: true
		explain:                   false // factory: false
	},
	
	addSymbol: function(symbol) {

		if (JSDOC.Parser.rename) {
			for (var n in JSDOC.Parser.rename) {
				if (symbol.alias.indexOf(n) == 0) {
					if (symbol.name == symbol.alias) {
						symbol.name = symbol.name.replace(n, JSDOC.Parser.rename[n]);
					}
					symbol.alias = symbol.alias.replace(n, JSDOC.Parser.rename[n]);
				}
			}
		}
		
		if (JSDOC.opt.S) {
			if (typeof JSDOC.Parser.secureModules == "undefined") JSDOC.Parser.secureModules = {};
			if (/^exports\./.test(symbol.alias)) {
				symbol.srcFile.match(/(^|[\\\/])([^\\\/]+)\.js/i);
				var fileNS = RegExp.$2;
				
				// need to create the namespace associated with this file first
				if (!JSDOC.Parser.secureModules[fileNS]) {
					JSDOC.Parser.secureModules[fileNS] = 1;
					var nsSymbol = new JSDOC.Symbol(fileNS, [], "GLOBAL", new JSDOC.DocComment(""));
					nsSymbol.isNamespace = true;
					nsSymbol.srcFile = "";
					nsSymbol.isPrivate = false;
					nsSymbol.srcFile = symbol.srcFile;
					nsSymbol.desc = (JSDOC.Parser.symbols.getSymbol(symbol.srcFile) || {desc: ""}).desc;
					JSDOC.Parser.addSymbol(nsSymbol);
				}
				
				symbol.alias = symbol.alias.replace(/^exports\./, fileNS + '.');
				symbol.name = symbol.name.replace(/^exports\./, '');
				symbol.memberOf = fileNS;
				symbol.isStatic = true;
			}
		}

		// if a symbol alias is documented more than once the first one with the user docs wins
		if (JSDOC.Parser.symbols.hasSymbol(symbol.alias)) {
 			var oldSymbol = JSDOC.Parser.symbols.getSymbol(symbol.alias);
			if (oldSymbol.comment.isUserComment) {
				if (JSDOC.opt.m) return;
				if (symbol.comment.isUserComment) { // old and new are both documented
					LOG.warn("The symbol '"+symbol.alias+"' is documented more than once.");
					return;
				}
				else { // old is documented but new isn't
					return;
				}
			}
		}
		
		// we don't document anonymous things
		if (JSDOC.Parser.conf.ignoreAnonymous && symbol.name.match(/\$anonymous\b/)) return;

		// uderscored things may be treated as if they were marked private, this cascades
		if (JSDOC.Parser.conf.treatUnderscoredAsPrivate && symbol.name.match(/[.#-]_[^.#-]+$/)) {
			if (!symbol.comment.getTag("public").length > 0) symbol.isPrivate = true;
		}
		
		// -p flag is required to document private things
		if (!JSDOC.opt.p && symbol.isPrivate) return; // issue #161 fixed by mcbain.asm
		
		// ignored things are not documented, this doesn't cascade
		if (symbol.isIgnored) return;
		JSDOC.Parser.symbols.addSymbol(symbol);
	},
	
	addBuiltin: function(name) {
		var builtin = new JSDOC.Symbol(name, [], "CONSTRUCTOR", new JSDOC.DocComment(""));
		builtin.isNamespace = true;
		builtin.srcFile = "";
		builtin.isPrivate = false;
		JSDOC.Parser.addSymbol(builtin);
		return builtin;
	},
	
	init: function() {
		JSDOC.Parser.symbols = new JSDOC.SymbolSet();
		JSDOC.Parser.walker = new JSDOC.Walker();
	},
	
	finish: function() {
		JSDOC.Parser.symbols.relate();		
		
		// make a litle report about what was found
		if (JSDOC.Parser.conf.explain) {
			var symbols = JSDOC.Parser.symbols.toArray();
			var srcFile = "";
			for (var i = 0, l = symbols.length; i < l; i++) {
				var symbol = symbols[i];
				if (srcFile != symbol.srcFile) {
					srcFile = symbol.srcFile;
					print("\n"+srcFile+"\n-------------------");
				}
				print(i+":\n  alias => "+symbol.alias + "\n  name => "+symbol.name+ "\n  isa => "+symbol.isa + "\n  memberOf => " + symbol.memberOf + "\n  isStatic => " + symbol.isStatic + ",  isInner => " + symbol.isInner+ ",  isPrivate => " + symbol.isPrivate);
			}
			print("-------------------\n");
		}
	}
}

JSDOC.Parser.parse = function(/**JSDOC.TokenStream*/ts, /**String*/srcFile) {
	JSDOC.Symbol.srcFile = (srcFile || "");
	JSDOC.DocComment.shared = ""; // shared comments don't cross file boundaries
	
	if (!JSDOC.Parser.walker) JSDOC.Parser.init();
	JSDOC.Parser.walker.walk(ts); // adds to our symbols
	
	// filter symbols by option
	for (var p = JSDOC.Parser.symbols._index.first(); p; p = JSDOC.Parser.symbols._index.next()) {
		var symbol = p.value;
		
		if (!symbol) continue;
		
		if (symbol.is("FILE") || symbol.is("GLOBAL")) {
			continue;
		}
		else if (!JSDOC.opt.a && !symbol.comment.isUserComment) {
			JSDOC.Parser.symbols.deleteSymbol(symbol.alias);
		}
		
		if (/#$/.test(symbol.alias)) { // we don't document prototypes
			JSDOC.Parser.symbols.deleteSymbol(symbol.alias);
		}
	}
	
	return JSDOC.Parser.symbols.toArray();
}
