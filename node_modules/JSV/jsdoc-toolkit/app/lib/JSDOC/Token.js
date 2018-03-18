if (typeof JSDOC == "undefined") JSDOC = {};

/**
	@constructor
*/
JSDOC.Token = function(data, type, name) {
	this.data = data;
	this.type = type;
	this.name = name;
}

JSDOC.Token.prototype.toString = function() { 
	return "<"+this.type+" name=\""+this.name+"\">"+this.data+"</"+this.type+">";
}

JSDOC.Token.prototype.is = function(what) {
	return this.name === what || this.type === what;
}