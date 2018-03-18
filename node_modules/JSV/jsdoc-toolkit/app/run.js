/**
 * @fileOverview
 * A bootstrap script that creates some basic required objects
 * for loading other scripts.
 * @author Michael Mathews, micmath@gmail.com
 * @version $Id: run.js 756 2009-01-07 21:32:58Z micmath $
 */

/**
 * @namespace Keep track of any messages from the running script.
 */
LOG = {
	warn: function(msg, e) {
		if (JSDOC.opt.q) return;
		if (e) msg = e.fileName+", line "+e.lineNumber+": "+msg;
		
		msg = ">> WARNING: "+msg;
		LOG.warnings.push(msg);
		if (LOG.out) LOG.out.write(msg+"\n");
		else print(msg);
	},

	inform: function(msg) {
		if (JSDOC.opt.q) return;
		msg = " > "+msg;
		if (LOG.out) LOG.out.write(msg+"\n");
		else if (typeof LOG.verbose != "undefined" && LOG.verbose) print(msg);
	}
};
LOG.warnings = [];
LOG.verbose = false
LOG.out = undefined;

/**
 *	@class Manipulate a filepath.
 */
function FilePath(absPath, separator) {
	this.slash =  separator || "/"; 
	this.root = this.slash;
	this.path = [];
	this.file = "";
	
	var parts = absPath.split(/[\\\/]/);
	if (parts) {
		if (parts.length) this.root = parts.shift() + this.slash;
		if (parts.length) this.file =  parts.pop()
		if (parts.length) this.path = parts;
	}
	
	this.path = this.resolvePath();
}

/** Collapse any dot-dot or dot items in a filepath. */
FilePath.prototype.resolvePath = function() {
	var resolvedPath = [];
	for (var i = 0; i < this.path.length; i++) {
		if (this.path[i] == "..") resolvedPath.pop();
		else if (this.path[i] != ".") resolvedPath.push(this.path[i]);
	}
	return resolvedPath;
}

/** Trim off the filename. */
FilePath.prototype.toDir = function() {
	if (this.file) this.file = "";
	return this;
}

/** Go up a directory. */
FilePath.prototype.upDir = function() {
	this.toDir();
	if (this.path.length) this.path.pop();
	return this;
}

FilePath.prototype.toString = function() {
	return this.root
		+ this.path.join(this.slash)
		+ ((this.path.length > 0)? this.slash : "")
		+ this.file;
}

/**
 * Turn a path into just the name of the file.
 */
FilePath.fileName = function(path) {
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(nameStart);
}

/**
 * Get the extension of a filename
 */
FilePath.fileExtension = function(filename) {
   return filename.split(".").pop().toLowerCase();
};

/**
 * Turn a path into just the directory part.
 */
FilePath.dir = function(path) {
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(0, nameStart-1);
}


importClass(java.lang.System);

/**
 * @namespace A collection of information about your system.
 */
SYS = {
	/**
	 * Information about your operating system: arch, name, version.
	 * @type string
	 */
	os: [
		new String(System.getProperty("os.arch")),
		new String(System.getProperty("os.name")),
		new String(System.getProperty("os.version"))
	].join(", "),
	
	/**
	 * Which way does your slash lean.
	 * @type string
	 */
	slash: System.getProperty("file.separator")||"/",
	
	/**
	 * The path to the working directory where you ran java.
	 * @type string
	 */
	userDir: new String(System.getProperty("user.dir")),
	
	/**
	 * Where is Java's home folder.
	 * @type string
	 */
	javaHome: new String(System.getProperty("java.home")),
	
	/**
	 * The absolute path to the directory containing this script.
	 * @type string
	 */
	pwd: undefined
};

// jsrun appends an argument, with the path to here.
if (arguments[arguments.length-1].match(/^-j=(.+)/)) {
	if (RegExp.$1.charAt(0) == SYS.slash || RegExp.$1.charAt(1) == ":") { // absolute path to here
		SYS.pwd = new FilePath(RegExp.$1).toDir().toString();
	}
	else { // relative path to here
		SYS.pwd = new FilePath(SYS.userDir + SYS.slash + RegExp.$1).toDir().toString();
	}
	arguments.pop();
}
else {
	print("The run.js script requires you use jsrun.jar.");
	quit();
}

// shortcut
var File = Packages.java.io.File;

/**
 * @namespace A collection of functions that deal with reading a writing to disk.
 */
IO = {

	/**
	 * Create a new file in the given directory, with the given name and contents.
	 */
	saveFile: function(/**string*/ outDir, /**string*/ fileName, /**string*/ content) {
		var out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(outDir+SYS.slash+fileName),
				IO.encoding
			)
		);
		out.write(content);
		out.flush();
		out.close();
	},
	
	/**
	 * @type string
	 */
	readFile: function(/**string*/ path) {
		if (!IO.exists(path)) {
			throw "File doesn't exist there: "+path;
		}
		return readFile(path, IO.encoding);
	},

	/**
	 * @param inFile 
	 * @param outDir
	 * @param [fileName=The original filename]
	 */
	copyFile: function(/**string*/ inFile, /**string*/ outDir, /**string*/ fileName) {
		if (fileName == null) fileName = FilePath.fileName(inFile);
	
		var inFile = new File(inFile);
		var outFile = new File(outDir+SYS.slash+fileName);
		
		var bis = new Packages.java.io.BufferedInputStream(new Packages.java.io.FileInputStream(inFile), 4096);
		var bos = new Packages.java.io.BufferedOutputStream(new Packages.java.io.FileOutputStream(outFile), 4096);
		var theChar;
		while ((theChar = bis.read()) != -1) {
			bos.write(theChar);
		}
		bos.close();
		bis.close();
	},

	/**
	 * Creates a series of nested directories.
	 */
	mkPath: function(/**Array*/ path) {
		if (path.constructor != Array) path = path.split(/[\\\/]/);
		var make = "";
		for (var i = 0, l = path.length; i < l; i++) {
			make += path[i] + SYS.slash;
			if (! IO.exists(make)) {
				IO.makeDir(make);
			}
		}
	},
	
	/**
	 * Creates a directory at the given path.
	 */
	makeDir: function(/**string*/ path) {
		(new File(path)).mkdir();
	},

	/**
	 * @type string[]
	 * @param dir The starting directory to look in.
	 * @param [recurse=1] How many levels deep to scan.
	 * @returns An array of all the paths to files in the given dir.
	 */
	ls: function(/**string*/ dir, /**number*/ recurse, _allFiles, _path) {
		if (_path === undefined) { // initially
			var _allFiles = [];
			var _path = [dir];
		}
		if (_path.length == 0) return _allFiles;
		if (recurse === undefined) recurse = 1;
		
		dir = new File(dir);
		if (!dir.directory) return [String(dir)];
		var files = dir.list();
		
		for (var f = 0; f < files.length; f++) {
			var file = String(files[f]);
			if (file.match(/^\.[^\.\/\\]/)) continue; // skip dot files
	
			if ((new File(_path.join(SYS.slash)+SYS.slash+file)).list()) { // it's a directory
				_path.push(file);
				if (_path.length-1 < recurse) IO.ls(_path.join(SYS.slash), recurse, _allFiles, _path);
				_path.pop();
			}
			else {
				_allFiles.push((_path.join(SYS.slash)+SYS.slash+file).replace(SYS.slash+SYS.slash, SYS.slash));
			}
		}
	
		return _allFiles;
	},

	/**
	 * @type boolean
	 */
	exists: function(/**string*/ path) {
		file = new File(path);
	
		if (file.isDirectory()){
			return true;
		}
		if (!file.exists()){
			return false;
		}
		if (!file.canRead()){
			return false;
		}
		return true;
	},

	/**
	 * 
	 */
	open: function(/**string*/ path, /**string*/ append) {
		var append = true;
		var outFile = new File(path);
		var out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(outFile, append),
				IO.encoding
			)
		);
		return out;
	},

	/**
	 * Sets {@link IO.encoding}.
	 * Encoding is used when reading and writing text to files,
	 * and in the meta tags of HTML output.
	 */
	setEncoding: function(/**string*/ encoding) {
		if (/ISO-8859-([0-9]+)/i.test(encoding)) {
			IO.encoding = "ISO8859_"+RegExp.$1;
		}
		else {
			IO.encoding = encoding;
		}
	},

	/**
	 * @default "utf-8"
	 * @private
	 */
	encoding: "utf-8",
	
	/**
	 * Load the given script.
	 */
	include: function(relativePath) {
		load(SYS.pwd+relativePath);
	},
	
	/**
	 * Loads all scripts from the given directory path.
	 */
	includeDir: function(path) {
		if (!path) return;
		
		for (var lib = IO.ls(SYS.pwd+path), i = 0; i < lib.length; i++) 
			if (/\.js$/i.test(lib[i])) load(lib[i]);
	}
}

// now run the application
IO.include("frame.js");
IO.include("main.js");

main();
