/**
 * @constructor
 */
function Foo() {
    /**
    	@memberOf Foo.prototype
    */
    function bar(a, b) {
    }
    
    /**
    	@memberOf Foo
    */
    var zip = function(p, q) {
    }
    
    /**
    	@memberOf Foo
    */
    function zop( x,y ) {
    }
    
    /**
    	@memberOf Foo
    	@constructor
    */
    function Fiz() {
    	/** A method of Foo#Fiz. */
    	this.fipple = function(fop){}
    }
}

/**
	@memberOf Foo#
 */
var blat = function() {

}