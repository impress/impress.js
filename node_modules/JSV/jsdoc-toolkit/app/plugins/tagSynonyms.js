JSDOC.PluginManager.registerPlugin(
	"JSDOC.tagSynonyms",
	{
		onDocCommentSrc: function(comment) {
			comment.src = comment.src.replace(/@methodOf\b/i, "@function\n@memberOf");
			comment.src = comment.src.replace(/@fieldOf\b/i, "@field\n@memberOf");
		},
		
		onDocCommentTags: function(comment) {
			for (var i = 0, l = comment.tags.length; i < l; i++) {
				var title = comment.tags[i].title.toLowerCase();
				var syn;
				if ((syn = JSDOC.tagSynonyms.synonyms["="+title])) {
					comment.tags[i].title = syn;
				}
			}
		}
	}
);

new Namespace(
	"JSDOC.tagSynonyms",
	function() {
		JSDOC.tagSynonyms.synonyms = {
			"=member":             "memberOf",
			"=memberof":           "memberOf",
			"=description":        "desc",
			"=exception":          "throws",
			"=argument":           "param",
			"=returns":            "return",
			"=classdescription":   "class",
			"=fileoverview":       "overview",
			"=extends":            "augments",
			"=base":               "augments",
			"=projectdescription": "overview",
			"=classdescription":   "class",
			"=link":               "see",
			"=borrows":            "inherits",
			"=scope":              "lends",
			"=construct":          "constructor"
		}
	}
);