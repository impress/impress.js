/**
 @name Response
 @class
*/

Response.prototype = {
	/**
	 @name Response#text
	 @function
	 @description
		Gets the body of the response as plain text
	 @returns {String}
		Response as text
	*/

	text: function() {
		return this.nativeResponse.responseText;
	}
}