if (typeof JSDOC == "undefined") JSDOC = {};

/**
	@constructor
*/
JSDOC.TokenStream = function(tokens) {
	this.tokens = (tokens || []);
	this.rewind();
}

/**
	@constructor
	@private
*/
function VoidToken(/**String*/type) {
	this.toString = function() {return "<VOID type=\""+type+"\">"};
	this.is = function(){return false;}
}

JSDOC.TokenStream.prototype.rewind = function() {
	this.cursor = -1;
}

/**
	@type JSDOC.Token
*/
JSDOC.TokenStream.prototype.look = function(/**Number*/n, /**Boolean*/considerWhitespace) {
	if (typeof n == "undefined") n = 0;

	if (considerWhitespace == true) {
		if (this.cursor+n < 0 || this.cursor+n > this.tokens.length) return {};
		return this.tokens[this.cursor+n];
	}
	else {
		var count = 0;
		var i = this.cursor;

		while (true) {
			if (i < 0) return new JSDOC.Token("", "VOID", "START_OF_STREAM");
			else if (i > this.tokens.length) return new JSDOC.Token("", "VOID", "END_OF_STREAM");

			if (i != this.cursor && (this.tokens[i] === undefined || this.tokens[i].is("WHIT"))) {
				if (n < 0) i--; else i++;
				continue;
			}
			
			if (count == Math.abs(n)) {
				return this.tokens[i];
			}
			count++;
			(n < 0)? i-- : i++;
		}

		return new JSDOC.Token("", "VOID", "STREAM_ERROR"); // because null isn't an object and caller always expects an object
	}
}

/**
	@type JSDOC.Token|JSDOC.Token[]
*/
JSDOC.TokenStream.prototype.next = function(/**Number*/howMany) {
	if (typeof howMany == "undefined") howMany = 1;
	if (howMany < 1) return null;
	var got = [];

	for (var i = 1; i <= howMany; i++) {
		if (this.cursor+i >= this.tokens.length) {
			return null;
		}
		got.push(this.tokens[this.cursor+i]);
	}
	this.cursor += howMany;

	if (howMany == 1) {
		return got[0];
	}
	else return got;
}

/**
	@type JSDOC.Token[]
*/
JSDOC.TokenStream.prototype.balance = function(/**String*/start, /**String*/stop) {
	if (!stop) stop = JSDOC.Lang.matching(start);
	
	var depth = 0;
	var got = [];
	var started = false;
	
	while ((token = this.look())) {
		if (token.is(start)) {
			depth++;
			started = true;
		}
		
		if (started) {
			got.push(token);
		}
		
		if (token.is(stop)) {
			depth--;
			if (depth == 0) return got;
		}
		if (!this.next()) break;
	}
}

JSDOC.TokenStream.prototype.getMatchingToken = function(/**String*/start, /**String*/stop) {
	var depth = 0;
	var cursor = this.cursor;
	
	if (!start) {
		start = JSDOC.Lang.matching(stop);
		depth = 1;
	}
	if (!stop) stop = JSDOC.Lang.matching(start);
	
	while ((token = this.tokens[cursor])) {
		if (token.is(start)) {
			depth++;
		}
		
		if (token.is(stop) && cursor) {
			depth--;
			if (depth == 0) return this.tokens[cursor];
		}
		cursor++;
	}
}

JSDOC.TokenStream.prototype.insertAhead = function(/**JSDOC.Token*/token) {
	this.tokens.splice(this.cursor+1, 0, token);
}