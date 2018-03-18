/* jshint evil:true */
var args = Array.prototype.slice.call(arguments, 0);
var condExpr = args[0], timeout = args[1],
    poll = args[2], cb = args[3];
var waitForConditionImpl = function(conditionExpr, limit, poll, cb) {
  var res;
  if ((new Date().getTime()) < limit) {
    res = eval(conditionExpr);
    if (res === true ) {
      cb(res);
    } else {
      setTimeout(function() {
        waitForConditionImpl(conditionExpr, limit, poll, cb);
      }, poll);
    }
  } else {
    res = eval(conditionExpr);
    return cb(res);
  }
};
var limit = (new Date().getTime()) + timeout;
waitForConditionImpl(condExpr, limit, poll, cb);
