var makeString = require('./helper/makeString');
var escapeChars = require('./helper/escapeChars');
var reversedEscapeChars = {};

for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
reversedEscapeChars["'"] = '#39';

module.exports = function escapeHTML(str) {
  return makeString(str).replace(/[&<>"']/g, function(m) {
    return '&' + reversedEscapeChars[m] + ';';
  });
};
