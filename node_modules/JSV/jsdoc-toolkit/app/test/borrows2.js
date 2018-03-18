// testing circular borrows

/**
	@class
	@borrows Bar#zop as this.my_zop
*/
function Foo() {
	/** this is a zip. */
	this.zip = function() {}
	
	this.my_zop = new Bar().zop;
}

/**
	@class
	@borrows Foo#zip as this.my_zip
*/
function Bar() {
	/** this is a zop. */
	this.zop = function() {}
	
	this.my_zip = new Foo().zip;
}