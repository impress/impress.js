
/**
	Get the entire flavor.
	@name flavor^3
	@function
	@returns {Object} The entire flavor hash.
*/
/**
	Get a named flavor.
	@name flavor^2
	@function
	@param {String} name The name of the flavor to get.
	@returns {String} The value of that flavor.
*/
/**
	Set the flavor.
	@param {String} name The name of the flavor to set.
	@param {String} value The value of the flavor.
	@returns {String} The value of that flavor.
*/
function flavor(name, value) {
	if (arguments.length > 1) flavor[name] = value;
	else if (arguments.length == 1) return flavor[name];
	else return flavor;
}