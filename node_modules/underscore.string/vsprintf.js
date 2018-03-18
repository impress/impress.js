var sprintf = require('./sprintf');

module.exports = function vsprintf(fmt, argv) {
  argv.unshift(fmt);
  return sprintf.apply(null, argv);
};
