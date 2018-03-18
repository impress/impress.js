_global_ = this;

function Namespace(name, f) {
	var n = name.split(".");
	for (var o = _global_, i = 0, l = n.length; i < l; i++) {
		o = o[n[i]] = o[n[i]] || {};
	}
	
	if (f) f();
}