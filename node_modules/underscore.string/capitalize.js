var makeString = require('./helper/makeString');

module.exports = function capitalize(str) {
  str = makeString(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
};
