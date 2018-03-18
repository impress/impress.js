/** @namespace */
myProject = myProject || {};

/** @namespace */
myProject.myModule = (function () {
	/** describe myPrivateVar here */
	var myPrivateVar = "";

	var myPrivateMethod = function () {
	}

	/** @scope myProject.myModule */
	return {
		myPublicMethod: function () {
		}
	};
})();