/**@constructor*/
function Reflection(obj) {
	this.obj = obj;
}

Reflection.prototype.getConstructorName = function() {
	if (this.obj.constructor.name) return this.obj.constructor.name;
	var src = this.obj.constructor.toSource();
	var name = src.substring(name.indexOf("function")+8, src.indexOf('(')).replace(/ /g,'');
	return name;
}

Reflection.prototype.getMethod = function(name) {
	for (var p in this.obj) {
		if (p == name && typeof(this.obj[p]) == "function") return this.obj[p];
	}
	return null;
}

Reflection.prototype.getParameterNames = function() {
	var src = this.obj.toSource();
	src = src.substring(
		src.indexOf("(", 8)+1, src.indexOf(")")
	);
	return src.split(/, ?/);
}
