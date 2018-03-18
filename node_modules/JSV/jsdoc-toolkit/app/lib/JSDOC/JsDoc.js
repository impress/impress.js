/**
	@constructor
	@param [opt] Used to override the commandline options. Useful for testing.
	@version $Id: JsDoc.js 831 2010-03-09 14:24:56Z micmath $
*/
JSDOC.JsDoc = function(/**object*/ opt) {
	if (opt) {
		JSDOC.opt = opt;
	}
	
	if (JSDOC.opt.h) {
		JSDOC.usage();
		quit();
	}
	
	// defend against options that are not sane 
	if (JSDOC.opt._.length == 0) {
		LOG.warn("No source files to work on. Nothing to do.");
		quit();
	}
	if (JSDOC.opt.t === true || JSDOC.opt.d === true) {
		JSDOC.usage();
	}
	
	if (typeof JSDOC.opt.d == "string") {
		if (!JSDOC.opt.d.charAt(JSDOC.opt.d.length-1).match(/[\\\/]/)) {
			JSDOC.opt.d = JSDOC.opt.d+"/";
		}
		LOG.inform("Output directory set to '"+JSDOC.opt.d+"'.");
		IO.mkPath(JSDOC.opt.d);
	}
	if (JSDOC.opt.e) IO.setEncoding(JSDOC.opt.e);
	
	// the -r option: scan source directories recursively
	if (typeof JSDOC.opt.r == "boolean") JSDOC.opt.r = 10;
	else if (!isNaN(parseInt(JSDOC.opt.r))) JSDOC.opt.r = parseInt(JSDOC.opt.r);
	else JSDOC.opt.r = 1;
	
	// the -D option: define user variables
	var D = {};
	if (JSDOC.opt.D) {
		for (var i = 0; i < JSDOC.opt.D.length; i++) {
			var param = JSDOC.opt.D[i];
			// remove first and last character if both == "
			if ( 
				param.length > 1
				&& param.charAt(0) == '"'
				&& param.charAt(param.length-1) == '"'
			) {
				param = param.substr(1, param.length-2);
			}
			var defineParts = param.split(":");
			if (defineParts && defineParts.length > 1) {
				for ( var dpIdx = 2; dpIdx < defineParts.length; dpIdx++ ) {
					defineParts[1] += ':' + defineParts[dpIdx];
				}
				D[defineParts[0]] = defineParts[1];
			}
		}
	}
	JSDOC.opt.D = D;
	// combine any conf file D options with the commandline D options
	if (defined(JSDOC.conf)) for (var c in JSDOC.conf.D) {
 		if (!defined(JSDOC.opt.D[c])) {
 			JSDOC.opt.D[c] = JSDOC.conf.D[c];
 		}
 	}
	
	// Give plugins a chance to initialize
	if (defined(JSDOC.PluginManager)) {
		JSDOC.PluginManager.run("onInit", JSDOC.opt);
	}

	JSDOC.opt.srcFiles = JSDOC.JsDoc._getSrcFiles();
	JSDOC.JsDoc._parseSrcFiles();
	JSDOC.JsDoc.symbolSet = JSDOC.Parser.symbols;
}

/**
	Retrieve source file list.
	@returns {String[]} The pathnames of the files to be parsed.
 */
JSDOC.JsDoc._getSrcFiles = function() {
	JSDOC.JsDoc.srcFiles = [];
	
	var ext = ["js"];
	if (JSDOC.opt.x) {
		ext = JSDOC.opt.x.split(",").map(function($) {return $.toLowerCase()});
	}
	
	for (var i = 0; i < JSDOC.opt._.length; i++) {
		JSDOC.JsDoc.srcFiles = JSDOC.JsDoc.srcFiles.concat(
			IO.ls(JSDOC.opt._[i], JSDOC.opt.r).filter(
				function($) {
					var thisExt = $.split(".").pop().toLowerCase();
					
					if (JSDOC.opt.E) {
						for(var n = 0; n < JSDOC.opt.E.length; n++) {
							if ($.match(new RegExp(JSDOC.opt.E[n]))) {
								LOG.inform("Excluding " + $);
								return false; // if the file matches the regex then it's excluded.
							}
						}
					}
					
					return (ext.indexOf(thisExt) > -1); // we're only interested in files with certain extensions
				}
			)
		);
	}
	
	return JSDOC.JsDoc.srcFiles;
}

JSDOC.JsDoc._parseSrcFiles = function() {
	JSDOC.Parser.init();
	for (var i = 0, l = JSDOC.JsDoc.srcFiles.length; i < l; i++) {
		var srcFile = JSDOC.JsDoc.srcFiles[i];
		
		if (JSDOC.opt.v) LOG.inform("Parsing file: " + srcFile);
		
		try {
			var src = IO.readFile(srcFile);
		}
		catch(e) {
			LOG.warn("Can't read source file '"+srcFile+"': "+e.message);
		}

		var tr = new JSDOC.TokenReader();
		var ts = new JSDOC.TokenStream(tr.tokenize(new JSDOC.TextStream(src)));

		JSDOC.Parser.parse(ts, srcFile);

	}
	JSDOC.Parser.finish();

	if (JSDOC.PluginManager) {
		JSDOC.PluginManager.run("onFinishedParsing", JSDOC.Parser.symbols);
	}
}
