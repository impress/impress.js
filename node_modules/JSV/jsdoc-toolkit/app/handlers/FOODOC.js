/**
   This is the main container for the FOODOC handler.
   @namespace
*/
FOODOC = {
};

/** The current version string of this application. */
FOODOC.VERSION = "1.0";

FOODOC.handle = function(srcFile, src) {
	LOG.inform("Handling file '" + srcFile + "'");
	
	return [
		new JSDOC.Symbol(
			"foo",
			[],
			"VIRTUAL",
			new JSDOC.DocComment("/** This is a foo. */")
		)
	];
};

FOODOC.publish = function(symbolgroup) {
	LOG.inform("Publishing symbolgroup.");
};
