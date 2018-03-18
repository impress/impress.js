var _ = require("lodash");
var overrides = {
  username: "u",
  accessKey: "k",
  verboseDebugging: "verbose",
  port: "P"
};

var booleans = {
  verboseDebugging: true,
  doctor: true
};

module.exports = function processOptions(options) {
  options.username = options.username || process.env.SAUCE_USERNAME;
  options.accessKey = options.accessKey || process.env.SAUCE_ACCESS_KEY;

  return _.reduce(
    _.omit(options, ["readyFileId", "verbose", "logger", "log"]),
    function (argList, value, key) {
      if (value == null) {
        return argList;
      }
      var argName = overrides[key] || _.kebabCase(key);

      if (argName.length === 1) {
        argName = "-" + argName;
      } else {
        argName = "--" + argName;
      }

      if (Array.isArray(value)) {
        value = value.join(",");
      }

      if (booleans[key] || value === true) {
        argList.push(argName);
      } else {
        argList.push(argName, value);
      }

      return argList;
    }, []);
};
