/**
	@class
	@inherits Bar#zop as #my_zop
*/
function Foo() {
	/** this is a zip. */
	this.zip = function() {}
	
	/** from Bar */
	this.my_zop = new Bar().zop;
}

/**
	@class
	@borrows Foo#zip as this.my_zip
*/
function Bar() {
	/** this is a zop. */
	this.zop = function() {}
	
	/** from Foo */
	this.my_zip = new Foo().zip;
}

/** @namespace */
var myObject = {
	/**
		@type function
	*/
	myFunc: getFunction()
}