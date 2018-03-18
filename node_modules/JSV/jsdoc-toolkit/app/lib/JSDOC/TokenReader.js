if (typeof JSDOC == "undefined") JSDOC = {};

/**
	@class Search a {@link JSDOC.TextStream} for language tokens.
*/
JSDOC.TokenReader = function() {
	this.keepDocs = true;
	this.keepWhite = false;
	this.keepComments = false;
}

/**
	@type {JSDOC.Token[]}
 */
JSDOC.TokenReader.prototype.tokenize = function(/**JSDOC.TextStream*/stream) {
	var tokens = [];
	/**@ignore*/ tokens.last    = function() { return tokens[tokens.length-1]; }
	/**@ignore*/ tokens.lastSym = function() {
		for (var i = tokens.length-1; i >= 0; i--) {
			if (!(tokens[i].is("WHIT") || tokens[i].is("COMM"))) return tokens[i];
		}
	}

	while (!stream.look().eof) {
		if (this.read_mlcomment(stream, tokens)) continue;
		if (this.read_slcomment(stream, tokens)) continue;
		if (this.read_dbquote(stream, tokens))   continue;
		if (this.read_snquote(stream, tokens))   continue;
		if (this.read_regx(stream, tokens))      continue;
		if (this.read_numb(stream, tokens))      continue;
		if (this.read_punc(stream, tokens))      continue;
		if (this.read_newline(stream, tokens))   continue;
		if (this.read_space(stream, tokens))     continue;
		if (this.read_word(stream, tokens))      continue;
		
		// if execution reaches here then an error has happened
		tokens.push(new JSDOC.Token(stream.next(), "TOKN", "UNKNOWN_TOKEN"));
	}
	return tokens;
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_word = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found = "";
	while (!stream.look().eof && JSDOC.Lang.isWordChar(stream.look())) {
		found += stream.next();
	}
	
	if (found === "") {
		return false;
	}
	else {
		var name;
		if ((name = JSDOC.Lang.keyword(found))) tokens.push(new JSDOC.Token(found, "KEYW", name));
		else tokens.push(new JSDOC.Token(found, "NAME", "NAME"));
		return true;
	}
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_punc = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found = "";
	var name;
	while (!stream.look().eof && JSDOC.Lang.punc(found+stream.look())) {
		found += stream.next();
	}
	
	if (found === "") {
		return false;
	}
	else {
		tokens.push(new JSDOC.Token(found, "PUNC", JSDOC.Lang.punc(found)));
		return true;
	}
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_space = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found = "";
	
	while (!stream.look().eof && JSDOC.Lang.isSpace(stream.look())) {
		found += stream.next();
	}
	
	if (found === "") {
		return false;
	}
	else {
		if (this.collapseWhite) found = " ";
		if (this.keepWhite) tokens.push(new JSDOC.Token(found, "WHIT", "SPACE"));
		return true;
	}
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_newline = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found = "";
	
	while (!stream.look().eof && JSDOC.Lang.isNewline(stream.look())) {
		found += stream.next();
	}
	
	if (found === "") {
		return false;
	}
	else {
		if (this.collapseWhite) found = "\n";
		if (this.keepWhite) tokens.push(new JSDOC.Token(found, "WHIT", "NEWLINE"));
		return true;
	}
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_mlcomment = function(/**JSDOC.TokenStream*/stream, tokens) {
	if (stream.look() == "/" && stream.look(1) == "*") {
		var found = stream.next(2);
		
		while (!stream.look().eof && !(stream.look(-1) == "/" && stream.look(-2) == "*")) {
			found += stream.next();
		}
		
		// to start doclet we allow /** or /*** but not /**/ or /****
		if (/^\/\*\*([^\/]|\*[^*])/.test(found) && this.keepDocs) tokens.push(new JSDOC.Token(found, "COMM", "JSDOC"));
		else if (this.keepComments) tokens.push(new JSDOC.Token(found, "COMM", "MULTI_LINE_COMM"));
		return true;
	}
	return false;
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_slcomment = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found;
	if (
		(stream.look() == "/" && stream.look(1) == "/" && (found=stream.next(2)))
		|| 
		(stream.look() == "<" && stream.look(1) == "!" && stream.look(2) == "-" && stream.look(3) == "-" && (found=stream.next(4)))
	) {
		
		while (!stream.look().eof && !JSDOC.Lang.isNewline(stream.look())) {
			found += stream.next();
		}
		
		if (this.keepComments) {
			tokens.push(new JSDOC.Token(found, "COMM", "SINGLE_LINE_COMM"));
		}
		return true;
	}
	return false;
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_dbquote = function(/**JSDOC.TokenStream*/stream, tokens) {
	if (stream.look() == "\"") {
		// find terminator
		var string = stream.next();
		
		while (!stream.look().eof) {
			if (stream.look() == "\\") {
				if (JSDOC.Lang.isNewline(stream.look(1))) {
					do {
						stream.next();
					} while (!stream.look().eof && JSDOC.Lang.isNewline(stream.look()));
					string += "\\\n";
				}
				else {
					string += stream.next(2);
				}
			}
			else if (stream.look() == "\"") {
				string += stream.next();
				tokens.push(new JSDOC.Token(string, "STRN", "DOUBLE_QUOTE"));
				return true;
			}
			else {
				string += stream.next();
			}
		}
	}
	return false; // error! unterminated string
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_snquote = function(/**JSDOC.TokenStream*/stream, tokens) {
	if (stream.look() == "'") {
		// find terminator
		var string = stream.next();
		
		while (!stream.look().eof) {
			if (stream.look() == "\\") { // escape sequence
				string += stream.next(2);
			}
			else if (stream.look() == "'") {
				string += stream.next();
				tokens.push(new JSDOC.Token(string, "STRN", "SINGLE_QUOTE"));
				return true;
			}
			else {
				string += stream.next();
			}
		}
	}
	return false; // error! unterminated string
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_numb = function(/**JSDOC.TokenStream*/stream, tokens) {
	if (stream.look() === "0" && stream.look(1) == "x") {
		return this.read_hex(stream, tokens);
	}
	
	var found = "";
	
	while (!stream.look().eof && JSDOC.Lang.isNumber(found+stream.look())){
		found += stream.next();
	}
	
	if (found === "") {
		return false;
	}
	else {
		if (/^0[0-7]/.test(found)) tokens.push(new JSDOC.Token(found, "NUMB", "OCTAL"));
		else tokens.push(new JSDOC.Token(found, "NUMB", "DECIMAL"));
		return true;
	}
}
/*t:
	requires("../lib/JSDOC/TextStream.js");
	requires("../lib/JSDOC/Token.js");
	requires("../lib/JSDOC/Lang.js");
	
	plan(3, "testing JSDOC.TokenReader.prototype.read_numb");
	
	//// setup
	var src = "function foo(num){while (num+8.0 >= 0x20 && num < 0777){}}";
	var tr = new JSDOC.TokenReader();
	var tokens = tr.tokenize(new JSDOC.TextStream(src));
	
	var hexToken, octToken, decToken;
	for (var i = 0; i < tokens.length; i++) {
		if (tokens[i].name == "HEX_DEC") hexToken = tokens[i];
		if (tokens[i].name == "OCTAL") octToken = tokens[i];
		if (tokens[i].name == "DECIMAL") decToken = tokens[i];
	}
	////
	
	is(decToken.data, "8.0", "decimal number is found in source.");
	is(hexToken.data, "0x20", "hexdec number is found in source (issue #99).");
	is(octToken.data, "0777", "octal number is found in source.");
*/

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_hex = function(/**JSDOC.TokenStream*/stream, tokens) {
	var found = stream.next(2);
	
	while (!stream.look().eof) {
		if (JSDOC.Lang.isHexDec(found) && !JSDOC.Lang.isHexDec(found+stream.look())) { // done
			tokens.push(new JSDOC.Token(found, "NUMB", "HEX_DEC"));
			return true;
		}
		else {
			found += stream.next();
		}
	}
	return false;
}

/**
	@returns {Boolean} Was the token found?
 */
JSDOC.TokenReader.prototype.read_regx = function(/**JSDOC.TokenStream*/stream, tokens) {
	var last;
	if (
		stream.look() == "/"
		&& 
		(
			
			(
				!(last = tokens.lastSym()) // there is no last, the regex is the first symbol
				|| 
				(
					   !last.is("NUMB")
					&& !last.is("NAME")
					&& !last.is("RIGHT_PAREN")
					&& !last.is("RIGHT_BRACKET")
				)
			)
		)
	) {
		var regex = stream.next();
		
		while (!stream.look().eof) {
			if (stream.look() == "\\") { // escape sequence
				regex += stream.next(2);
			}
			else if (stream.look() == "/") {
				regex += stream.next();
				
				while (/[gmi]/.test(stream.look())) {
					regex += stream.next();
				}
				
				tokens.push(new JSDOC.Token(regex, "REGX", "REGX"));
				return true;
			}
			else {
				regex += stream.next();
			}
		}
		// error: unterminated regex
	}
	return false;
}
