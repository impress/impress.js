JSDOC.PluginManager.registerPlugin(
	"JSDOC.commentSrcJson",
	{
		onDocCommentSrc: function(comment) {
			var json;
			if (/^\s*@json\b/.test(comment)) {
				comment.src = new String(comment.src).replace("@json", "");

				eval("json = "+comment.src);
				var tagged = "";
				for (var i in json) {
					var tag = json[i];
					// todo handle cases where tag is an object
					tagged += "@"+i+" "+tag+"\n";
				}
				comment.src = tagged;
			}
		}
	}
);