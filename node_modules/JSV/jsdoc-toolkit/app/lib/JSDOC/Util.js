/**
 * @namespace
 * @deprecated Use {@link FilePath} instead.
 */
JSDOC.Util = {
}

/**
 * @deprecated Use {@link FilePath.fileName} instead.
 */
JSDOC.Util.fileName = function(path) {
	LOG.warn("JSDOC.Util.fileName is deprecated. Use FilePath.fileName instead.");
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(nameStart);
}

/**
 * @deprecated Use {@link FilePath.fileExtension} instead.
 */
JSDOC.Util.fileExtension = function(filename) {
	LOG.warn("JSDOC.Util.fileExtension is deprecated. Use FilePath.fileExtension instead.");
	return filename.split(".").pop().toLowerCase();
};

/**
 * @deprecated Use {@link FilePath.dir} instead.
 */
JSDOC.Util.dir = function(path) {
	LOG.warn("JSDOC.Util.dir is deprecated. Use FilePath.dir instead.");
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(0, nameStart-1);
}
