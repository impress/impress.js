JSDOC.PluginManager.registerPlugin(
	"JSDOC.symbolLink",
	{
		onSymbolLink: function(link) {
			// modify link.linkPath (the href part of the link)
			// or link.linkText (the text displayed)
			// or link.linkInner (the #name part of the link)
		}
	}
);