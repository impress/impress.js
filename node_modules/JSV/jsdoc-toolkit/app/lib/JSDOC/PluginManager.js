/**
	@namespace Holds functionality related to running plugins.
*/
JSDOC.PluginManager = {
}

/**
	@param name A unique name that identifies that plugin.
	@param handlers A collection of named functions. The names correspond to hooks in the core code.
*/
JSDOC.PluginManager.registerPlugin = function(/**String*/name, /**Object*/handlers) {
	if (!defined(JSDOC.PluginManager.plugins))
		/** The collection of all plugins. Requires a unique name for each.
		*/
		JSDOC.PluginManager.plugins = {};
	
	
	JSDOC.PluginManager.plugins[name] = handlers;
}

/**
	@param hook The name of the hook that is being caught.
	@param target Any object. This will be passed as the only argument to the handler whose
	name matches the hook name. Handlers cannot return a value, so must modify the target
	object to have an effect.
*/
JSDOC.PluginManager.run = function(/**String*/hook, /**Mixed*/target) {
	for (var name in JSDOC.PluginManager.plugins) {
		if (defined(JSDOC.PluginManager.plugins[name][hook])) {
			JSDOC.PluginManager.plugins[name][hook](target);
		}
	}
}
