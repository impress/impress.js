/**
 * A trivial bootstrap class that simply adds the path to the
 * .js file as an argument to the Rhino call. This little hack
 * allows the code in the .js file to have access to it's own 
 * path via the Rhino arguments object. This is necessary to 
 * allow the .js code to find resource files in a location 
 * relative to itself.
 *
 * USAGE: java -jar jsdebug.jar path/to/file.js
 */
public class JsDebugRun {
	public static void main(String[] args) {
		String[] jsargs = {"-j="+args[0]};
		
		String[] allArgs = new String[jsargs.length + args.length];
		System.arraycopy(args, 0, allArgs, 0, args.length);
		System.arraycopy(jsargs, 0, allArgs, args.length ,jsargs.length);

		org.mozilla.javascript.tools.debugger.Main.main(allArgs);
    }
}
