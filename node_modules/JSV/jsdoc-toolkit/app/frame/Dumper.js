/**
 * @class
<pre>
This is a lightly modified version of Kevin Jones' JavaScript
library Data.Dump. To download the original visit:
    <a href="http://openjsan.org/doc/k/ke/kevinj/Data/Dump/">http://openjsan.org/doc/k/ke/kevinj/Data/Dump/</a>

AUTHORS

The Data.Dump JavaScript module is written by Kevin Jones 
(kevinj@cpan.org), based on Data::Dump by Gisle Aas (gisle@aas.no),
based on Data::Dumper by Gurusamy Sarathy (gsar@umich.edu).

COPYRIGHT

Copyright 2007 Kevin Jones. Copyright 1998-2000,2003-2004 Gisle Aas.
Copyright 1996-1998 Gurusamy Sarathy.

This program is free software; you can redistribute it and/or modify
it under the terms of the Perl Artistic License

See http://www.perl.com/perl/misc/Artistic.html
</pre>
 * @static
 */
Dumper = {
	/** @param [...] The objects to dump. */
	dump: function () {
	    if (arguments.length > 1)
	        return this._dump(arguments);
	    else if (arguments.length == 1)
	        return this._dump(arguments[0]);
	    else
	        return "()";
	},
	
	_dump: function (obj) {
		if (typeof obj == 'undefined') return 'undefined';
		var out;
		if (obj.serialize) { return obj.serialize(); }
		var type = this._typeof(obj);
		if (obj.circularReference) obj.circularReference++;
		switch (type) {
			case 'circular':
				out = "{ //circularReference\n}";
				break;
			case 'object':
				var pairs = new Array;
				
				for (var prop in obj) {
					if (prop != "circularReference" && obj.hasOwnProperty(prop)) { //hide inherited properties
						pairs.push(prop + ': ' + this._dump(obj[prop]));
					}
				}
	
				out = '{' + this._format_list(pairs) + '}';
				break;
	
			case 'string':
				for (var prop in Dumper.ESC) {
					if (Dumper.ESC.hasOwnProperty(prop)) {
						obj = obj.replace(prop, Dumper.ESC[prop]);
					}
				}
	
			// Escape UTF-8 Strings
				if (obj.match(/^[\x00-\x7f]*$/)) {
					out = '"' + obj.replace(/\"/g, "\\\"").replace(/([\n\r]+)/g, "\\$1") + '"';
				}
				else {
					out = "unescape('"+escape(obj)+"')";
				}
				break;
	
			case 'array':
				var elems = new Array;
	
				for (var i=0; i<obj.length; i++) {
					elems.push( this._dump(obj[i]) );
				}
	
				out = '[' + this._format_list(elems) + ']';
				break;
	
			case 'date':
			// firefox returns GMT strings from toUTCString()...
			var utc_string = obj.toUTCString().replace(/GMT/,'UTC');
				out = 'new Date("' + utc_string + '")';
				break;
	
			case 'element':
				// DOM element
				out = this._dump_dom(obj);
				break;
		
				default:
					out = obj;
		}
	
		out = String(out).replace(/\n/g, '\n    ');
		out = out.replace(/\n    (.*)$/,"\n$1");
	
		return out;
	},
	
	_format_list: function (list) {
		if (!list.length) return '';
		var nl = list.toString().length > 60 ? '\n' : ' ';
		return nl + list.join(',' + nl) + nl;
    },
    
    _typeof: function (obj) {
    	if (obj && obj.circularReference && obj.circularReference > 1) return 'circular';
		if (Array.prototype.isPrototypeOf(obj)) return 'array';
		if (Date.prototype.isPrototypeOf(obj)) return 'date';
		if (typeof obj.nodeType != 'undefined') return 'element';
		return typeof(obj);
	},
	
	_dump_dom: function (obj) {
		return '"' + Dumper.nodeTypes[obj.nodeType] + '"';
	}
};

Dumper.ESC = {
    "\t": "\\t",
    "\n": "\\n",
    "\f": "\\f"
};

Dumper.nodeTypes = {
    1: "ELEMENT_NODE",
    2: "ATTRIBUTE_NODE",
    3: "TEXT_NODE",
    4: "CDATA_SECTION_NODE",
    5: "ENTITY_REFERENCE_NODE",
    6: "ENTITY_NODE",
    7: "PROCESSING_INSTRUCTION_NODE",
    8: "COMMENT_NODE",
    9: "DOCUMENT_NODE",
    10: "DOCUMENT_TYPE_NODE",
    11: "DOCUMENT_FRAGMENT_NODE",
    12: "NOTATION_NODE"
};