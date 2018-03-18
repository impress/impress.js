/* jshint evil:true */
var args = Array.prototype.slice.call(arguments, 0);
var code = args[0], fargs = args[1], done = args[2];
var wrap = function() {
  return eval(code);
};
fargs.push(done);
wrap.apply(this, fargs);
