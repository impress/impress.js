var trim = require('./trim');
var parseNumber = function(source) {
  return source * 1 || 0;
};

module.exports = function toNumber(num, precision) {
  if (num == null) return 0;
  var factor = Math.pow(10, isFinite(precision) ? precision : 0);
  return Math.round(num * factor) / factor;
};
