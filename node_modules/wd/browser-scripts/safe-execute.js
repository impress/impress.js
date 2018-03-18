/* jshint evil:true */
var args = Array.prototype.slice.call(arguments, 0);
var code = args[0], fargs = args[1];
var wrap = function() {
  return eval(code);
};
return wrap.apply(this, fargs);
