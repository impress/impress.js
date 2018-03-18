/**
	@constructor
	@param columns The number of columns.
*/
function Layout(/**int*/columns){
	/**
		@param [id] The id of the element.
		@param elName The name of the element.
	*/
	this.getElement = function(
		/** string */ elName,
		/** number|string */ id
	) {
	};
	
	/** 
		@constructor
	 */
	this.Canvas = function(top, left, /**int*/width, height) {
		/** Is it initiated yet? */
		this.initiated = true;
	}
	
	this.rotate = function(/**nothing*/) {
	}
	
	/** 
	@param x
	@param y
	@param {zoppler} z*/
	this.init = function(x, y, /**abbler*/z) {
		/** The xyz. */
		this.xyz = x+y+z;
		this.getXyz = function() {
		}
	}
}
