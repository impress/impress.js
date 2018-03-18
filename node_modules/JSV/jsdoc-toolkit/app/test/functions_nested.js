/** @constructor */
function Zop() {
}

/**
 @class
*/
Foo = function(id) {
	// this is a bit twisted, but if you call Foo() you will then
	// modify Foo(). This is kinda, sorta non-insane, because you
	// would have to call Foo() 100% of the time to use Foo's methods
	Foo.prototype.methodOne = function(bar) {
	  alert(bar);
	};
	
	// same again
	Foo.prototype.methodTwo = function(bar2) {
	  alert(bar2);
	};
	
	// and these are only executed if the enclosing function is actually called
	// and who knows if that will ever happen?
	Bar = function(pez) {
	  alert(pez);
	};
	Zop.prototype.zap = function(p){
		alert(p);
	};
	
	// but this is only visible inside Foo
	function inner() {
	}
};
