/** @constructor */
function Article() {
}

Article.prototype.init = function(title) {
	/** the instance title */
	this.title = title;
	
	/** the static counter */
	Article.counter = 1;
}

a = new Article();
a.Init("my title");

print(a.title);
print(Article.counter);