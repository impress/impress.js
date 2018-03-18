/** the parent */
var box = {};

/** @namespace */
box.holder = {}

box.holder.foo = function() {
	/** the counter */
	this.counter = 1;
}

box.holder.foo();
print(box.holder.counter);
