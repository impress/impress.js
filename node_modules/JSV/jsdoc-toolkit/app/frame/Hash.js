/**
	@constructor
	@example
	var _index = new Hash();
	_index.set("a", "apple");
	_index.set("b", "blue");
	_index.set("c", "coffee");

	for (var p = _index.first(); p; p = _index.next()) {
		print(p.key+" is for "+p.value);
	}
	
 */
var Hash = function() {
	this._map = {};
	this._keys = [];
	this._vals = [];
	this.reset();
}

Hash.prototype.set = function(k, v) {
	if (k != "") {
		this._keys.push(k);
		this._map["="+k] = this._vals.length;
		this._vals.push(v);
	}
}

Hash.prototype.replace = function(k, k2, v) {
	if (k == k2) return;

	var offset = this._map["="+k];
	this._keys[offset] = k2;
	if (typeof v != "undefined") this._vals[offset] = v;
	this._map["="+k2] = offset;
	delete(this._map["="+k]);
}

Hash.prototype.drop = function(k) {
	if (k != "") {
		var offset = this._map["="+k];
		this._keys.splice(offset, 1);
		this._vals.splice(offset, 1);
		delete(this._map["="+k]);
		for (var p in this._map) {
			if (this._map[p] >= offset) this._map[p]--;
		}
		if (this._cursor >= offset && this._cursor > 0) this._cursor--;
	}
}

Hash.prototype.get = function(k) {
	if (k != "") {
		return this._vals[this._map["="+k]];
	}
}

Hash.prototype.keys = function() {
	return this._keys;
}

Hash.prototype.hasKey = function(k) {
	if (k != "") {
		return (typeof this._map["="+k] != "undefined");
	}
}

Hash.prototype.values = function() {
	return this._vals;
}

Hash.prototype.reset = function() {
	this._cursor = 0;
}

Hash.prototype.first = function() {
	this.reset();
	return this.next();
}

Hash.prototype.next = function() {
	if (this._cursor++ < this._keys.length)
		return {key: this._keys[this._cursor-1], value: this._vals[this._cursor-1]};
}